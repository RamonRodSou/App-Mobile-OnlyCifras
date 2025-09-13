import { StructChords } from "@/libs/domain/StructChords/StructChords"
import { create } from 'zustand'

type dataStore = {
    structChords: StructChords[],
    setStructChords: (data: StructChords[]) => void
}

export const useDataStore = create<dataStore>((set) => ({
    structChords: [],
    setStructChords: (data) => set({ structChords: data }),
}))