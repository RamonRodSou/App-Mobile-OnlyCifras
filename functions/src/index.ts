import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { HttpsError, onCall } from "firebase-functions/v2/https";
admin.initializeApp();

const db = admin.firestore();

interface ManageMemberData {
    groupId: string;
    targetUserId: string;
    action: "promote" | "demote" | "remove";
}

interface RegisterData {
    email: string;
    password: string;
    name: string;
    birthdate: string;
    cpf: string;
    phone: string;
    activePlan: string;
}

export const createGroup = onCall(async (request) => {
    const uid = request.auth?.uid;
    if (!uid) {
        throw new HttpsError("unauthenticated", "Você precisa estar logado.");
    }

    const groupName = request.data?.groupName;
    if (typeof groupName !== "string" || groupName.trim().length < 3) {
        throw new HttpsError("invalid-argument", "O nome do grupo deve ter ao menos 3 caracteres.");
    }

    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();
    if (!userData?.activePlan) {
        throw new HttpsError("permission-denied", "Plano de assinatura não encontrado.");
    }
    const planDoc = await db.collection("plans").doc(userData.activePlan).get();
    const planData = planDoc.data();
    if (!planData || (planData?.maxGroups ?? 0) === 0) {
        throw new HttpsError("permission-denied", "Seu plano atual não permite criar grupos.");
    }
    const userGroupsQuery = await db.collection("groups").where("ownerId", "==", uid).get();
    if (userGroupsQuery.size >= (planData?.maxGroups ?? 0)) {
        throw new HttpsError("resource-exhausted", "Você atingiu o limite de grupos do seu plano.");
    }

    try {
        const groupRef = db.collection("groups").doc();
        const userRef = db.collection("users").doc(uid);
        const inviteCode = generateInviteCode();

        await db.runTransaction(async (transaction) => {
            transaction.set(groupRef, {
                name: groupName,
                ownerId: uid,
                planId: userData.activePlan,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                memberCount: 1,
                playlistCount: 0,
                inviteCode: inviteCode,
            });

            const memberRef = groupRef.collection("members").doc(uid);
            transaction.set(memberRef, {
                role: "admin",
                joinedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            transaction.update(userRef, {
                memberOfGroups: admin.firestore.FieldValue.arrayUnion(groupRef.id)
            });
        });

        return { groupId: groupRef.id, inviteCode: inviteCode };

    } catch (error) {
        console.error("Falha ao criar grupo na transação:", error);
        throw new HttpsError("internal", "Não foi possível criar o grupo.");
    }
});

export const inviteToGroup = onCall(async (request) => {
    const uid = request.auth?.uid;
    if (!uid) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "Você precisa estar logado para executar esta ação."
        );
    }

    const { groupId, invitedUserEmail } = request.data;
    if (!groupId || !invitedUserEmail) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "É necessário fornecer groupId e invitedUserEmail."
        );
    }

    const memberDoc = await db.doc(`groups/${groupId}/members/${uid}`).get();
    const memberData = memberDoc.data();
    if (!memberData || memberData.role !== "admin") {
        throw new functions.https.HttpsError(
            "permission-denied",
            "Apenas administradores do grupo podem convidar novos membros."
        );
    }

    const groupDoc = await db.doc(`groups/${groupId}`).get();
    const groupData = groupDoc.data();
    if (!groupData) {
        throw new functions.https.HttpsError("not-found", "Grupo não encontrado.");
    }

    const planDoc = await db.doc(`plans/${groupData.planId}`).get();
    const planData = planDoc.data();
    if (!planData) {
        throw new functions.https.HttpsError(
            "not-found",
            "Plano associado ao grupo não encontrado."
        );
    }

    if (groupData.memberCount >= (planData?.maxMembersPerGroup ?? 0)) {
        throw new functions.https.HttpsError(
            "resource-exhausted",
            "O grupo atingiu o limite de membros do plano."
        );
    }

    const invitedUserQuery = await db.collection("users").where("email", "==", invitedUserEmail).limit(1).get();
    if (invitedUserQuery.empty) {
        throw new functions.https.HttpsError("not-found", "Usuário convidado não encontrado.");
    }
    const invitedUserId = invitedUserQuery.docs[0].id;

    await db.runTransaction(async (transaction) => {
        const newMemberRef = db.doc(`groups/${groupId}/members/${invitedUserId}`);
        transaction.set(newMemberRef, {
            role: "member",
            joinedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        transaction.update(groupDoc.ref, {
            memberCount: admin.firestore.FieldValue.increment(1),
        });
    });

    return { success: true, message: "Usuário convidado com sucesso!" };
});

