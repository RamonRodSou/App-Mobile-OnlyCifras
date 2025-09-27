import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Checkbox } from "react-native-paper";

import CustomButton from "@/components/customButton/customButton";
import { Chord } from "@/libs/domain/Chord/Chord";
import { PlayList } from "@/libs/domain/PlayList/PlayList";
import { PlaylistType } from "@/libs/enuns/PlayListType";
import { ColorUtils } from "@/libs/utils/ColorUtils";
import { auth } from "@/service/firebase";
import { deletePlayList, deleteSongsFromPlayList, findPlaylistWithSongs } from "@/service/PlayListService";

export default function FavoriteList() {
    const { id, type, groupId } = useLocalSearchParams<{ id: string, type: PlaylistType, groupId?: string }>();
    const router = useRouter();

    const [playlist, setPlaylist] = useState<PlayList | null>(null);
    const [songs, setSongs] = useState<Chord[]>([]);
    const [loading, setLoading] = useState(true);

    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [selected, setSelected] = useState<string[]>([]);
    const [canEdit, setCanEdit] = useState(false);

    function toggleSelectSong(songId: string) {
        if (selected.includes(songId)) {
            setSelected(prev => prev.filter(id => id !== songId));
        } else {
            setSelected(prev => [...prev, songId]);
        }
    }

    async function loadData() {
        if (!id || !type) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const result = await findPlaylistWithSongs(id, type, groupId);
            if (result) {
                setPlaylist(result.playlist);
                setSongs(result.songs);

                const user = auth.currentUser;
                if (result.playlist.type === PlaylistType.PERSONAL) {
                    setCanEdit(true);
                } else if (result.playlist && result.group) {
                    setCanEdit(user?.uid === result.group.ownerId);
                }
            } else {
                Alert.alert("Atenção", "Playlist não encontrada. Ela pode ter sido removida.");
                router.back();
            }
        } catch (error: any) {
            Alert.alert("Erro", error.message || "Não foi possível carregar a playlist.");
        } finally {
            setLoading(false);
        }
    }

    async function deletePlayListFromId() {
        console.log(playlist, 'can', canEdit)
        if (!playlist || !canEdit) return;
        Alert.alert("Apagar Playlist", `Deseja apagar "${playlist.name}"?`, [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Apagar", style: "destructive", onPress: async () => {
                    await deletePlayList(playlist);
                    router.push('/playListTeam');
                }
            }
        ]);
    }

    async function deleteSelected() {
        if (!playlist || selected.length === 0 || !canEdit) return;
        const newSongIds = await deleteSongsFromPlayList(playlist, selected);

        setPlaylist(prev => prev ? PlayList.fromJson({ ...prev, songId: newSongIds }) : null);
        setSongs(prev => prev.filter(song => !selected.includes(song.id)));
        setSelected([]);
        setIsChecked(false);
    }

    useEffect(() => {
        loadData();
    }, [id, type, groupId]);

    function navToSong(songId: string): void {
        router.push({
            pathname: "../chordFavorites/[id]",
            params: {
                playlistId: playlist?.id,
                id: songId,
                songs: JSON.stringify(songs.map(s => s.id)),
                type: playlist?.type,
                groupId: playlist?.groupId,
            }
        });
    }


    if (loading) {
        return <ActivityIndicator size="large" className="flex-1 justify-center" />;
    }

    return (
        <View className="flex-1 bg-background">
            <Stack.Screen options={{ title: playlist ? playlist.name : "Playlist" }} />
            <ScrollView className="p-4 gap-2">
                {playlist && (
                    <View className="flex-row justify-between items-center mb-6">
                        <View className="flex-1">
                            <Text className="text-2xl font-bold text-title">{playlist.name}</Text>
                            {playlist && (
                                <View className="flex-row items-center bg-blue-500/20 self-start px-2 py-1 rounded-full mt-1">
                                    <Ionicons name="people" size={12} color="#60a5fa" />
                                    <Text className="text-xs text-blue-400 font-bold ml-1">GRUPO</Text>
                                </View>
                            )}
                        </View>

                        {canEdit && songs.length > 0 && (
                            <>
                                {!isChecked && <CustomButton handle={() => setIsChecked(true)} />}
                                {isChecked && selected.length > 0 && <CustomButton handle={deleteSelected} color={ColorUtils.SELECTED} />}
                                {isChecked && selected.length === 0 && <CustomButton handle={() => setIsChecked(false)} color={ColorUtils.DEFAULT} />}
                            </>
                        )}
                    </View>
                )}

                {songs.length === 0 && (
                    <View className="flex-1 justify-center items-center mt-60">
                        <Text className="text-4xl font-bold text-title text-center">
                            {`Playlist vazia.\nCadastrar músicas`}
                        </Text>
                        {canEdit ? (
                            <TouchableOpacity onPress={() => router.push('/songsList')}>
                                <Text className="text-subTitle font-bold text-[1.5rem]">Biblioteca</Text>
                            </TouchableOpacity>
                        ) : (
                            <Text className="text-gray-400 text-center mt-2">Apenas o dono do grupo pode editar esta playlist.</Text>
                        )}

                        {canEdit && (
                            <TouchableOpacity
                                className='mt-20 p-3 border-2 border-solid rounded'
                                onPress={deletePlayListFromId}
                            >
                                <Text className="text-tone font-bold text-[1.5rem]">Apaga Playlist</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {songs.length > 0 && songs.map((it) => (
                    <TouchableOpacity
                        key={it.id}
                        onPress={() => !isChecked && navToSong(it.id)}
                        className="mb-3 p-4 rounded-2xl bg-struct shadow-sm justify-between flex-row"
                    >
                        <View>
                            <Text className="text-lg font-semibold text-title">{it.title}</Text>
                            <Text className="text-sm text-yellow-400 mt-1">{it.singer}</Text>
                        </View>
                        <View className="items-center w-20 flex-row justify-end">
                            <Text className="text-lg font-semibold text-title mr-2">{it.tone}</Text>
                            {canEdit && isChecked && (
                                <Checkbox
                                    status={selected.includes(it.id) ? 'checked' : 'unchecked'}
                                    onPress={() => toggleSelectSong(it.id)}
                                    color="#e98a41ff"
                                />
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

