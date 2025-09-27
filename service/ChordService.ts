import { Chord } from "@/libs/domain/Chord/Chord";
import { addDoc, collection, deleteDoc, doc, documentId, getDoc, getDocs, increment, query, setDoc, updateDoc, where } from "firebase/firestore";
import { auth, db } from "./firebase";

const collectionbd = 'cifras'

export async function createChord(entity: Partial<Chord>) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");
        await addDoc(collection(db, collectionbd), {
            title: entity.title,
            singer: entity.singer,
            tone: entity.tone,
            struct: entity.struct,
            userId: user.uid,
            likesCount: 0,
            isActive: entity.isActive,
            createdAt: entity.createdAt,
        });
    } catch (error) {
        alert('Erro ao registrar cifra: ' + error);
        throw error;
    }
}

export async function findAllChords(): Promise<Chord[]> {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");

        const snapshot = await getDocs(collection(db, collectionbd));
        return snapshot.docs.map((it) => ({ id: it.id, ...it.data() } as Chord))
    } catch (error) {
        alert('Erro ao listar cifras: ' + error);
        throw error;
    }
}

export async function findAllChordsByIds(ids: string[]): Promise<Chord[]> {
    try {
        if (!ids || ids.length === 0) {
            return [];
        }
        const chunks: string[][] = [];
        for (let i = 0; i < ids.length; i += 30) {
            chunks.push(ids.slice(i, i + 30));
        }

        const results: Chord[] = [];
        for (const chunk of chunks) {
            const q = query(
                collection(db, collectionbd),
                where(documentId(), "in", chunk)
            );
            const snapshot = await getDocs(q);
            snapshot.forEach((doc) => {
                results.push({ id: doc.id, ...doc.data() } as Chord);
            });
        }

        return results;
    } catch (error) {
        console.error("Erro ao buscar cifras por IDs:", error);
        throw new Error("Não foi possível carregar as músicas da playlist.");
    }
}

export async function findByChordId(id: string): Promise<Chord | null> {
    try {
        const ref = doc(db, collectionbd, id);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) return null;

        return { id: snapshot.id, ...snapshot.data() } as Chord;
    } catch (error) {
        alert('Erro ao buscar cifras: ' + error);
        throw error;
    }
}

export async function updateChord(id: string, data: Partial<Chord>): Promise<void> {
    try {
        const ref = doc(db, collectionbd, id);
        await updateDoc(ref, data);
    } catch (error) {
        alert('Erro ao atualizar cifras: ' + error);
        throw error;
    }
}

export async function deleteChord(id: string): Promise<void> {
    try {
        const ref = doc(db, collectionbd, id);
        await deleteDoc(ref);
    } catch (error) {
        alert('Erro ao atualizar cifras: ' + error);
        throw error;
    }
}


export async function toggleLikeChord(chordId: string, unlike = false) {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado.");

    const likeRef = doc(db, "cifras", chordId, "likes", user.uid);
    const chordRef = doc(db, "cifras", chordId);

    const snap = await getDoc(likeRef);

    if (!unlike) {
        if (snap.exists()) {
            return { liked: true };
        }

        await setDoc(likeRef, {
            userId: user.uid,
            createdAt: new Date().toISOString()
        });
        await updateDoc(chordRef, { likesCount: increment(1) });

        return { liked: true };
    } else {
        if (!snap.exists()) {
            return { liked: false };
        }

        await deleteDoc(likeRef);
        await updateDoc(chordRef, { likesCount: increment(-1) });

        return { liked: false };
    }
}

export async function checkUserLiked(chordId: string): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;
    const likeRef = doc(db, "cifras", chordId, "likes", user.uid);
    const snap = await getDoc(likeRef);
    return snap.exists();
}