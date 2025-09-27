import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

type TutorialSectionProps = {
    title: string;
    children: React.ReactNode;
};

const TutorialSection = ({ title, children }: TutorialSectionProps) => (
    <View className="mb-8">
        <Text className="text-2xl font-bold text-green-400 mb-3">{title}</Text>
        {children}
    </View>
);

type ChordExampleProps = {
    example: string;
    explanation: string;
};

const ChordExample = ({ example, explanation }: ChordExampleProps) => (
    <View className="bg-gray-800 p-4 rounded-lg my-4">
        <Text className="text-yellow-400 font-bold text-lg text-center tracking-widest">{example}</Text>
        <Text className="text-secondary mt-3 text-base">
            <Text className="font-bold text-gray-200">Leitura:</Text> {explanation}
        </Text>
    </View>
);

export default function TutorialScreen() {
    const structureItems = [
        "Intro", "Verso", "Pré-Refrão", "Refrão", "Interlúdio", "Ponte", "Solo",
    ];

    return (
        <ScrollView className="flex-1 bg-primary">
            <View className="p-6 pt-12">
                <View className="items-center mb-8">
                    <Ionicons name="musical-notes-outline" size={40} color="#34D399" />
                    <Text className="text-3xl font-bold text-secondary  mt-2 text-center">Como Ler e Escrever Cifras no GsusApp</Text>
                </View>

                <Text className="text-base text-secondary leading-relaxed mb-10 text-start">
                    Olá, músico! Bem-vindo ao nosso guia rápido para entender a estrutura de cifras em nosso app. Criamos um sistema simples e poderoso para você. Vamos decifrar juntos!
                </Text>

                <TutorialSection title="1. O Básico: Compasso e Tempos">
                    <Text className="text-base text-secondary leading-relaxed">
                        A base da nossa escrita é o compasso, representado por <Text className="font-bold text-secondary ">|</Text>. A regra geral é que um compasso equivale a 4 tempos.
                    </Text>
                    <ChordExample
                        example="| B |"
                        explanation="Toque o acorde de Si Maior e conte 4 tempos antes de passar para o próximo."
                    />
                </TutorialSection>

                <TutorialSection title="2. Dividindo o Compasso">
                    <Text className="text-base text-secondary leading-relaxed mb-2">
                        Precisa de mais de um acorde em 4 tempos? Sem problemas.
                    </Text>
                    <ChordExample
                        example="| B C |"
                        explanation="O acorde B é tocado por 2 tempos e o acorde C pelos 2 tempos seguintes."
                    />
                    <Text className="text-base text-secondary leading-relaxed mt-4">
                        Para criar passagens rápidas, usamos o ponto <Text className="font-bold text-secondary ">.</Text>
                    </Text>
                    <ChordExample
                        example="| Gm. F/C |"
                        explanation="O acorde com o ponto (Gm) dura 3 tempos, e o seguinte (F/C) dura apenas 1 tempo, servindo como uma passagem."
                    />
                </TutorialSection>

                <TutorialSection title="3. Barras Duplas ||: Dobrando o Tempo">
                    <Text className="text-base text-secondary leading-relaxed">
                        Quando um acorde é cercado por barras duplas, ele tem sua duração dobrada para 8 tempos, preenchendo dois compassos inteiros.
                    </Text>
                    <ChordExample
                        example="| C || D || Em |"
                        explanation="O acorde C dura 4 tempos, o D dura 8 tempos (dois compassos), e o Em volta a durar 4 tempos."
                    />
                </TutorialSection>

                <TutorialSection title="4. Repetições (x2, x3, ...)">
                    <Text className="text-base text-secondary leading-relaxed">
                        Para evitar reescrever sequências, use o multiplicador <Text className="font-bold text-secondary ">x</Text> no final da linha.
                    </Text>
                    <ChordExample
                        example="| C | G | Am | F | x2"
                        explanation="Toque a sequência completa de 'C' até 'F'. Ao final, repita a mesma sequência mais uma vez. No total, a sequência será tocada 2 vezes."
                    />
                </TutorialSection>

                <TutorialSection title="5. Baixo Invertido (Slash Chords)">
                    <Text className="text-base text-secondary leading-relaxed">
                        Quando você vir um acorde com uma barra <Text className="font-bold text-secondary ">/</Text>, a nota do baixo é diferente da tônica do acorde.
                    </Text>
                    <ChordExample
                        example="F#/C#"
                        explanation="Toque o acorde de Fá Sustenido Maior (F#) com a nota Dó Sustenido (C#) como a nota mais grave (o baixo)."
                    />
                </TutorialSection>

                <TutorialSection title="6. A Estrutura da Música">
                    <Text className="text-base text-secondary leading-relaxed mb-4">
                        Toda música é organizada em seções para facilitar a leitura e a execução. As seções que você encontrará são:
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                        {structureItems.map(item => (
                            <View key={item} className="bg-green-500/20 px-3 py-1 rounded-full">
                                <Text className="text-green-300 font-bold text-sm">{item}</Text>
                            </View>
                        ))}
                    </View>
                </TutorialSection>

                <TutorialSection title="7. Criando uma Música">

                    <ChordExample
                        example="Escrevendo"
                        explanation={`Estrutura - Indica a parte da música que será escrita, como aprendido na seção 6.
Cifra - Contém toda a cifra da música, sempre começando com "|" para marcar o tempo.  
Caso precise adicionar mais seções à música, clique no botão "Mais" logo abaixo.`}
                    />

                    <Text className="text-base text-secondary leading-relaxed mt-6">
                        Exemplo de como ficaria a escrita de uma musica.
                    </Text>
                    <View className='items-center justify-center p-4'>
                        <Image source={require('../../assets/images/cifras.png')} />
                    </View>
                </TutorialSection >

                <View className="mt-2 border-t border-gray-700 pt-6">
                    <Text className="text-lg text-secondary  font-bold text-center">Tudo pronto!</Text>
                    <Text className="text-base text-secondary leading-relaxed text-center mt-2">
                        Com estas regras, você está preparado para ler e cadastrar suas músicas de forma precisa e profissional. Bons sons!
                    </Text>
                </View>

            </View >
        </ScrollView >
    );
}