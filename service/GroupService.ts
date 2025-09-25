import { Group } from "@/libs/domain/Group/Group";
import { User } from "@/libs/domain/users/member/User";
import { collection, doc, documentId, getDoc, getDocs, query, where } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { auth, db, functions } from "./firebase";
import { findAllUsersByIds } from "./UserService";

export async function createGroupOnClient(groupName: string): Promise<{ groupId: string, inviteCode: string }> {
    try {
        const createFunction = httpsCallable(functions, 'createGroup');
        const result = await createFunction({ groupName });
        return result.data as { groupId: string, inviteCode: string };
    } catch (error: any) {
        throw new Error(error.message || "Não foi possível criar o grupo.");
    }
}

export async function regenerateGroupInviteCode(groupId: string): Promise<string> {
    try {
        const regenerateFunction = httpsCallable(functions, 'regenerateInviteCode');
        const result = await regenerateFunction({ groupId });
        const data = result.data as { newCode: string };
        return data.newCode;
    } catch (error: any) {
        throw new Error(error.message || "Não foi possível gerar um novo código.");
    }
}

export async function joinGroupWithCode(inviteCode: string): Promise<{ success: boolean, message: string }> {
    try {
        const joinFunction = httpsCallable(functions, 'joinGroupWithCode');
        const result = await joinFunction({ inviteCode });
        return result.data as { success: boolean, message: string };
    } catch (error: any) {
        throw new Error(error.message || "Não foi possível entrar no grupo.");
    }
}

export async function findMyGroups(): Promise<Group[]> {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        const groupIds = userDoc.data()?.memberOfGroups || [];

        if (groupIds.length === 0) return [];

        return await findGroupsByIds(groupIds);

    } catch (error) {
        console.error("Erro ao buscar meus grupos:", error);
        throw error;
    }
}

export async function findGroupsByIds(ids: string[]): Promise<Group[]> {
    if (!ids || ids.length === 0) return [];

    const chunks: string[][] = [];
    for (let i = 0; i < ids.length; i += 10) {
        chunks.push(ids.slice(i, i + 10));
    }

    const groupPromises = chunks.map(async (chunk) => {
        const q = query(collection(db, "groups"), where(documentId(), "in", chunk));
        const snap = await getDocs(q);
        return snap.docs.map(doc => Group.fromJson({ id: doc.id, ...doc.data() }));
    });

    const groupArrays = await Promise.all(groupPromises);
    return groupArrays.flat();
}

export async function findMyGroupWithMembers(): Promise<{ group: Group, members: User[] } | null> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado.");

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const groupIds = userDoc.data()?.memberOfGroups || []
    if (groupIds.length === 0) return null;

    const groupId = groupIds[0];
    const groupRef = doc(db, "groups", groupId);
    const groupDoc = await getDoc(groupRef);

    if (!groupDoc.exists()) return null;

    const membersCollectionRef = collection(groupRef, "members");
    const membersSnapshot = await getDocs(membersCollectionRef);

    const members = membersSnapshot.docs.map(doc => User.fromJson({ id: doc.id, ...doc.data() }));

    const allMembers = await findAllUsersByIds(members.map((it => it.id)));

    const group = Group.fromJson({ id: groupDoc.id, ...groupDoc.data() });

    return { group, members: allMembers };
}
