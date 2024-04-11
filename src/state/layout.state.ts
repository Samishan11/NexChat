import { IGroup } from "@/components/adduser/AddUser";
import { Friend } from "@/components/contact/Contact";
import { create } from "zustand";

type TLayout = {
  open: boolean;
  data: Friend | IGroup | null;
  setOpen: (data: boolean) => void;
  setData: (data: Friend | IGroup) => void;
};

export const useLayoutState = create<TLayout>((set) => ({
  data: null,
  open: false,
  setOpen: (data: boolean) =>
    set(() => {
      return { open: data };
    }),
  setData: (data: Friend | IGroup) =>
    set(() => {
      return { data: data };
    }),
}));
