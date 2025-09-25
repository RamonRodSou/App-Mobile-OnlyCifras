import { useDataStore } from '@/hooks/useData';
import { Chord } from '@/libs/domain/Chord/Chord';
import { PlayList } from '@/libs/domain/PlayList/PlayList';
import { ColorUtils } from '@/libs/utils/ColorUtils';
import { activeFilter, filterAndPaginate } from '@/libs/utils/filterEntities';
import { StringUtils } from '@/libs/utils/StringUtils';
import { findAllChords } from '@/service/ChordService';
import { findUserPlaylists, updatePlayList } from '@/service/PlayListService';
import { Link } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import CustomButton from '../customButton/customButton';
import Loading from '../loading/loadgin';
import PaginedButton from '../paginedButton/paginedButton';
import PlaylistRadiusModal from '../playlistRadiusModal/playlistRadiusModal';

export default function SongsList() {
    const store = useDataStore();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [playList, setPlayList] = useState<PlayList[]>([]);
    const [selectedSong, setSelectedSong] = useState<string>(StringUtils.EMPTY);
    const [searchTerm, setSearchTerm] = useState<string>(StringUtils.EMPTY);
    const [page, setPage] = useState<number>(0);

    const playlistsWithSong = selectedSong
        ? playList.filter(it => it.songId?.includes(selectedSong))
        : [];

    const processedSongs = useMemo(() => {
        if (!store.structChords) return [];

        return store.structChords.map((it) => {
            const song = Chord.fromJson(it);
            song.title = song.title.toUpperCase();
            song.singer = song.singer.trim();
            return song;
        });
    }, [store.structChords]);

    const displayedSongs = useMemo(() => {
        if (!searchTerm) return processedSongs;
        return processedSongs.filter(song =>
            song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.singer.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [processedSongs, searchTerm]);

    const activeEntities = activeFilter(displayedSongs);
    const entities = filterAndPaginate({ entity: activeEntities, page });

    const handleAddPlayList = useCallback(async (selectedPlaylists: string[], songId: string) => {
        for (const list of playList) {
            const updatedSongs = list.songId ? [...list.songId] : [];
            const isSelected = selectedPlaylists.includes(list.id);

            if (isSelected && !updatedSongs.includes(songId)) {
                updatedSongs.push(songId);
            } else if (!isSelected && updatedSongs.includes(songId)) {
                const index = updatedSongs.indexOf(songId);
                updatedSongs.splice(index, 1);
            }

            await updatePlayList(list, { songId: updatedSongs });
        }

        setSelectedSong(StringUtils.EMPTY);
        setModalVisible(false);
    }, [playList]);

    const openModalPlayList = useCallback(async (data: Chord) => {
        setSelectedSong(data.id);
        const list = await findUserPlaylists();
        setPlayList(list);
        setModalVisible(true);
    }, [])

    async function loadData() {
        setLoading(true);
        const songs = await findAllChords();
        store.setStructChors(songs);
        setLoading(false);
    }

    useEffect(() => {
        loadData();
        setPage(0);
    }, []);

    if (loading) {
        return <Loading visible={true} />
    }

    return (
        <View>
            <View>
                <TextInput
                    placeholder="Buscar cifra"
                    mode="outlined"
                    className="mb-2"
                    contentStyle={{ fontSize: 22 }}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
            </View>
            {entities?.map((it, index) => (
                <TouchableOpacity key={index} className='p-2 mb-2 rounded-md flex-row justify-between items-center'>
                    <Link href={`/chord/${it.id}`}>
                        <View>
                            <Text className='text-title text-xl' >{it.title}</Text>
                            <Text className='text-yellow-400 text-base'>{it.singer}</Text>
                        </View>
                    </Link>

                    <CustomButton handle={() => openModalPlayList(it)} color={ColorUtils.DEFAULT} icon="plus-circle" />

                </TouchableOpacity >
            ))}
            {modalVisible && selectedSong && (
                <PlaylistRadiusModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    playList={playList}
                    preSelected={playlistsWithSong.map(pl => pl.id)}
                    onSubmit={(selectedPlaylists) => handleAddPlayList(selectedPlaylists, selectedSong)}
                />
            )}
            {activeEntities.length > StringUtils.ROWS_PER_PAGE && (
                <PaginedButton
                    page={page}
                    setPage={setPage}
                    activeEntity={activeEntities}
                />
            )}
        </View>
    )
}