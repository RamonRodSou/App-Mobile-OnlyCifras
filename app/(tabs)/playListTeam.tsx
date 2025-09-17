import ModalFormDetails from '@/components/modalFormDetails/ModalFormDetails';
import { IErrors } from '@/libs/domain/Interfaces/IError';
import { PlayList } from '@/libs/domain/PlayList/PlayList';
import { StringUtils } from '@/libs/utils/StringUtils';
import { sanitize, validatePlayListForm } from '@/libs/utils/validate';
import { createPlayList, findAllPlayList } from '@/service/PlayListService';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';

export default function PlayListTeam() {
    const [form, setForm] = useState<PlayList>(new PlayList());
    const [data, setData] = useState<PlayList[]>([]);
    const [errors, setErrors] = useState<IErrors>({});

    function handleChange(field: keyof PlayList, value: string) {
        setForm(prev => {
            const data = { ...prev, [field]: value };
            return PlayList.fromJson(data);
        });
    };

    function formatForm(form: PlayList): PlayList {
        return PlayList.fromJson({
            ...form,
            title: sanitize(String(form.name ?? StringUtils.EMPTY)),
        });
    }

    async function handleSubmit(close: () => void) {
        const formattedForm = formatForm(form);
        const errors = validatePlayListForm(formattedForm);

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }
        setErrors({});

        await createPlayList(form);

        setForm(new PlayList());
        close();
    }

    async function loadData() {
        const data = await findAllPlayList();
        setData(data);
    }

    useEffect(() => {
        loadData()
    }, [data]);

    return (
        <ScrollView className="flex-1 bg-background p-6">
            <ModalFormDetails
                title="Nova Playlist"
                labelBtn="NOVA"
                submit={(close) => {
                    handleSubmit(close);
                }}
            >
                <TextInput
                    placeholder="Título"
                    className="mb-4 w-full border border-gray-300 p-4 rounded-xl text-[1.375rem] bg-white text-primary"
                    value={form?.name}
                    onChangeText={(it) => handleChange('name', it)}
                />

            </ModalFormDetails>

            <View className="flex-col gap-4">
                {data.map((it, index) => (
                    <Link href={`/favoriteList/${it.id}`} key={index}>
                        <View className="flex-row justify-between items-center bg-struct rounded-3xl p-5 shadow-md w-full">
                            <View className="flex-1 pr-4">
                                <Text className="text-2xl font-bold text-title mb-1">
                                    {it.name}
                                </Text>
                            </View>
                            <Text className="text-sm text-gray-400">
                                {it.songId.length} músicas
                            </Text>
                        </View>
                    </Link>
                ))}
            </View>
        </ScrollView>
    );
}


