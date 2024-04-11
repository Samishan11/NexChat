import { createContext, useContext } from "react";

export type AuthData = {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
} | null;

export type IType = {
  authData: AuthData;
  setAuthData: (data: AuthData) => void;
};

export const AuthContext = createContext<IType>({
  authData: null,
  setAuthData: () => {},
});

export const useAuthData = () => useContext(AuthContext);
