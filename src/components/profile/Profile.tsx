import { HiOutlineDotsVertical } from "react-icons/hi";
import { RiRadioButtonLine } from "react-icons/ri";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuthData } from "@/context/auth.context";
import { getToken } from "@/service/token";
interface IProp {
  title: string;
}
const Profile = ({ title }: IProp) => {
  const { authData } = useAuthData();
  const auth = getToken(authData);
  //
  return (
    <div className="w-full h-auto sm:h-auto dark:text-neutral-200">
      <div className="px-[26px]">
        <div className="mt-[21px] flex items-center justify-between">
          <h1 className=" text-[21px] font-semibold">My {title}</h1>
          <HiOutlineDotsVertical
            color=""
            className="mt-1 text-neutral-500 dark:text-neutral-200"
            size={"18px"}
          />
        </div>
        <div className="flex mt-2 flex-col items-center mb-6">
          <img
            className="w-20 my-6 rounded-full"
            src="https://cdn.pixabay.com/photo/2022/07/24/23/46/artificial-intelligence-7342613_1280.jpg"
            alt=""
          />
          <span className="font-medium">{auth.fullname}</span>
          <div className="flex items-center gap-1">
            <RiRadioButtonLine size={14} className="text-green-500" />
            <span>active</span>
          </div>
        </div>
      </div>
      <hr />
      <div className="py-6 px-[26px]">
        <span className="text-neutral-500 dark:text-neutral-200">
          If several languages coalesce, the grammar of the resulting language
          is more simple and regular than that of the individual.
        </span>
        <Accordion type="single" collapsible className="w-full mt-4">
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-normal">About</AccordionTrigger>
            <AccordionContent className="">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla
              aspernatur illum quia vel inventore totam excepturi sunt!
              Laboriosam, ipsam aperiam.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="font-normal">About</AccordionTrigger>
            <AccordionContent className="">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla
              aspernatur illum quia vel inventore totam excepturi sunt!
              Laboriosam, ipsam aperiam.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Profile;
