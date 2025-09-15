import { Favorite } from "@/libs/domain/Favorite/Favorite";
import firebase from "firebase/compat/app";
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebase";


export async function createFavorite(it: Favorite) {
    try {
        // const user = auth.currentUser;
        // if (!user) throw new Error("Usuário não autenticado.");
        await addDoc(collection(db, 'favorites'), {
            // userId: user.uid,
            idChord: it.idChord,
            isActive: it.isActive,
            createdAt: it.createdAt,
        });
    } catch (error) {
        throw error;
    }
}

export async function findAllFavorite(): Promise<Favorite[]> {
    try {
        // const user = auth.currentUser;
        // if (!user) throw new Error("Usuário não autenticado.");

        const snapshot = await getDocs(collection(db, 'favorites'));
        return snapshot.docs.map((it) => ({ id: it.id, ...it.data() } as Favorite))
    } catch (error) {
        alert('Erro ao listar: ' + error);
        throw error;
    }
}

export async function deleteFavorite(id: string) {
    try {
        await firebase.firestore().collection('favorites').doc(id).delete()
    } catch (error) {
        alert('Erro ao deletar favorito: ' + error)
    }
}

export async function updateFavorite(id: string, data: Partial<Favorite>): Promise<void> {
    try {
        const ref = doc(db, 'favorites', id);
        await updateDoc(ref, data);
    } catch (error) {
        alert('Erro ao atualizar favorito: ' + error);
        throw error;
    }
}