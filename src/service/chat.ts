import { useQuery } from "react-query";
import { apiClient } from "./service.axios";

const listChat = async (data: any) => {
  if (!data) return;
  const response = await apiClient.get<any>(`/chat-list?roomId=${data}`);
  return response.data.data;
};

export const useListChat = (data: any) => {
  return useQuery(["chat", data], () => listChat(data));
};
