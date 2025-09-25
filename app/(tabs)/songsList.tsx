import SongsList from '@/components/song/songsList';
import { ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView>
      <SongsList />
    </ScrollView>
  );
}