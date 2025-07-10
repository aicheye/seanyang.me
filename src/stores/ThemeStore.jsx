import { create } from "zustand";

const useThemeStore = create((set) => ({
  isLightMode: false,
  setIsLightMode: (isLightMode) => {
    set({ isLightMode });
    document.documentElement.setAttribute("data-theme", isLightMode ? "light" : "dark");
  },
}));

if (typeof window !== "undefined") {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
  useThemeStore.getState().setIsLightMode(mediaQuery.matches);

  mediaQuery.addEventListener("change", (event) => {
    useThemeStore.getState().setIsLightMode(event.matches);
  });
}

export default useThemeStore;
