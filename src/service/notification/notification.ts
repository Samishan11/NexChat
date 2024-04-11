import { useMutation, useQuery, useQueryClient } from "react-query";
import { apiClient } from "../service.axios";
import Toast from "@/components/Toast";

const listNotification = async (data: number) => {
  if (!data) return;
  const response = await apiClient.get<any>(`/list-notification?id=${data}`);
  return response.data;
};

export const useListNotification = (data: number) => {
  return useQuery(["notification", data], () => listNotification(data));
};

const clearNotification = async (data: number[]) => {
  if (!data) return;
  const response = await apiClient.patch<any>(`/clear-notification`, { data });
  return response.data.message;
};

export const useClearNotification = () => {
  const queryClient = useQueryClient();
  return useMutation(clearNotification, {
    onSuccess: (response) => {
      queryClient.invalidateQueries("notification");
      return response;
    },
    onError: () => {
      Toast({ type: "error", message: "Something ent wrong" });
    },
  });
};
