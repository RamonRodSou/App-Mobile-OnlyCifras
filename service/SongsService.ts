import { StructSong } from "@/libs/domain/StructSong/StructSong";
import firebase from "firebase/compat/app";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function createSongs(entity: StructSong) {
    try {
        const user = auth.currentUser;
        // if (!user) throw new Error("Usuário não autenticado.");
        await addDoc(collection(db, 'cifras'), {
            // id: user.uid,
            title: entity.title,
            description: entity.description,
            singer: entity.singer,
            tone: entity.tom,
            userId: entity.userId,
            isActive: entity.isActive,
            createdAt: entity.createdAt,
        });
    } catch (error) {
        alert('Erro ao registrar cifra: ' + error);
        throw error;
    }
}

export async function findAllSongs(): Promise<StructSong[]> {
    try {
        const user = auth.currentUser;
        // if (!user) throw new Error("Usuário não autenticado.");

        const snapshot = await getDocs(collection(db, 'cifras'));
        return snapshot.docs.map((it) => ({ id: it.id, ...it.data() } as StructSong))
    } catch (error) {
        alert('Erro ao listar cifras: ' + error);
        throw error;
    }
}

export async function findBySongsId(id: string): Promise<StructSong | null> {
    try {
        const ref = doc(db, 'cifras', id);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) return null;

        return { id: snapshot.id, ...snapshot.data() } as StructSong;
    } catch (error) {
        alert('Erro ao buscar cifras: ' + error);
        throw error;
    }
}

export async function updateSongs(id: string, data: Partial<StructSong>): Promise<void> {
    try {
        const ref = doc(db, 'cifras', id);
        await updateDoc(ref, data);
    } catch (error) {
        alert('Erro ao atualizar cifras: ' + error);
        throw error;
    }
}

export async function deleteSongs(id: string) {
    try {
        await firebase.firestore().collection('cifras').doc(id).delete()
    } catch (error) {
        alert('Erro ao deletar cifras: ' + error)
    }
} 