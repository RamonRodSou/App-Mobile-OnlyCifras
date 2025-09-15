import { StructSong } from "@/libs/domain/StructSong/StructSong"
import { create } from 'zustand'

type dataStore = {
    structSong: StructSong[],
    setStructSong: (data: StructSong[]) => void,

    chord: StructSong | null,
    setChord: (data: StructSong | null) => void,

    isFavorite: boolean,
    setIsFavorite: (data: boolean) => void,
}

export const useDataStore = create<dataStore>((set) => ({
    structSong: [],
    setStructSong: (data) => set({ structSong: data }),
    chord: null,
    setChord: (data) => set({ chord: data }),

    isFavorite: false,
    setIsFavorite: (data) => set({ isFavorite: data }),
}))