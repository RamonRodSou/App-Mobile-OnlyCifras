import { Audit } from "@/libs/domain/Audit/audit";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function auditAdd(report: Audit) {
    try {
        const user = getAuthenticatedUser();
        await saveReportGroupToDatabase(report, user.uid);

    } catch (error) {
        alert('Erro ao adicionar auditoria: ' + error);
        throw error;
    }
}

export async function findAllAudit(): Promise<Audit[]> {
    try {
        getAuthenticatedUser();

        const snapshot = await getDocs(collection(db, 'audit'));
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Audit));
    } catch (error) {
        alert('Erro ao listar as Auditorias: ' + error);
        throw error;
    }
}

export async function findAuditToById(groupId: string): Promise<Audit | null> {
    try {
        const ref = doc(db, 'audit', groupId);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) return null;

        return { id: snapshot.id, ...snapshot.data() } as Audit;
    } catch (error) {
        alert('Erro ao buscar auditoria: ' + error);
        throw error;
    }
}


async function saveReportGroupToDatabase(it: Audit, userId: string) {
    const data = {
        user: userId,
        action: it.action,
        classRef: it.classRef,
        isActive: it.isActive,
        createdAt: it.createdAt
    };

    return await addDoc(collection(db, 'audit'), data);
}

function getAuthenticatedUser() {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado.");
    return user;
}