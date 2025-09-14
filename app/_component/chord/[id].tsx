import { useLocalSearchParams } from "expo-router";
import ChordData from "./chordData";

export default function Chord() {

    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <>
            <ChordData id={id} />
        </>
    )
} 