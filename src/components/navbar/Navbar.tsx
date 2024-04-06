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
import { GrLanguage } from "react-icons/gr";
import { useTheme } from "next-themes";

const Navbar = () => {
  const { current, setCurrent } = useNavbarState();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="w-full dark:bg-neutral-800 md:dark:bg-neutral-950/10 bg-neutral-200 md:bg-none z-[99] fixed -bottom-1 md:bottom-0 left-0 md:relative md:w-[100px] flex flex-row md:flex-col items-start justify-center md:justify-start md:items-center shadow-md h-16 md:h-screen">
      <img
        className="mt-[21px] md:block hidden"
        src={Logo}
        width={"30px"}
        alt=""
      />
      <div className="mt-[6px] md:mt-[85px] md:block flex">
        {NAVBARITEM.map((data) => {
          return (
            <div key={data.name} className="md:mb-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setCurrent(data.name)}
                      className={`${
                        current === data.name &&
                        "dark:bg-neutral-600/60 bg-neutral-300 "
                      } dark:hover:text-indigo-200 hover:bg-neutral-300 hover:dark:bg-neutral-700/60 py-4 rounded-[6px]`}
                      variant="ghost"
                    >
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
      <div className="mt-8 flex flex-col items-center">
        <Button variant="ghost">
          <GrLanguage
            size={24}
            className="text-neutral-500 mb-14 dark:text-neutral-200"
          />
        </Button>
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
      </div>
    </div>
  );
};

export default Navbar;
