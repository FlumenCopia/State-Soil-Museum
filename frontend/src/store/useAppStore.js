import { create } from "zustand";

export const useAppStore = create((set) => ({
  view: "globe", // globe | india3D | indiaImage
  setView: (view) => set({ view }),
}));
