import { useMutation, useQuery } from "react-query";
import Toast from "@/components/Toast";
import { apiClient } from "./service.axios";
import { setToken } from "./token";
import { useAuthData } from "../context/auth.context";
import { useNavigate } from "react-router-dom";
type IAuthData = {
  username: string;
  fullname: string;
  email: string;
  password: string;
};

type TResponse = {
  message: string;
  data: IAuthData & { token: string };
};

const login = async ({
  email,
  password,
}: Omit<IAuthData, "fullname" | "username">) => {
  const response = await apiClient.post<string, any>("/login", {
    email,
    password,
  });
  return response;
};

export const useLoginMutation = () => {
  const { setAuthData } = useAuthData();
  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      if (response.data.message === "User login sucessfully") {
        setToken(response.data.token);
        setAuthData(response.data.data);
        Toast({ type: "success", message: "Login Sucessfully" });
        window.location.href = "/";
      } else {
        console.log("object");
        Toast({ type: "error", message: "Email or password not match." });
      }
    },
    onError: (error: any) => {
      console.log(error);
      Toast({ type: "error", message: error?.message });
    },
  });
};

const register = async ({ username, fullname, email, password }: IAuthData) => {
  const response = await apiClient.post<string, TResponse>("/register", {
    email,
    password,
    username,
    fullname,
  });

  return response;
};

export const useRegisterMutation = () => {
  const navigator = useNavigate();
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      navigator("/login");
      Toast({ type: "success", message: "User Register sucessfully" });
    },
    onError: () => {
      Toast({ type: "error", message: "Something went wrong" });
    },
  });
};

export interface IUser {
  id: number;
  name: string;
  img: string;
}

const listUser = async () => {
  const response = await apiClient.get<any>("/users");
  return response.data.data;
};

export const useUserQuery = () => {
  return useQuery(["users"], listUser, {
    select: (response) => response,
  });
};
const updateProfile = async ({ id, data }: any) => {
  const response = await apiClient.patch<any>(`/edit-profile/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};

export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      Toast({ type: "success", message: "Profile updated sucessfully" });
    },
    onError: () => {
      Toast({ type: "error", message: "Something went wrong" });
    },
  });
};
