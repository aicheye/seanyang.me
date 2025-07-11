import { create } from "zustand";

const useOnekoStore = create((set) => ({
  pos: { x: 32, y: 32 },
  setPos: (pos) => {
    set({ pos });
  },
}));

export default useOnekoStore;
