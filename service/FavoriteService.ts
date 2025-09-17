import { Favorite } from "@/libs/domain/Favorite/Favorite";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

const collectionbd = 'favorites'

export async function createFavorite(it: Favorite) {
    try {
        // const user = auth.currentUser;
        // if (!user) throw new Error("Usuário não autenticado.");
        await addDoc(collection(db, collectionbd), {
            // userId: user.uid,
            songId: it.songId,
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

        const snapshot = await getDocs(collection(db, collectionbd));
        return snapshot.docs.map((it) => ({ id: it.id, ...it.data() } as Favorite))
    } catch (error) {
        alert('Erro ao listar: ' + error);
        throw error;
    }
}

export async function deleteFavorite(id: string): Promise<void> {
    try {
        const ref = doc(db, collectionbd, id);
        await deleteDoc(ref);
    } catch (error) {
        alert('Erro ao atualizar cifras: ' + error);
        throw error;
    }
}

export async function updateFavorite(id: string, data: Partial<Favorite>): Promise<void> {
    try {
        const ref = doc(db, collectionbd, id);
        await updateDoc(ref, data);
    } catch (error) {
        alert('Erro ao atualizar favorito: ' + error);
        throw error;
    }
}