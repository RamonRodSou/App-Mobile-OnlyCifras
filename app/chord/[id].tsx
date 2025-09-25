import ChordData from "@/components/chordData/chordData";
import { useDataStore } from "@/hooks/useData";
import { findByChordId } from "@/service/ChordService";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

export default function Chord() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const store = useDataStore();

    async function loadChord() {
        if (!id) return;
        store.setChord(null);
        const chord = await findByChordId(id);
        store.setChord(chord);
    }

    useEffect(() => {
        if (id) loadChord();
    }, [id]);

    return <ChordData chord={store.chord} />
} 