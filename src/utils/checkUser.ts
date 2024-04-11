import { Friend } from "@/components/contact/Contact";

export const checkUser = (auth: string, data: Friend) => {
  if (auth === data?.requestBy?._id) {
    return data?.requestTo;
  } else {
    return data?.requestBy;
  }
};
