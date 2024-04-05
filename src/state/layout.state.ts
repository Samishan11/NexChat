import { create } from "zustand";

type TLayout = {
  open: boolean;
  setOpen: (data: boolean) => void;
};

export const useLayoutState = create<TLayout>((set) => ({
  open: false,
  setOpen: (data: boolean) =>
    set(() => {
      return { open: data };
    }),
}));
