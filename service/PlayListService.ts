import { PlayList } from "@/libs/domain/PlayList/PlayList";
import { addDoc, arrayRemove, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebase";


export async function createPlayList(it: PlayList) {
    try {
        // const user = auth.currentUser;
        // if (!user) throw new Error("Usuário não autenticado.");
        await addDoc(collection(db, 'playLists'), {
            // userId: user.uid,
            name: it.name,
            songId: it.songId,
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

export async function findByPlayListId(id: string): Promise<PlayList | null> {
    try {
        const ref = doc(db, 'playLists', id);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) return null;

        return { id: snapshot.id, ...snapshot.data() } as PlayList;
    } catch (error) {
        alert('Erro ao buscar playlsit: ' + error);
        throw error;
    }
}

export async function deletePlayList(id: string): Promise<void> {
    try {
        const ref = doc(db, 'playLists', id);
        await deleteDoc(ref);
    } catch (error) {
        alert('Erro ao atualizar cifras: ' + error);
        throw error;
    }
}

export async function deleteSongFromPlayList(playlistId: string, songId: string) {
    try {
        const ref = doc(db, "playLists", playlistId);
        await updateDoc(ref, {
            songId: arrayRemove(songId),
        });
        console.log(`Música ${songId} removida da playlist ${playlistId}`);

    } catch (error) {
        alert("Erro ao remover música da playlist: " + error);
        throw error;
    }
}


export async function deleteSongsFromPlayList(playlistId: string, songIds: string[]) {
    try {
        const ref = doc(db, "playLists", playlistId);
        await updateDoc(ref, {
            songId: arrayRemove(...songIds),
        });
        console.log(`Músicas ${songIds.join(", ")} removidas da playlist ${playlistId}`);
    } catch (error) {
        alert("Erro ao remover músicas da playlist: " + error);
        throw error;
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