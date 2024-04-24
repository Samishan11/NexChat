import { HiOutlineDotsVertical } from "react-icons/hi";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuthData } from "@/context/auth.context";
import { getToken } from "@/service/token";
import { FaPen } from "react-icons/fa6";
import { useRef, useState } from "react";
import { capitalizeFirstLetter } from "@/utils/firstLettetCapital";
import { useUpdateProfileMutation } from "@/service/auth";
import useImageCheckHook from "@/hooks/useImageCheckHook";

interface IProp {
  title: string;
}

const Setting = ({ title }: IProp) => {
  const { authData } = useAuthData();
  const auth = getToken(authData);

  const ref = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);
  const [editable, setEditAble] = useState<boolean>(false);
  const [editable1, setEditAble1] = useState<boolean>(false);
  const [value, setValue] = useState<{
    fullname: string;
    username: string;
    bio: string;
  }>({
    fullname: "",
    username: "",
    bio: "",
  });
  //  mutation
  const updateuser = useUpdateProfileMutation();
  // hooks
  const { imageUrl } = useImageCheckHook(auth.image);
  const fd = new FormData();
  const handelImageChange = async (e: any) => {
    try {
      if (ref && ref.current) {
        ref.current.click();

        if (e.target.files[0]) {
          fd.append("image", e.target.files[0]);
          const file = e?.target?.files?.[0];
          setImage(file);
        }
        await updateuser.mutateAsync({ id: auth._id, data: fd });
      }
    } catch (error) {
      return;
    }
  };

  const handelEdit = async () => {
    if (value) {
      if (value.fullname) {
        fd.append("fullname", value.fullname);
      }
      if (value.username) {
        fd.append("username", value.username);
      }
    }
    await updateuser.mutateAsync({ id: auth._id, data: fd });
    setEditAble(!editable);
  };
  const handelEdit1 = async () => {
    if (value) {
      if (value.bio) {
        fd.append("bio", value.bio);
      }
    }
    await updateuser.mutateAsync({ id: auth._id, data: fd });
    setEditAble1(!editable1);
  };

  const formatedData = Object.entries(auth)
    .filter(
      ([key]) =>
        key === "username" ||
        key === "fullname" ||
        key === "email" ||
        key === "bio"
    )
    .map(([key, value]) => ({ [key]: value }));

  return (
    <div className="w-full h-auto sm:h-auto dark:text-neutral-200">
      <div className="px-[26px]">
        <div className="mt-[21px] flex items-center justify-between">
          <h1 className=" text-[21px] font-semibold">{title}</h1>
          <HiOutlineDotsVertical
            color=""
            className="mt-1 text-neutral-500"
            size={"18px"}
          />
        </div>
        <div className="flex mt-2 flex-col items-center mb-6">
          <div className="relative">
            <div
              onClick={(e) => handelImageChange(e)}
              className="absolute rounded-full text-neutral-500 bg-neutral-200 dark:bg-neutral-800 p-2 bottom-8 -right-4"
            >
              <FaPen size={16} />
              <input
                onChange={handelImageChange}
                ref={ref}
                id="image"
                type="file"
                className="hidden"
              />
            </div>
            {
              <img
                className="w-20 h-20 border object-cover my-6 rounded-full"
                src={image ? URL.createObjectURL(image) : imageUrl}
                alt=""
              />
            }
          </div>
          <span className="font-medium">{auth.fullname}</span>
        </div>
      </div>
      <hr />
      <div className="py-6 max-h-[calc(100vh-100px)] overflow-scroll px-[26px]">
        <Accordion type="single" collapsible className="w-full mt-4">
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-normal">
              Basic Info
            </AccordionTrigger>
            <AccordionContent className="pt-6 relative">
              {formatedData.map((val, ind) => (
                <div className="mb-1" key={ind}>
                  {Object.entries(val).map(
                    ([key, value]: [key: any, value: any], index) =>
                      key !== "bio" && (
                        <div key={index} className="mb-6">
                          <p className="text-sm mb-1">
                            {capitalizeFirstLetter(key)}
                          </p>
                          {editable &&
                          (key.toLowerCase() === "fullname" ||
                            key.toLowerCase() === "username") ? (
                            <input
                              name={key}
                              placeholder={value}
                              onChange={(e) =>
                                setValue((prevValue) => ({
                                  ...prevValue,
                                  [e.target.name]: e.target.value,
                                }))
                              }
                              className="rounded-[4px] py-2 px-2 focus:outline-none"
                            />
                          ) : (
                            <p className="font-normal">{value}</p>
                          )}
                        </div>
                      )
                  )}
                </div>
              ))}
              <button
                onClick={editable ? handelEdit : () => setEditAble(!editable)}
                className="absolute flex items-center dark:text-neutral-800 gap-2 top-6 right-4 bg-neutral-50 px-2 py-1 rounded-[4px]"
              >
                <FaPen className="text-indigo-500" size={12} />
                {editable ? "Save" : "Edit"}
              </button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="font-normal">About</AccordionTrigger>
            <AccordionContent className="relative pt-6">
              {formatedData.map((val, ind) => (
                <div className="mb-1" key={ind}>
                  {Object.entries(val).map(
                    ([key, value]: [key: any, value: any], index) =>
                      key === "bio" && (
                        <div key={index} className="mb-6">
                          <p className="text-sm mb-1">
                            {capitalizeFirstLetter(key)}
                          </p>
                          {editable1 && key.toLowerCase() === "bio" ? (
                            <textarea
                              rows={5}
                              name={key}
                              placeholder={value}
                              onChange={(e) =>
                                setValue((prevValue) => ({
                                  ...prevValue,
                                  [e.target.name]: e.target.value,
                                }))
                              }
                              className="rounded-[4px] py-2 w-full px-2 focus:outline-none"
                            />
                          ) : (
                            <p className="font-normal">{value}</p>
                          )}
                        </div>
                      )
                  )}
                </div>
              ))}
              <button
                onClick={
                  editable1 ? handelEdit1 : () => setEditAble1(!editable1)
                }
                className="absolute flex items-center dark:text-neutral-800 gap-2 top-0 right-1 bg-neutral-50 px-2 py-1 rounded-[4px]"
              >
                <FaPen className="text-indigo-500" size={12} />
                {editable1 ? "Save" : "Edit"}
              </button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Setting;
