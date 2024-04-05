import { create } from "zustand";

type TNavbarState = {
  current: string;
  setCurrent: (data: string) => void;
};

export const useNavbarState = create<TNavbarState>((set) => ({
  current: "Chat",
  setCurrent: (data: string) =>
    set(() => {
      return { current: data };
    }),
}));
