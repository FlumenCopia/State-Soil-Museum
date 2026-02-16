import { create } from "zustand";

export const useAppStore = create((set) => ({
  view: "globe", // "globe" | "india" | "kerala"
  selectedSoil: null,
  indiaRevealReady: false,
  indiaMaskReady: false,
  overlayMapView: "india",

  setView: (view) =>
    set((state) => {
      if (state.view === view) return state;
      return {
        view,
        indiaRevealReady: false,
        indiaMaskReady: false,
      };
    }),
  setSelectedSoil: (soil) => set({ selectedSoil: soil }),
  setIndiaRevealReady: (ready) => set({ indiaRevealReady: ready }),
  setIndiaMaskReady: (ready) => set({ indiaMaskReady: ready }),
  setOverlayMapView: (overlayMapView) => set({ overlayMapView }),
}));
