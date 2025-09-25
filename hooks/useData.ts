import { Chord } from "@/libs/domain/Chord/Chord"
import { create } from 'zustand'

type dataStore = {
    structChords: Chord[],
    setStructChors: (data: Chord[]) => void,

    chord: Chord | null,
    setChord: (data: Chord | null) => void,

    isFavorite: boolean,
    setIsFavorite: (data: boolean) => void,
}

export const useDataStore = create<dataStore>((set) => ({
    structChords: [],
    setStructChors: (data) => set({ structChords: data }),

    chord: null,
    setChord: (data) => set({ chord: data }),

    isFavorite: false,
    setIsFavorite: (data) => set({ isFavorite: data }),
}))