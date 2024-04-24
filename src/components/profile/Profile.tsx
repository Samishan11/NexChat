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
import useImageCheckHook from "@/hooks/useImageCheckHook";
import { capitalizeFirstLetter } from "@/utils/firstLettetCapital";
interface IProp {
  title: string;
}
const Profile = ({ title }: IProp) => {
  const { authData } = useAuthData();
  const auth = getToken(authData);

  //  hooks
  const { imageUrl } = useImageCheckHook(auth.image);

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
          {
            <img
              className="w-20 h-20 border object-cover my-6 rounded-full"
              src={imageUrl}
              alt=""
            />
          }
          <span className="font-medium">{auth.fullname}</span>
          <div className="flex items-center gap-1">
            <RiRadioButtonLine size={14} className="text-green-500" />
            <span>active</span>
          </div>
        </div>
      </div>
      <hr />
      <div className="py-6 px-[26px]">
        <Accordion type="single" collapsible className="w-full mt-4">
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-normal">
              Basic Information
            </AccordionTrigger>
            <AccordionContent className="">
              <div className="mb-6">
                <p className="text-sm mb-1">
                  {capitalizeFirstLetter("Fullname")}
                </p>

                <p className="font-normal">{auth.fullname}</p>
              </div>
              <div className="mb-6">
                <p className="text-sm mb-1">
                  {capitalizeFirstLetter("username")}
                </p>

                <p className="font-normal">{auth.username}</p>
              </div>
              <div className="mb-6">
                <p className="text-sm mb-1">{capitalizeFirstLetter("Email")}</p>

                <p className="font-normal">{auth.email}</p>
              </div>
              <div className="mb-6">
                <p className="text-sm mb-1">
                  {capitalizeFirstLetter("Join Date")}
                </p>

                <p className="font-normal">
                  {new Date(auth.createdAt).toDateString()}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="font-normal">About</AccordionTrigger>
            <AccordionContent className="">{auth.bio}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Profile;
