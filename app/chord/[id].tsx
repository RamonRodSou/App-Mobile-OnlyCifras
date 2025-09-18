import ChordData from "@/components/chord/chord";
import { useDataStore } from "@/hooks/useData";
import { findBySongsId } from "@/service/SongsService";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

export default function Chord() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const store = useDataStore();

    async function loadChord() {
        if (!id) return;
        store.setChord(null);
        const chord = await findBySongsId(id);
        store.setChord(chord);
    }

    useEffect(() => {
        if (id) loadChord();
    }, [id]);

    return <ChordData chord={store.chord} />
} 