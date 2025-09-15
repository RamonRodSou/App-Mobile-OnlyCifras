import { PlayList } from "@/libs/domain/PlayList/PlayList";
import firebase from "firebase/compat/app";
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebase";


export async function createPlayList(it: PlayList) {
    try {
        // const user = auth.currentUser;
        // if (!user) throw new Error("Usuário não autenticado.");
        await addDoc(collection(db, 'playLists'), {
            // userId: user.uid,
            name: it.name,
            isActive: it.isActive,
            createdAt: it.createdAt,
        });
    } catch (error) {
        throw error;
    }
}

export async function findAllPlayList(): Promise<PlayList[]> {
    try {
        // const user = auth.currentUser;
        // if (!user) throw new Error("Usuário não autenticado.");

        const snapshot = await getDocs(collection(db, 'playLists'));
        return snapshot.docs.map((it) => ({ id: it.id, ...it.data() } as PlayList))
    } catch (error) {
        alert('Erro ao listar: ' + error);
        throw error;
    }
}

export async function deletePlayList(id: string) {
    try {
        await firebase.firestore().collection('playLists').doc(id).delete()
    } catch (error) {
        alert('Erro ao deletar playlist: ' + error)
    }
}

export async function updatePlayList(id: string, data: Partial<PlayList>): Promise<void> {
    try {
        const ref = doc(db, 'playLists', id);
        await updateDoc(ref, data);
    } catch (error) {
        alert('Erro ao atualizar playlist: ' + error);
        throw error;
    }
}