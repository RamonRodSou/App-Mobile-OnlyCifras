import { Chord } from "@/libs/domain/Chord/Chord";
import { Group } from "@/libs/domain/Group/Group";
import {
    PlayList
} from "@/libs/domain/PlayList/PlayList";
import { PlaylistType } from "@/libs/enuns/PlayListType";
import {
    addDoc,
    arrayRemove,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    updateDoc
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { findAllChordsByIds } from "./ChordService";
import {
    auth,
    db,
    functions
} from "./firebase";

export async function createPlayList(it: Omit<PlayList, 'id'>) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");

        const collectionPath = getUserPlaylistsCollectionPath(user.uid);
        await addDoc(collection(db, collectionPath), {
            name: it.name,
            songId: it.songId,
            type: PlaylistType.PERSONAL,
            isActive: it.isActive,
            createdAt: it.createdAt,
        });
    } catch (error) {
        console.error("Erro ao criar playlist:", error);
        throw error;
    }
}

export async function findByPlayListId(id: string): Promise<PlayList | null> {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");

        const ref = getUserPlaylistDocRef(user.uid, id);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) return null;

        return {
            id: snapshot.id,
            ...snapshot.data()
        } as PlayList;
    } catch (error) {
        console.error("Erro ao buscar playlist por ID:", error);
        throw error;
    }
}

export async function deletePlayList(playlist: PlayList): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("Utilizador não autenticado.");

    let playlistRef;

    if (playlist.type === PlaylistType.GROUP) {
        if (!playlist.groupId) {
            throw new Error("ID do grupo não encontrado na playlist. Impossível apagar.");
        }
        playlistRef = doc(db, "groups", playlist.groupId, "playlists", playlist.id);
    } else {
        playlistRef = doc(db, "users", user.uid, "playLists", playlist.id);
    }

    await deleteDoc(playlistRef);
}

export async function deleteSongFromPlayList(playlistId: string, songId: string) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");

        const ref = getUserPlaylistDocRef(user.uid, playlistId);
        await updateDoc(ref, {
            songId: arrayRemove(songId),
        });
        console.log(`Música ${songId} removida da playlist ${playlistId}`);
    } catch (error) {
        console.error("Erro ao remover música da playlist:", error);
        throw error;
    }
}

export async function deleteSongsFromPlayList(playlist: PlayList, songsToRemove: string[]): Promise<string[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("Utilizador não autenticado.");

    let playlistRef;

    if (playlist.type === PlaylistType.GROUP) {
        if (!playlist.groupId) {
            throw new Error("ID do grupo não encontrado na playlist. Impossível atualizar.");
        }
        playlistRef = doc(db, "groups", playlist.groupId, "playlists", playlist.id);
    } else {
        playlistRef = doc(db, "users", user.uid, "playLists", playlist.id);
    }

    const updatedSongs = (playlist.songId || []).filter(id => !songsToRemove.includes(id));

    await updateDoc(playlistRef, { songId: updatedSongs });

    return updatedSongs;
}

export async function updatePlayList(playlist: PlayList, data: Partial<PlayList>): Promise<void> {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");

        let playlistRef;

        if (playlist.type === PlaylistType.GROUP) {

            if (!playlist.groupId) {
                throw new Error("ID do grupo não encontrado na playlist. Impossível atualizar.");
            }

            playlistRef = doc(db, "groups", playlist.groupId, "playlists", playlist.id);

        } else {
            playlistRef = doc(db, "users", user.uid, "playLists", playlist.id);
        }

        await updateDoc(playlistRef, data);

    } catch (error) {
        console.error("Erro ao atualizar playlist:", error);
        throw error;
    }
}

export async function findUserPlaylists(): Promise<PlayList[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado.");

    const personalPlaylistsRef = collection(db, "users", user.uid, "playLists");

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const groupIds = userDoc.data()?.memberOfGroups || [];
    const groupId = groupIds.length > 0 ? groupIds[0] : null;

    let groupPlaylistsRef = null;
    if (groupId) {
        groupPlaylistsRef = collection(db, "groups", groupId, "playlists");
    }

    const [personalSnapshot, groupSnapshot] = await Promise.all([
        getDocs(personalPlaylistsRef),
        groupPlaylistsRef ? getDocs(groupPlaylistsRef) : Promise.resolve(null)
    ]);

    const playlists: PlayList[] = [];

    personalSnapshot.forEach(doc => {
        playlists.push(PlayList.fromJson({ id: doc.id, ...doc.data() }));
    });

    if (groupSnapshot) {
        groupSnapshot.forEach(doc => {
            playlists.push(PlayList.fromJson({ id: doc.id, ...doc.data() }));
        });
    }

    playlists.sort((a, b) => (new Date(b.createdAt) > new Date(a.createdAt)) ? 1 : -1);

    return playlists;
}

export async function createGroupPlaylistOnClient(groupId: string, playlistName: string) {
    try {
        const createFunc = httpsCallable(functions, 'createGroupPlaylist');
        await createFunc({ groupId, playlistName });
    } catch (error: any) {
        console.error("Erro ao criar playlist do grupo:", error);
        throw new Error(error.message);
    }
}

export async function findPlaylistWithSongs(
    playlistId: string,
    type: PlaylistType,
    groupId?: string
): Promise<{ playlist: PlayList; songs: Chord[]; group?: Group } | null> {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado.");

    let playlistRef;

    if (type === PlaylistType.GROUP) {
        if (!groupId) throw new Error("O ID do grupo é necessário para buscar playlists de grupo.");
        playlistRef = doc(db, "groups", groupId, "playlists", playlistId);
    } else {
        playlistRef = doc(db, "users", user.uid, "playLists", playlistId);
    }

    const playlistSnap = await getDoc(playlistRef);
    if (!playlistSnap.exists()) {
        console.warn(`Playlist com ID ${playlistId} não encontrada no caminho esperado.`);
        return null;
    }

    const playlist = PlayList.fromJson({ id: playlistSnap.id, ...playlistSnap.data() });

    const songs = playlist.songId && playlist.songId.length > 0
        ? await findAllChordsByIds(playlist.songId)
        : [];

    let group: Group | undefined = undefined;
    if (type === PlaylistType.GROUP && groupId) {
        const groupDoc = await getDoc(doc(db, "groups", groupId));
        if (groupDoc.exists()) {
            group = Group.fromJson({ id: groupDoc.id, ...groupDoc.data() });
        }
    }

    return { playlist, songs, group };
}

function getUserPlaylistsCollectionPath(userId: string) {
    return `users/${userId}/playLists`;
}

function getUserPlaylistDocRef(userId: string, playlistId: string) {
    const collectionPath = getUserPlaylistsCollectionPath(userId);
    return doc(db, collectionPath, playlistId);
}