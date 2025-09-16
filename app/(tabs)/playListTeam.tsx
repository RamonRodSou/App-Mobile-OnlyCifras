import ModalFormDetails from '@/components/ModalFormDetails/ModalFormDetails';
import { PlayList } from '@/libs/domain/PlayList/PlayList';
import { createPlayList, findAllPlayList } from '@/service/PlayListService';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';

export default function PlayListTeam() {
    const [form, setForm] = useState<PlayList>(new PlayList());
    const [data, setData] = useState<PlayList[]>([]);
    const [visible, setVisible] = useState(false);

    function handleChange(field: keyof PlayList, value: string) {
        setForm(prev => {
            const data = { ...prev, [field]: value };
            return PlayList.fromJson(data);
        });
    };

    async function handleSubmit() {
        await createPlayList(form);
        setForm(new PlayList());
    }

    async function loadData() {
        const data = await findAllPlayList();
        setData(data);
    }

    useEffect(() => {
        loadData()
    }, [data]);

    return (
        <ScrollView>
            <ModalFormDetails
                title='Nova Playlist'
                labelBtn='NOVA'
                submit={(close) => {
                    handleSubmit();
                    close();
                }}
            >

                <TextInput
                    placeholder="Título"
                    className="mb-2 w-full border p-5 rounded-lg justify-center items-center text-[1.375rem]"
                    value={form?.name}
                    onChangeText={(it) => handleChange('name', it)}
                />
            </ModalFormDetails>


            {data.map((it, index) => (
                <Link href={`/favoriteList/${it.id}`} key={index}>
                    <View className="w-full h-[50] mb-3 p-4 rounded-2xl bg-struct shadow-sm mb-2 flex-row justify-between items-center gap-1">
                        <Text className="text-2xl font-bold text-title">
                            {it.name}
                        </Text>
                        <Text className="text-sm text-gray-500">
                            {it.songId.length} Musicas
                        </Text>
                    </View>
                </Link>
            ))}

        </ScrollView>
    );
}


