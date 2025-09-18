import ChordDetails from '@/components/chordDetails/chordDetails';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';

export default function NewChord() {
    const { id } = useLocalSearchParams<{ id?: string }>();

    return (
        <ScrollView >
            <ChordDetails id={id} />
        </ScrollView>
    );
}