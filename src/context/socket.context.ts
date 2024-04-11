import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

// export interface ISocket extends Socket {
//   on: () => void;
//   off: () => void;
// }
export type IType = {
  socket: Socket | null;
};
export const SocketContext = createContext<IType>({
  socket: null,
});

export const useSocket = () => useContext(SocketContext);
