import ChordData from "@/components/chordData/chordData";
import Loading from "@/components/loading/loadgin";
import { Chord } from "@/libs/domain/Chord/Chord";
import { findAllChordsByIds } from "@/service/ChordService";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

export default function ChordFavorites() {
    const { songs, playlistId, id } = useLocalSearchParams<{ songs?: string; playlistId?: string; id?: string }>();
    const songIds: string[] = songs ? JSON.parse(songs) : [];

    const [chords, setChords] = useState<Chord[]>([]);
    const [initialIndex, setInitialIndex] = useState(0);

    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        async function loadAllChords() {
            if (!songIds.length) return;
            const allChords = await findAllChordsByIds(songIds);
            setChords(allChords);

            if (id) {
                const index = allChords.findIndex((it) => it.id === id);
                setInitialIndex(index >= 0 ? index : 0);

                setTimeout(() => {
                    flatListRef.current?.scrollToIndex({ index: index >= 0 ? index : 0, animated: false });
                }, 50);
            }
        }

        loadAllChords();
    }, [songIds, playlistId, id]);

    if (!chords.length) return <Loading visible={true} />

    return (
        <FlatList
            ref={flatListRef}
            data={chords}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={initialIndex}
            style={{ flex: 1, backgroundColor: "#000000ff" }}
            getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index,
            })}
            renderItem={({ item }) => (
                <ScrollView style={{ width, flex: 1 }}>
                    <ChordData chord={item} />
                </ScrollView>
            )}
        />
    );
}
