import { IStruct } from "@/libs/domain/Interfaces/IStruct";
import { StructSong } from "@/libs/domain/StructSong/StructSong";
import { Tones } from "@/libs/enuns/Tones";
import { StringUtils } from "@/libs/utils/StringUtils";
import { createSongs } from "@/service/SongsService";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import SelectModal from "../selectModal/SelectModal";

export default function ChordDetails() {
    const [form, setForm] = useState<StructSong>(new StructSong());
    const [struct, setStruct] = useState<IStruct[]>([{ section: '', content: [''] }]);
    const route = useRoute();

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
        form.struct = struct;
    }

    async function addStruct() {
        setStruct([...struct, { section: StringUtils.EMPTY, content: [StringUtils.EMPTY] }])
    }

    function removeSection(index: number) {
        setStruct(struct.filter((_, i) => i !== index))
    }

    async function handleSubmit() {
        await createSongs(form);
        setForm(new StructSong());
        setStruct([{ section: StringUtils.EMPTY, content: [StringUtils.EMPTY] }]);
    }

    return (
        <View className="p-4 gap-2 bg-primary">
            <Text className="text-[2rem] text-title mb-3">
                Cadastrar Nova Cifra
            </Text>
            <TextInput
                placeholder="Título"
                mode="outlined"
                className="mb-2"
                contentStyle={{ fontSize: 22 }}
                value={form?.title}
                onChangeText={(it) => handleChange('title', it)}
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
                    />

                </View>
            ))}
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