import { useMutation, useQuery } from "react-query";
import { apiClient } from "./service.axios";
import Toast from "@/components/Toast";

const listRequest = async (data: string) => {
  if (!data) return;
  const response = await apiClient.get<any>(`/list-request?id=${data}`);
  return response.data.data;
};

export const useListRequest = (data: string) => {
  return useQuery({
    queryKey: ["request"],
    queryFn: () => listRequest(data),
  });
};

const listFriend = async (data: string) => {
  if (!data) return;
  const response = await apiClient.get<any>(`/list-friend?id=${data}`);
  return response.data.data;
};

export const useListFriend = (data: string) => {
  return useQuery({ queryKey: ["friend"], queryFn: () => listFriend(data) });
};

const removeFriend = async ({ id, roomId }: { id: string; roomId: string }) => {
  if (!id || !roomId) return;
  const response = await apiClient.delete<any>(
    `/remove-friend/${id}/${roomId}`
  );
  return response.data.data;
};

export const useRemoveFriend = () => {
  return useMutation({
    mutationKey: ["friend"],
    mutationFn: removeFriend,
    onSuccess: (response) => {
      if (response) {
        Toast({ type: "success", message: "Friend has been removed" });
      } else {
        Toast({ type: "error", message: "Something went wrong" });
      }
    },
    onError: () => {
      Toast({ type: "error", message: "Something went wrong" });
    },
  });
};

const removePendingRequest = async ({ id }: { id: string }) => {
  if (!id) return;
  const response = await apiClient.delete<any>(`/remove-pending-request/${id}`);
  return response.data.data;
};

export const useRemovePendingRequest = () => {
  return useMutation({
    mutationKey: ["request", "friend"],
    mutationFn: removePendingRequest,
    onSuccess: (response) => {
      if (response) {
        Toast({ type: "success", message: "Request has been removed" });
      } else {
        Toast({ type: "error", message: "Something went wrong" });
      }
    },
    onError: (e) => {
      console.log(e);
      Toast({ type: "error", message: "Something went wrong" });
    },
  });
};
