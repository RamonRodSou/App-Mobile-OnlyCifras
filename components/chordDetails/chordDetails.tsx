import { useDataStore } from "@/hooks/useData";
import { IErrors } from "@/libs/domain/Interfaces/IError";
import { IStruct } from "@/libs/domain/Interfaces/IStruct";
import { StructSong } from "@/libs/domain/StructSong/StructSong";
import { Tones } from "@/libs/enuns/Tones";
import { StringUtils } from "@/libs/utils/StringUtils";
import { sanitize, validateSongForm } from "@/libs/utils/validate";
import { createSongs, deleteSongs, findBySongsId, updateSongs } from "@/service/SongsService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import ConfirmationModal from "../confirmationModal/confirmationModal";
import CustomButton from "../customButton/customButton";
import SelectModal from "../selectModal/selectModal";

type Props = {
    id?: string | null
}

export default function ChordDetails({ id }: Props) {

    const [form, setForm] = useState<StructSong>(new StructSong());
    const [struct, setStruct] = useState<IStruct[]>([{ section: StringUtils.EMPTY, content: [StringUtils.EMPTY] }]);
    const [errors, setErrors] = useState<IErrors>({});
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const router = useRouter();
    const store = useDataStore();

    const title = id ? 'Editar Cifra' : 'Nova Cifra';

    const size = 30;

    const toneList = Object.values(Tones).map(tone => ({
        label: tone,
        value: tone,
    }));

    function handleChange(field: keyof StructSong, value: string) {
        setForm(prev => {
            const data = { ...prev, [field]: value };
            return StructSong.fromJson(data);
        });
    };

    function handleStructChange(index: number, key: keyof IStruct, value: string) {
        const newStruct = [...struct]
        if (key === 'content') {
            const processedValue = value.replaceAll('\n', ' P ');
            newStruct[index][key] = processedValue.split(' ');

        } else {
            newStruct[index][key] = value
        }
        setStruct(newStruct)
        setForm(prev => StructSong.fromJson({ ...prev, struct: newStruct }));
    }

    function formatForm(form: StructSong): StructSong {
        return StructSong.fromJson({
            ...form,
            title: sanitize(String(form.title ?? StringUtils.EMPTY)),
            singer: sanitize(String(form.singer ?? StringUtils.EMPTY)),
            tone: sanitize(String(form.tone ?? StringUtils.EMPTY)),
            struct: form.struct?.map((s) => ({
                section: sanitize(String(s.section ?? StringUtils.EMPTY)),
                content: s.content?.map((c) => sanitize(String(c))) ?? [StringUtils.EMPTY],
            })) ?? [],
        });
    }

    function removeSection(index: number) {
        setStruct(struct.filter((_, i) => i !== index))
    }

    async function saveEntity(data: StructSong) {
        let savedSong: StructSong;

        if (id) {
            await updateSongs(id, data.toJSON());
            savedSong = data;
            store.setStructSong(
                store.structSong.map(s => s.id === id ? savedSong : s)
            );
        } else {
            const newId = await createSongs(data.toJSON());
            savedSong = StructSong.fromJson({ ...data, id: newId });
            store.setStructSong([...store.structSong, savedSong]);
            setForm(new StructSong());
            setStruct([{ section: StringUtils.EMPTY, content: [StringUtils.EMPTY] }]);
        }
    }

    async function addStruct() {
        setStruct([...struct, { section: StringUtils.EMPTY, content: [StringUtils.EMPTY] }])
    }

    async function handleSubmit() {

        const formattedForm = formatForm(form);
        const errors = validateSongForm(formattedForm);

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        await saveEntity(formattedForm);

        router.push('/(tabs)');
    }

    async function loadSong() {
        if (!id) return;
        const song = await findBySongsId(id);

        if (!song) return;
        return song
    }

    async function handleDelete() {
        await deleteSongs(String(id));
        setModalVisible(false);

        store.setStructSong(store.structSong.filter(s => s.id !== id));

        router.push('/(tabs)');
    }

    useEffect(() => {
        if (id) {
            loadSong().then(song => {
                if (song) {
                    setForm(StructSong.fromJson(song));
                    setStruct(song.struct?.length ? song.struct : [{ section: StringUtils.EMPTY, content: [StringUtils.EMPTY] }]);
                }
            });
        }
    }, [id]);

    return (
        <View className="p-4 gap-2 bg-primary">
            <View className="flex-row justify-between items-center">
                <Text className="text-[2rem] text-title mb-3">
                    {title}
                </Text>
                {id && (<CustomButton handle={() => setModalVisible(true)} />)}
            </View>

            <TextInput
                placeholder="Título"
                mode="outlined"
                className="mb-2"
                contentStyle={{ fontSize: 22 }}
                value={form?.title}
                onChangeText={(it) => handleChange('title', it)}
                error={!!errors.title}
            />

            <SelectModal
                label="Tom"
                value={form.tone}
                options={toneList}
                onChange={(val) => handleChange("tone", val)}
            />

            <TextInput
                placeholder="Cantor"
                mode="outlined"
                className="mb-2"
                contentStyle={{ fontSize: 22 }}
                value={form?.singer}
                onChangeText={(it) => handleChange('singer', it)}
                error={!!errors.singer}
            />

            {struct.map((it, index) => (
                <View key={index} className="mt-1 bg-struct rounded relative">
                    {struct.length
                        > 1 && (
                            <TouchableOpacity
                                onPress={() => removeSection(index)}
                                className="absolute -top-4 -right-2 rounded-full justify-center items-center shadow-2xl z-20"
                            >
                                <Ionicons size={size} name="close-circle-outline" color={'#f7831eff'} />
                            </TouchableOpacity>
                        )}
                    <TextInput
                        placeholder="Estrutura"
                        mode="outlined"
                        className="mb-2"
                        contentStyle={{ fontSize: 22 }}
                        value={it?.section}
                        onChangeText={(text) => handleStructChange(index, 'section', text)}
                        error={!!errors[`struct_section_${index}`]}
                    />
                    <TextInput
                        placeholder="Cifra"
                        mode="outlined"
                        multiline
                        numberOfLines={5}
                        textAlignVertical="top"
                        className="mb-6 min-h-[100]"
                        contentStyle={{ fontSize: 22 }}
                        value={it?.content.join(' ').replaceAll(' P ', '\n')}
                        onChangeText={(it) => handleStructChange(index, 'content', it)}
                        error={!!errors[`struct_content_${index}`]}
                    />

                </View>

            ))}
            <ConfirmationModal
                visible={modalVisible}
                title="Confirmação"
                message="Tem certeza que deseja deletar esta música?"
                onCancel={() => setModalVisible(false)}
                onConfirm={handleDelete}
            />
            <View className="flex-row justify-start mt-2">
                <TouchableOpacity
                    onPress={addStruct}
                >
                    <Text className="text-white font-bold">Mais</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                onPress={handleSubmit}
                className="bg-tone w-full h-16 mt-[3rem] rounded-lg justify-center items-center shadow-md">
                <Text className="text-title font-bold text-3xl">
                    Salvar
                </Text>
            </TouchableOpacity>
        </View>
    )
}