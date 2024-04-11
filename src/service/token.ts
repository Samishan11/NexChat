import { jwtDecode } from "jwt-decode";

export const setToken = (data: any) => {
  localStorage.setItem("token", JSON.stringify(data));
};
export let token: string;
try {
  token = JSON.parse(localStorage?.getItem("token") ?? "");
} catch (error) {
  console.log(error);
}

export const getToken = (data?: any) => {
  try {
    const decode: any = jwtDecode(data ? data : token);
    return decode.data;
  } catch (error) {
    console.log(error);
  }
};