export const manageGroupMember = onCall(async (request) => {
    const uid = request.auth?.uid;
    if (!uid) {
        throw new functions.https.HttpsError("unauthenticated", "Você precisa estar logado.");
    }

    const { groupId, targetUserId, action } = request.data as ManageMemberData;
    if (!groupId || !targetUserId || !action) {
        throw new functions.https.HttpsError("invalid-argument", "Dados insuficientes.");
    }

    if (uid === targetUserId) {
        throw new functions.https.HttpsError("permission-denied", "Você não pode alterar sua própria função ou se remover.");
    }
    const groupDocRef = db.doc(`groups/${groupId}`);
    const actingMemberRef = db.doc(`groups/${groupId}/members/${uid}`);
    const [groupDoc, actingMemberDoc] = await Promise.all([
        groupDocRef.get(),
        actingMemberRef.get(),
    ]);

    if (actingMemberDoc.data()?.role !== "admin") {
        throw new functions.https.HttpsError("permission-denied", "Apenas administradores podem gerenciar membros.");
    }

    const groupData = groupDoc.data();

    if (!groupData) {
        throw new functions.https.HttpsError("not-found", "Grupo não encontrado.");
    }

    if (groupData.ownerId === targetUserId) {
        throw new functions.https.HttpsError("permission-denied", "O dono do grupo não pode ser gerenciado.");
    }

    const targetMemberRef = db.doc(`groups/${groupId}/members/${targetUserId}`);

    switch (action) {
        case "remove":
            await db.runTransaction(async (transaction) => {
                transaction.delete(targetMemberRef);
                transaction.update(groupDocRef, {
                    memberCount: admin.firestore.FieldValue.increment(-1),
                });
            });
            return { success: true, message: "Membro removido com sucesso." };
        case "promote":
            await targetMemberRef.update({ role: "admin" });
            return { success: true, message: "Membro promovido a admin." };
        case "demote":
            await targetMemberRef.update({ role: "member" });
            return { success: true, message: "Admin rebaixado para membro." };
        default:
            throw new functions.https.HttpsError("invalid-argument", "Ação inválida.");
    }
});

export const registerUser = onCall({ cors: true }, async (request) => {
    const data = request.data as RegisterData;

    if (!data.email || !data.password || !data.name || !data.cpf || !data.birthdate || !data.phone) {
        throw new HttpsError("invalid-argument", "Todos os campos são obrigatórios.");
    }
    if (data.password.length < 6) {
        throw new HttpsError("invalid-argument", "A senha precisa ter no mínimo 6 caracteres.");
    }

    try {
        const userRecord = await admin.auth().createUser({
            email: data.email,
            password: data.password,
            displayName: data.name,
        });

        const newUserProfile = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            cpf: data.cpf,
            birthdate: new Date(data.birthdate).toISOString(),
            isActive: true,
            activePlan: "LV5A8yuxdpqJJnSvHygx",
            createdAt: new Date().toISOString()
        };

        await db.collection("users").doc(userRecord.uid).set(newUserProfile);

        console.log(`Usuário ${userRecord.uid} criado com sucesso.`);
        return { status: "success", message: "Usuário criado com sucesso!", uid: userRecord.uid };

    } catch (error: any) {
        console.error("Falha no registro:", error);
        if (error.code === 'auth/email-already-exists') {
            throw new HttpsError('already-exists', 'Este e-mail já está cadastrado.');
        }
        throw new HttpsError('internal', 'Ocorreu um erro ao criar a conta.');
    }
});

