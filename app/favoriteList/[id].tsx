import { PlayList } from "@/libs/domain/PlayList/PlayList";
import { StructSong } from "@/libs/domain/StructSong/StructSong";
import { findByPlayListId } from "@/service/PlayListService";
import { findAllSongsByIds } from "@/service/SongsService";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function FavoriteList() {

    const [data, setData] = useState<PlayList | null>();
    const [songs, setSongs] = useState<StructSong[]>([]);

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

    return (
        <ScrollView className="flex-1 bg-background p-4">
            {data && (
                <Text className="text-2xl font-bold text-title mb-6">
                    {data.name}
                </Text>
            )}

            {songs.map((song) => (
                <View
                    key={song.id}
                    className="mb-3 p-4 rounded-2xl bg-struct shadow-sm"
                >
                    <Text className="text-lg font-semibold text-title">
                        {song.title}
                    </Text>
                    <Text className="text-sm text-yellow-400 mt-1">
                        {song.singer}
                    </Text>
                </View>
            ))}
        </ScrollView>
    )
} 