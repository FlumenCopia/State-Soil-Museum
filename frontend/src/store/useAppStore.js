import { create } from "zustand";

export const useAppStore = create((set) => ({
  view: "globe", // "globe" | "india" | "kerala"
  selectedSoil: null,

  setView: (view) => set({ view }),
  setSelectedSoil: (soil) => set({ selectedSoil: soil }),
}));
