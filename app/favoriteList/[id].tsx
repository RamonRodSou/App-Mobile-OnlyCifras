import CustomButton from "@/components/customButton/customButton";
import { PlayList } from "@/libs/domain/PlayList/PlayList";
import { StructSong } from "@/libs/domain/StructSong/StructSong";
import { ColorUtils } from "@/libs/utils/ColorUtils";
import { deletePlayList, deleteSongsFromPlayList, findByPlayListId } from "@/service/PlayListService";
import { findAllSongsByIds } from "@/service/SongsService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Checkbox } from "react-native-paper";

export default function FavoriteList() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const [data, setData] = useState<PlayList | null>();
    const [songs, setSongs] = useState<StructSong[]>([]);
    const [isChecked, setIschecked] = useState<boolean>(false);
    const [selected, setSelected] = useState<string[]>([]);

    const router = useRouter();

    function toggleSelectSong(songId: string) {
        if (selected.includes(songId)) {
            setSelected(prev => prev.filter(id => id !== songId));
        } else {
            setSelected(prev => [...prev, songId]);
        }
    }

    async function loadData() {
        if (!id) return;

        const playlist = await findByPlayListId(id);
        setData(playlist);

        if (playlist?.songId?.length) {
            const songs = await findAllSongsByIds(playlist.songId);
            setSongs(songs);
        }
    }

    async function deletePlayListFromId() {
        if (!data) return
        console.log(data.id)
        await deletePlayList(data.id);
        router.push('/playListTeam')
    }

    async function deleteSelected() {
        if (!data || selected.length === 0) return;

        deleteSongsFromPlayList(data.id, selected);
        setSongs(prev => prev.filter(song => !selected.includes(song.id)));
        setSelected([]);
    }

    useEffect(() => {
        loadData()
    }, [id])

    function navToSong(it: string): void {
        router.push({
            pathname: "../chordFavorites/[id]",
            params: {
                playlistId: data?.id,
                id: it,
                songs: JSON.stringify(songs.map(s => s.id))
            }
        });
    }

    return (
        <View className="flex-1 bg-background">

            <ScrollView className="p-4 gap-2">
                {data && (
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-2xl font-bold text-title">
                            Playlist: {data.name}
                        </Text>

                        {songs.length > 0 && !isChecked && (
                            <CustomButton handle={() => setIschecked(true)} />
                        )}
                        {songs.length > 0 && isChecked && selected.length > 0 && (
                            <CustomButton handle={deleteSelected} color={ColorUtils.SELECTED} />
                        )}

                        {songs.length > 0 && isChecked && selected.length == 0 && (
                            <CustomButton handle={() => setIschecked(false)} color={ColorUtils.DEFAULT} />
                        )}
                    </View>
                )}

                {songs.length === 0 && (
                    <View className="flex-1 justify-center items-center mt-60">
                        <Text className="text-4xl font-bold text-title text-center">
                            {`Playlist vazia.\nCadastrar músicas`}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/(tabs)')}
                        >
                            <Text className="text-white font-bold text-[1.5rem]">Biblioteca</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className='mt-20 p-3 border-2 border-solid rounded'
                            onPress={() => deletePlayListFromId()}
                        >
                            <Text className="text-white font-bold text-[1.5rem]">Apaga Playlist</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {songs.length > 0 && songs.map((it, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => navToSong(it.id)}
                        className="mb-3 p-4 rounded-2xl bg-struct shadow-sm justify-between flex-row"
                    >
                        <View>
                            <Text className="text-lg font-semibold text-title">
                                {it.title}
                            </Text>
                            <Text className="text-sm text-yellow-400 mt-1">
                                {it.singer}
                            </Text>
                        </View>
                        <View className="items-center w-20">
                            <Text className="text-lg font-semibold text-title">
                                {it.tone}
                            </Text>
                            {isChecked && (
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
        </View >
    )
} 