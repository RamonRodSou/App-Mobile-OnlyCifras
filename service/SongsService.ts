import { StructSong } from "@/libs/domain/StructSong/StructSong";
import { addDoc, collection, deleteDoc, doc, documentId, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "./firebase";

const collectionbd = 'cifras'

export async function createSongs(entity: Partial<StructSong>) {
    try {
        const user = auth.currentUser;
        // if (!user) throw new Error("Usuário não autenticado.");
        await addDoc(collection(db, collectionbd), {
            // id: user.uid,
            title: entity.title,
            description: entity.description,
            singer: entity.singer,
            tone: entity.tone,
            struct: entity.struct,
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

        const snapshot = await getDocs(collection(db, collectionbd));
        return snapshot.docs.map((it) => ({ id: it.id, ...it.data() } as StructSong))
    } catch (error) {
        alert('Erro ao listar cifras: ' + error);
        throw error;
    }
}

export async function findAllSongsByIds(ids: string[]): Promise<StructSong[]> {
    try {
        if (!ids || ids.length === 0) return [];

        const chunks = [];
        for (let i = 0; i < ids.length; i += 10) {
            chunks.push(ids.slice(i, i + 10));
        }

        const results: StructSong[] = [];

        for (const chunk of chunks) {
            const q = query(
                collection(db, collectionbd),
                where(documentId(), "in", chunk)
            );
            const snapshot = await getDocs(q);
            snapshot.forEach((doc) => {
                results.push({ id: doc.id, ...doc.data() } as StructSong);
            });
        }

        return results;
    } catch (error) {
        alert("Erro ao listar cifras: " + error);
        throw error;
    }
}

export async function findBySongsId(id: string): Promise<StructSong | null> {
    try {
        const ref = doc(db, collectionbd, id);
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
        const ref = doc(db, collectionbd, id);
        await updateDoc(ref, data);
    } catch (error) {
        alert('Erro ao atualizar cifras: ' + error);
        throw error;
    }
}

export async function deleteSongs(id: string): Promise<void> {
    try {
        const ref = doc(db, collectionbd, id);
        await deleteDoc(ref);
    } catch (error) {
        alert('Erro ao atualizar cifras: ' + error);
        throw error;
    }
}