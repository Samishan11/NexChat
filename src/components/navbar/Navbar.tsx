import { useCallback } from "react";
import Logo from "@/assets/logo.svg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { NAVBARITEM } from "@/constrants/navbar.constrants";
import { useNavbarState } from "@/state/navbar.state";
import { FaRegMoon } from "react-icons/fa";
import { FaSun } from "react-icons/fa6";
import { useTheme } from "next-themes";
import { useClearNotification } from "@/service/notification/notification";
import { IoMdLogOut } from "react-icons/io";
import { useListRequest } from "@/service/request";
import { useAuthData } from "@/context/auth.context";
import { getToken } from "@/service/token";

interface IProp {
  count: number;
  notifications: any[];
}
const Navbar = ({ count, notifications }: IProp) => {
  const { current, setCurrent } = useNavbarState();
  const { theme, setTheme } = useTheme();
  const { authData } = useAuthData();
  const auth = getToken(authData);
  //  react query notification clear
  const clear = useClearNotification();

  const { data: requestList } = useListRequest(auth?._id);

  const notificationId = notifications?.map(
    (data: { _id: number }) => data?._id
  );

  //  methods

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleClick = useCallback(() => {
    clear.mutate(notificationId);
  }, [clear, notificationId]);

  const handelLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="w-full dark:bg-neutral-800 md:dark:bg-neutral-950/10 bg-neutral-200 md:bg-none z-[99] fixed -bottom-1 md:bottom-0 left-0 md:relative md:w-[100px] flex flex-row md:flex-col items-start justify-center md:justify-start md:items-center shadow-md h-16 md:h-screen">
      <img
        className="mt-[21px] md:block hidden"
        src={Logo}
        width={"30px"}
        alt=""
      />
      <div className="mt-[6px] sm:pl-0 pl-2 md:mt-[85px] md:block flex gap-2 md:gap-0 overflow-x-scroll">
        {NAVBARITEM.map((data) => {
          return (
            <div key={data.name} className="md:mb-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => {
                        setCurrent(data.name);
                        handleClick();
                      }}
                      className={`${
                        current === data.name &&
                        "dark:bg-neutral-600/60 bg-neutral-300"
                      } dark:hover:text-indigo-200 relative hover:bg-neutral-300 hover:dark:bg-neutral-700/60 py-4 rounded-[6px]`}
                      variant="ghost"
                    >
                      {count > 0 && data.name === "Notification" && (
                        <span className="absolute top-0 md:-top-2 right-0 min-h-7 min-w-7 max-h-7 text-xs max-w-7 grid place-items-center text-neutral-100 dark:bg-red-500 bg-red-400 rounded-full px-1">
                          {count > 9 ? `${count}+` : count}
                        </span>
                      )}
                      {requestList &&
                        requestList.length > 0 &&
                        data.name === "Requests" && (
                          <span className="absolute top-0 md:-top-2 right-0 min-h-7 min-w-7 max-h-7 text-xs max-w-7 grid place-items-center text-neutral-100 dark:bg-red-500 bg-red-400 rounded-full px-1">
                            {requestList?.length > 9
                              ? `${requestList?.length > 9 && 9}+`
                              : requestList?.length}
                          </span>
                        )}
                      {data.icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-white dark:text-black dark:bg-white bg-black p-1 rounded-md">
                      {data.name}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        })}
      </div>
      <div className="md:mt-8 flex flex-col items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={toggleTheme}
                className={`py-6 !rounded-lg `}
                variant="ghost"
              >
                {theme === "dark" ? (
                  <FaSun
                    size={24}
                    className="dark:text-neutral-200 text-neutral-500"
                  />
                ) : (
                  <FaRegMoon
                    size={24}
                    className="dark:text-neutral-200 text-neutral-500"
                  />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className=" bg-black text-white p-1 rounded-md">
                {theme === "dark" ? "Dark Mode" : "Light Mode"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          onClick={handelLogout}
          className={`py-6 !rounded-lg mt-2 `}
          variant="ghost"
        >
          <IoMdLogOut
            size={24}
            className="dark:text-neutral-200 text-neutral-500"
          />
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
