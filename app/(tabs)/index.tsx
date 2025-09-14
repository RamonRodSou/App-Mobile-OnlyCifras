import { ScrollView } from 'react-native';
import SongsList from '../_component/song/songsList';

export default function HomeScreen() {
  return (
    <ScrollView>
      <SongsList />
    </ScrollView>
  );
}