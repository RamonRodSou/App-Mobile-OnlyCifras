import { PlayList } from "@/libs/domain/PlayList/PlayList";
import { StructSong } from "@/libs/domain/StructSong/StructSong";
import { findByPlayListId } from "@/service/PlayListService";
import { findAllSongsByIds } from "@/service/SongsService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function FavoriteList() {

    const [data, setData] = useState<PlayList | null>();
    const [songs, setSongs] = useState<StructSong[]>([]);

    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    async function loadData() {
        if (!id) return;

        const playlist = await findByPlayListId(id);
        setData(playlist);

        if (playlist?.songId?.length) {
            const songs = await findAllSongsByIds(playlist.songId);
            setSongs(songs);
        }
    }

    useEffect(() => {
        loadData()
    }, [id])

    function navToSong(it: string): void {
        router.push({
            pathname: "../chordFavorites/[id]",
            params: {
                id: it,
                songs: JSON.stringify(songs.map(s => s.id))
            }
        });
    }

    return (
        <ScrollView className="flex-1 bg-background p-4 gap-2">
            {data && (
                <Text className="text-2xl font-bold text-title mb-6">
                    Playlist: {data.name}
                </Text>
            )}

            {songs.length === 0 && (
                <View className="flex-1 justify-center items-center mt-60">
                    <Text className="text-4xl font-bold text-title text-center">
                        {`Playlist vazia.\nCadastrar músicas`}
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push('./')}
                    >
                        <Text className="text-white font-bold text-[1.5rem]">Biblioteca</Text>
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
                    <Text className="text-lg font-semibold text-title">
                        {it.tone}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
} 