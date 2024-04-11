import { create } from "zustand";

type TNavbarState = {
  open: boolean;
  setOpen: (data: boolean) => void;
};

export const useModalState = create<TNavbarState>((set) => ({
  open: false,
  setOpen: (data: boolean) =>
    set(() => {
      return { open: data };
    }),
}));
