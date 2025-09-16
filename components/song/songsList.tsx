import { useDataStore } from '@/hooks/useData';
import { PlayList } from '@/libs/domain/PlayList/PlayList';
import { StructSong } from '@/libs/domain/StructSong/StructSong';
import { StringUtils } from '@/libs/utils/StringUtils';
import { findAllFavorite } from '@/service/FavoriteService';
import { findAllPlayList, updatePlayList } from '@/service/PlayListService';
import { findAllSongs } from '@/service/SongsService';
import { Link } from 'expo-router';
import React, { useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import Loading from '../loading/loadgin';
import PlaylistModalRadius from '../PlaylistModalRadius/PlaylistModalRadius';

export default function SongsList() {
    const store = useDataStore();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [playList, setPlayList] = useState<PlayList[]>([]);
    const [selectedSong, setSelectedSong] = useState<string>(StringUtils.EMPTY);

    const playlistsWithSong = selectedSong
        ? playList.filter(pl => pl.songId?.includes(selectedSong))
        : [];

    const processedSongs = useMemo(() => {
        if (!store.structSong) return [];

        return store.structSong.map((it) => {
            const song = StructSong.fromJson(it);
            song.title = song.title.toUpperCase();
            song.singer = song.singer.trim();
            return song;
        });
    }, [store.structSong]);

    async function openModalPlayList(data: StructSong) {
        setSelectedSong(data.id);
        loadPlaylist();
        setModalVisible(true);
    }

    async function handleAddPlayList(selectedPlaylists: string[], songId: string) {
        for (const playlist of playList) {
            const updatedSongs = playlist.songId ? [...playlist.songId] : [];
            const isSelected = selectedPlaylists.includes(playlist.id);

            if (isSelected && !updatedSongs.includes(songId)) {
                updatedSongs.push(songId);
            } else if (!isSelected && updatedSongs.includes(songId)) {
                const index = updatedSongs.indexOf(songId);
                updatedSongs.splice(index, 1);
            }

            await updatePlayList(playlist.id, { songId: updatedSongs });
        }

        setSelectedSong(StringUtils.EMPTY);
        setModalVisible(false);
    }

    async function loadData() {
        setLoading(true);
        const songs = await findAllSongs();
        store.setStructSong(songs);
        setLoading(false);
    }

    async function loadFavorite() {
        const data = await findAllFavorite();
    }

    async function loadPlaylist() {
        const data = await findAllPlayList();
        setPlayList(data);
    }

    useEffect(() => {
        loadData();
        loadFavorite();
    }, []);

    if (loading) {
        return <Loading visible={true} />
    }

    return (
        <>
            {processedSongs?.map((it, index) => (
                <TouchableOpacity key={index} className='p-2 mb-2 rounded-md flex-row justify-between items-center'>
                    <Link href={`/chord/${it.id}`}>
                        <View>
                            <Text className='text-title text-xl' >{it.title}</Text>
                            <Text className='text-yellow-400 text-base'>{it.singer}</Text>
                        </View>
                    </Link>

                    <TouchableOpacity>
                        <IconButton
                            icon="cards-heart-outline"
                            size={28}
                            iconColor="#ffffff96"
                            onPress={() => openModalPlayList(it)}
                        />
                    </TouchableOpacity>
                </TouchableOpacity >
            ))}
            {modalVisible && selectedSong && (
                <PlaylistModalRadius
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    playList={playList}
                    preSelected={playlistsWithSong.map(pl => pl.id)}
                    onSubmit={(selectedPlaylists) => handleAddPlayList(selectedPlaylists, selectedSong)}
                />
            )}

        </>

    )
}