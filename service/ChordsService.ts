import { StructChords } from "@/libs/domain/StructChords/StructChords";
import firebase from "firebase/compat/app";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function createChords(entity: StructChords) {
    try {
        const user = auth.currentUser;
        // if (!user) throw new Error("Usuário não autenticado.");
        await addDoc(collection(db, 'cifras'), {
            // id: user.uid,
            title: entity.title,
            description: entity.description,
            single: entity.single,
            tone: entity.tone,
            userId: entity.userId,
            isActive: entity.isActive,
            createdAt: entity.createdAt,
        });
    } catch (error) {
        alert('Erro ao registrar cifra: ' + error);
        throw error;
    }
}

export async function findAllChords(): Promise<StructChords[]> {
    try {
        const user = auth.currentUser;
        // if (!user) throw new Error("Usuário não autenticado.");

        const snapshot = await getDocs(collection(db, 'cifras'));
        return snapshot.docs.map((it) => ({ id: it.id, ...it.data() } as StructChords))
    } catch (error) {
        alert('Erro ao listar cifras: ' + error);
        throw error;
    }
}

export async function findByChordsId(id: string): Promise<StructChords | null> {
    try {
        const ref = doc(db, 'cifras', id);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) return null;

        return { id: snapshot.id, ...snapshot.data() } as StructChords;
    } catch (error) {
        alert('Erro ao buscar cifras: ' + error);
        throw error;
    }
}

export async function updateChords(id: string, data: Partial<StructChords>): Promise<void> {
    try {
        const ref = doc(db, 'cifras', id);
        await updateDoc(ref, data);
    } catch (error) {
        alert('Erro ao atualizar cifras: ' + error);
        throw error;
    }
}

export async function deleteChords(id: string) {
    try {
        await firebase.firestore().collection('cifras').doc(id).delete()
    } catch (error) {
        alert('Erro ao deletar cifras: ' + error)
    }
} 