import { Friend } from "@/components/contact/Contact";
import { TMessage } from "@/components/inbox/Inbox";

type DataType = Friend | TMessage;

type UserIdType = string;

export const checkUser = <T extends DataType>(
  auth: UserIdType,
  data: T
):
  | Friend["requestBy"]
  | Friend["requestTo"]
  | TMessage["messageBy"]
  | TMessage["messageTo"] => {
  if ("requestBy" in data) {
    if (auth === data?.requestBy?._id) {
      return data?.requestTo;
    } else {
      return data?.requestBy;
    }
  } else {
    if (auth === data?.messageBy?._id) {
      return data?.messageTo;
    } else {
      return data?.messageBy;
    }
  }
};
