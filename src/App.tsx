import React, { lazy, Suspense } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthContext, AuthData } from "@/context/auth.context";
import { SocketContext } from "@/context/socket.context";
import io, { Socket } from "socket.io-client";
import { jsonParser } from "@/utils/jsonParser";
import { getToken } from "@/service/token";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { cn } from "./lib/utils";
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const Layout = lazy(() => import("@/layout/Layout"));
export default function App() {
  const queryClient = new QueryClient();
  const user: AuthData = getToken();
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [authData, setAuthData] = React.useState<AuthData | null>(null);
  const token = jsonParser(localStorage.getItem("token") as string);

  //  hooks
  React.useEffect(() => {
    if (!user?._id) return;
    const socket: Socket = io("https://api-chatting-app.onrender.com", {
      query: {
        userId: user?._id,
      },
    });
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, [user?._id]);

  React.useEffect(() => {
    try {
      if (!token) return;
      setAuthData(token);
    } catch (error: any) {
      console.log(error?.message);
    }
  }, [token]);

  function ProtectedRoute() {
    if (token) {
      return <Outlet />;
    } else {
      return <Navigate to="/login" />;
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <AuthContext.Provider value={{ authData, setAuthData }}>
          <SocketContext.Provider value={{ socket }}>
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-[100dvh]">
                  <div className="flex gap-2 items-center">
                    <span>Loading</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={30}
                      height={30}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={cn("animate-spin")}
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  </div>
                </div>
              }
            >
              <Router>
                <Routes>
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Layout />} />
                  </Route>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
                <Toaster position="bottom-right" reverseOrder={false} />
              </Router>
            </Suspense>
            {/* <Layout /> */}
          </SocketContext.Provider>
        </AuthContext.Provider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