export const joinGroupWithCode = onCall(async (request) => {
    const uid = request.auth?.uid;
    if (!uid) throw new HttpsError("unauthenticated", "Você precisa estar logado.");

    const { inviteCode } = request.data;
    if (typeof inviteCode !== "string" || inviteCode.length === 0) {
        throw new HttpsError("invalid-argument", "Código de convite inválido.");
    }

    const groupQuery = await db.collection("groups").where("inviteCode", "==", inviteCode).limit(1).get();
    if (groupQuery.empty) throw new HttpsError("not-found", "Nenhum grupo encontrado com este código.");

    const groupDoc = groupQuery.docs[0];
    const groupData = groupDoc.data();
    const groupId = groupDoc.id;

    if (groupData.memberIds && groupData.memberIds.includes(uid)) {
        throw new HttpsError("already-exists", "Você já faz parte deste grupo.");
    }

    const planDoc = await db.collection("plans").doc(groupData.planId).get();
    const planData = planDoc.data();
    if (!planData || groupData.memberCount >= (planData.maxMembersPerGroup ?? 0)) {
        throw new HttpsError("resource-exhausted", "Este grupo atingiu o limite máximo de membros.");
    }

    const userRef = db.collection("users").doc(uid);
    const joiningUserDoc = await userRef.get();
    const joiningUserData = joiningUserDoc.data();

    await db.runTransaction(async (transaction) => {
        transaction.update(groupDoc.ref, {
            memberCount: admin.firestore.FieldValue.increment(1),
            memberIds: admin.firestore.FieldValue.arrayUnion(uid)
        });

        const newMemberRef = groupDoc.ref.collection("members").doc(uid);
        transaction.set(newMemberRef, {
            role: "member",
            name: joiningUserData?.name || "Nome não encontrado",
            joinedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        transaction.update(userRef, {
            memberOfGroups: admin.firestore.FieldValue.arrayUnion(groupId)
        });
    });

    return { success: true, message: "Você entrou no grupo com sucesso!" };
});

export const regenerateInviteCode = onCall(async (request) => {
    const uid = request.auth?.uid;
    if (!uid) {
        throw new HttpsError("unauthenticated", "Você precisa estar logado.");
    }

    const { groupId } = request.data;
    if (!groupId) {
        throw new HttpsError("invalid-argument", "É necessário fornecer o ID do grupo.");
    }

    const groupRef = db.doc(`groups/${groupId}`);
    const memberRef = db.doc(`groups/${groupId}/members/${uid}`);

    const [groupDoc, memberDoc] = await Promise.all([groupRef.get(), memberRef.get()]);

    if (!groupDoc.exists) {
        throw new HttpsError("not-found", "Grupo não encontrado.");
    }

    const groupData = groupDoc.data();
    const memberData = memberDoc.data();

    const isOwner = groupData?.ownerId === uid;
    const isAdmin = memberData?.role === 'admin';

    if (!isOwner && !isAdmin) {
        throw new HttpsError("permission-denied", "Você não tem permissão para alterar este grupo.");
    }

    const newCode = generateInviteCode();
    await groupRef.update({ inviteCode: newCode });

    return { success: true, newCode: newCode };
});

export const createGroupPlaylist = onCall(async (request) => {
    const uid = request.auth?.uid;
    if (!uid) {
        throw new HttpsError("unauthenticated", "Você precisa estar logado.");
    }

    const { groupId, playlistName } = request.data;
    if (!groupId || typeof playlistName !== "string" || playlistName.trim().length < 3) {
        throw new HttpsError("invalid-argument", "Dados insuficientes ou nome da playlist inválido.");
    }

    const isAdmin = await isUserAdminInGroup(uid, groupId);
    if (!isAdmin) {
        throw new HttpsError("permission-denied", "Apenas o dono do grupo pode criar playlists.");
    }

    const playlistRef = db.doc(`groups/${groupId}`).collection("playlists").doc();

    await playlistRef.set({
        id: playlistRef.id,
        name: playlistName.trim(),
        type: "GROUP",
        groupId: groupId,
        createdBy: uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        songId: [],
        isActive: true,
    });

    await db.doc(`groups/${groupId}`).update({
        playlistCount: admin.firestore.FieldValue.increment(1)
    });

    return { success: true, playlistId: playlistRef.id };
});

function generateInviteCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function isUserAdminInGroup(uid: string, groupId: string): Promise<boolean> {
    if (!uid || !groupId) return false;

    const groupDoc = await db.doc(`groups/${groupId}`).get();
    if (!groupDoc.exists) return false;

    if (groupDoc.data()?.ownerId === uid) {
        return true;
    }

    const memberDoc = await db.doc(`groups/${groupId}/members/${uid}`).get();
    return memberDoc.exists && memberDoc.data()?.role === 'admin';
}