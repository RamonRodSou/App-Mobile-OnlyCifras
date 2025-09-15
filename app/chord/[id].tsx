import ChordData from "@/components/chord/chord";
import { useLocalSearchParams } from "expo-router";

export default function Chord() {

    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <>
            <ChordData id={id} />
        </>
    )
} 