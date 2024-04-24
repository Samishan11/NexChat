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
import { Spinner } from "@/icons/icon";
import { apiClient, baseURL } from "@/service/service.axios";
import Pagenotfount from "./pages/404";
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const Layout = lazy(() => import("@/layout/Layout"));

export default function App() {
  const queryClient = new QueryClient();
  const user: AuthData = getToken();
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [authData, setAuthData] = React.useState<AuthData | null>(null);
  const token = jsonParser(localStorage.getItem("token") as string);

  function Interceptor() {
    apiClient.interceptors.request.use(
      (request) => {
        // Edit request config
        return request;
      },
      (error) => {
        console.log("error");
        return Promise.reject(error);
      }
    );

    apiClient.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        console.error("Response Error:", "error response");

        if (
          error.response &&
          error.response.status === 500 &&
          error.response.data.message === "JWT verification failed"
        ) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  Interceptor();

  //  hooks
  React.useEffect(() => {
    if (!user?._id) return;
    const socket: Socket = io(baseURL, {
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
                    <Spinner />
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
                  <Route path="*" element={<Pagenotfount />} />
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
