import { useDataStore } from "@/hooks/useData";
import { Chord } from "@/libs/domain/Chord/Chord";
import { IErrors } from "@/libs/domain/Interfaces/IError";
import { IStruct } from "@/libs/domain/Interfaces/IStruct";
import { Tones } from "@/libs/enuns/Tones";
import { StringUtils } from "@/libs/utils/StringUtils";
import { sanitize, validateSongForm } from "@/libs/utils/validate";
import { createChord, deleteChord, findByChordId, updateChord } from "@/service/ChordService";
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

    const [form, setForm] = useState<Chord>(new Chord());
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

    function handleChange(field: keyof Chord, value: string) {
        setForm(prev => {
            const data = { ...prev, [field]: value };
            return Chord.fromJson(data);
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
        setForm(prev => Chord.fromJson({ ...prev, struct: newStruct }));
    }

    function formatForm(form: Chord): Chord {
        return Chord.fromJson({
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

    async function saveEntity(data: Chord) {
        let savedSong: Chord;

        if (id) {
            await updateChord(id, data.toJSON());
            savedSong = data;
            store.setStructChors(
                store.structChords.map(s => s.id === id ? savedSong : s)
            );
        } else {
            const newId = await createChord(data.toJSON());
            savedSong = Chord.fromJson({ ...data, id: newId });
            store.setStructChors([...store.structChords, savedSong]);
            setForm(new Chord());
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

        router.push('/songsList');
    }

    async function loadSong() {
        if (!id) return;
        const song = await findByChordId(id);

        if (!song) return;
        return song
    }

    async function handleDelete() {
        await deleteChord(String(id));
        setModalVisible(false);

        store.setStructChors(store.structChords.filter(s => s.id !== id));

        router.push('/(tabs)');
    }

    useEffect(() => {
        if (id) {
            loadSong().then(song => {
                if (song) {
                    setForm(Chord.fromJson(song));
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