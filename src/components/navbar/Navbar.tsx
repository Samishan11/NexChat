import { useState } from "react";
import Logo from "@/assets/logo.svg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { NAVBARITEM } from "@/constrants/navbar.constrants";
const Navbar = () => {
  const [current, setCurrent] = useState<string>("Chat");
  return (
    <div className="w-full fixed bottom-0 bg-neutral-100 left-0 md:relative md:w-[75px] flex flex-row md:flex-col items-start justify-center md:justify-start  md:items-center shadow-md h-16 md:h-screen">
      <img
        className="mt-[21px] md:block hidden"
        src={Logo}
        width={"30px"}
        alt=""
      />
      <div className="mt-2 md:mt-20 md:block flex">
        {NAVBARITEM.map((data) => {
          return (
            <div key={data.name} className="md:mb-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setCurrent(data.name)}
                      className={` ${
                        current === data.name &&
                        "bg-indigo-100/60 [&_.text-neutral-500]:text-indigo-400"
                      } hover:bg-indigo-100/60 py-6 !rounded-lg `}
                      variant="ghost"
                    >
                      {data.icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="bg-black text-white p-1 rounded-md">
                      {data.name}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;
