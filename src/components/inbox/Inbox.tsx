import { ICONS } from "@/constrants/chat.constrants";
import { FaDotCircle } from "react-icons/fa";
import { Input } from "../ui/input";
import { FaEnvelope, FaFile } from "react-icons/fa6";
import { Button } from "../ui/button";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { MdArrowBackIos } from "react-icons/md";
import { useLayoutState } from "@/state/layout.state";

const Inbox = () => {
  return (
    <div className="dark:bg-[#262e35] bg-white">
      <Header />
      <Body />
      <Footer />
    </div>
  );
};

const Header = () => {
  const { setOpen } = useLayoutState();
  return (
    <div className="border-b-[0.2px] flex justify-between gap-10 items-center h-20 px-6">
      <div className="flex gap-4 items-center justify-center">
        <MdArrowBackIos
          onClick={() => setOpen(false)}
          className="md:hidden block"
        />
        <img
          className="w-10 rounded-full"
          src="https://github.com/shadcn.png"
          alt=""
        />
        <div className="flex items-center gap-1">
          <span className="font-medium">Patrick Hendricks</span>
          <FaDotCircle size={10} className="text-green-500" />
        </div>
      </div>
      <div className="hidden md:flex gap-6 items-start">
        {ICONS.map((item) => item.icon)}
      </div>
    </div>
  );
};
const Body = () => {
  return (
    <div className="max-h-[calc(100vh-180px)] p-6 overflow-y-scroll ">
      <div className="flex mb-6 items-end  gap-4 relative z-50">
        <div
          style={{ borderRadius: "8px" }}
          className="flex flex-col px-4 py-2 bg-neutral-300/40 max-w-[45%]"
        >
          <span>Good morning, How are you? What about our next meeting?</span>
          <span>10:02</span>
        </div>
        <div className="pt-2">
          <img
            className="w-10 rounded-full"
            src="https://github.com/shadcn.png"
            alt=""
          />
        </div>
      </div>
      <div className="flex flex-row-reverse mb-6 items-end gap-4 relative z-50">
        <div
          style={{ borderRadius: "8px" }}
          className="flex flex-col px-4 py-2 bg-indigo-500 text-white max-w-[45%]"
        >
          <span>Good morning, </span>
          <span>10:02</span>
        </div>
        <div className="pt-2">
          <img
            className="w-10 rounded-full"
            src="https://github.com/shadcn.png"
            alt=""
          />
        </div>
      </div>
      <div className="flex mb-6 items-end gap-4 relative z-50">
        <div
          style={{ borderRadius: "8px" }}
          className="flex flex-col px-4 py-2 bg-neutral-300/40 max-w-[45%]"
        >
          <span>Good morning, How are you? What about our next meeting?</span>
          <span>10:02</span>
        </div>
        <div className="pt-2">
          <img
            className="w-10 rounded-full"
            src="https://github.com/shadcn.png"
            alt=""
          />
        </div>
      </div>
      <div className="flex flex-row-reverse mb-6 items-end gap-4 relative z-50">
        <div
          style={{ borderRadius: "8px" }}
          className="flex flex-col px-4 py-2 bg-indigo-500 text-white max-w-[45%]"
        >
          <span>Good morning, </span>
          <span>10:02</span>
        </div>
        <div className="pt-2">
          <img
            className="w-10 rounded-full"
            src="https://github.com/shadcn.png"
            alt=""
          />
        </div>
      </div>
      <div className="flex mb-6 items-end gap-4 relative z-50">
        <div
          style={{ borderRadius: "8px" }}
          className="flex flex-col px-4 py-2 bg-neutral-300/40 max-w-[45%]"
        >
          <span>Good morning, How are you? What about our next meeting?</span>
          <span>10:02</span>
        </div>
        <div className="pt-2">
          <img
            className="w-10 rounded-full"
            src="https://github.com/shadcn.png"
            alt=""
          />
        </div>
      </div>
      <div className="flex flex-row-reverse mb-6 items-end gap-4 relative z-50">
        <div
          style={{ borderRadius: "8px" }}
          className="flex flex-col px-4 py-2 bg-indigo-500 text-white max-w-[45%]"
        >
          <span>Good morning, </span>
          <span>10:02</span>
        </div>
        <div className="pt-2">
          <img
            className="w-10 rounded-full"
            src="https://github.com/shadcn.png"
            alt=""
          />
        </div>
      </div>
      <div className="flex mb-6 items-end gap-4 relative z-50">
        <div
          style={{ borderRadius: "8px" }}
          className="flex flex-col px-4 py-2 bg-neutral-300/40 max-w-[45%]"
        >
          <span>Good morning, How are you? What about our next meeting?</span>
          <span>10:02</span>
        </div>
        <div className="pt-2">
          <img
            className="w-10 rounded-full"
            src="https://github.com/shadcn.png"
            alt=""
          />
        </div>
      </div>
      <div className="flex flex-row-reverse mb-6 items-end gap-4 relative z-50">
        <div
          style={{ borderRadius: "8px" }}
          className="flex flex-col px-4 py-2 bg-indigo-500 text-white max-w-[45%]"
        >
          <span>Good morning, </span>
          <span>10:02</span>
        </div>
        <div className="pt-2">
          <img
            className="w-10 rounded-full"
            src="https://github.com/shadcn.png"
            alt=""
          />
        </div>
      </div>
      <div className="flex mb-6 items-end gap-4 relative z-50">
        <div
          style={{ borderRadius: "8px" }}
          className="flex flex-col px-4 py-2 bg-neutral-300/40 max-w-[45%]"
        >
          <span>Good morning, How are you? What about our next meeting?</span>
          <span>10:02</span>
        </div>
        <div className="pt-2">
          <img
            className="w-10 rounded-full"
            src="https://github.com/shadcn.png"
            alt=""
          />
        </div>
      </div>
      <div className="flex flex-row-reverse mb-6 items-end gap-4 relative z-50">
        <div
          style={{ borderRadius: "8px" }}
          className="flex flex-col px-4 py-2 bg-indigo-500 text-white max-w-[45%]"
        >
          <span>Good morning, </span>
          <span>10:02</span>
        </div>
        <div className="pt-2">
          <img
            className="w-10 rounded-full"
            src="https://github.com/shadcn.png"
            alt=""
          />
        </div>
      </div>
      <div className="flex mb-6 items-end gap-4 relative z-50">
        <div
          style={{ borderRadius: "8px" }}
          className="flex flex-col px-4 py-2 bg-neutral-300/40 max-w-[45%]"
        >
          <span>Good morning, How are you? What about our next meeting?</span>
          <span>10:02</span>
        </div>
        <div className="pt-2">
          <img
            className="w-10 rounded-full"
            src="https://github.com/shadcn.png"
            alt=""
          />
        </div>
      </div>
      <div className="flex flex-row-reverse mb-6 items-end gap-4 relative z-50">
        <div
          style={{ borderRadius: "8px" }}
          className="flex flex-col px-4 py-2 bg-indigo-500 text-white max-w-[45%]"
        >
          <span>Good morning, </span>
          <span>10:02</span>
        </div>
        <div className="pt-2">
          <img
            className="w-10 rounded-full"
            src="https://github.com/shadcn.png"
            alt=""
          />
        </div>
      </div>
      <div className="flex mb-6 items-end gap-4 relative z-50">
        <div
          style={{ borderRadius: "8px" }}
          className="flex flex-col px-4 py-2 bg-neutral-300/40 max-w-[45%]"
        >
          <span>Good morning, How are you? What about our next meeting?</span>
          <span>10:02</span>
        </div>
        <div className="pt-2">
          <img
            className="w-10 rounded-full"
            src="https://github.com/shadcn.png"
            alt=""
          />
        </div>
      </div>
      <div className="flex flex-row-reverse mb-6 items-end gap-4 relative z-50">
        <div
          style={{ borderRadius: "8px" }}
          className="flex flex-col px-4 py-2 bg-indigo-500 text-white max-w-[45%]"
        >
          <span>Good morning, </span>
          <span>10:02</span>
        </div>
        <div className="pt-2">
          <img
            className="w-10 rounded-full"
            src="https://github.com/shadcn.png"
            alt=""
          />
        </div>
      </div>
      <div className="flex mb-6 items-end gap-4 relative z-50">
        <div
          style={{ borderRadius: "8px" }}
          className="flex flex-col px-4 py-2 bg-neutral-300/40 max-w-[45%]"
        >
          <span>Good morning, How are you? What about our next meeting?</span>
          <span>10:02</span>
        </div>
        <div className="pt-2">
          <img
            className="w-10 rounded-full"
            src="https://github.com/shadcn.png"
            alt=""
          />
        </div>
      </div>
      <div className="flex flex-row-reverse mb-6 items-end gap-4 relative z-50">
        <div
          style={{ borderRadius: "8px" }}
          className="flex flex-col px-4 py-2 bg-indigo-500 text-white max-w-[45%]"
        >
          <span>Good morning, </span>
          <span>10:02</span>
        </div>
        <div className="pt-2">
          <img
            className="w-10 rounded-full"
            src="https://github.com/shadcn.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
const Footer = () => {
  return (
    <div className="h-24 flex gap-6 items-center border-t-[0.2px] px-6 ">
      <Input className="bg-indigo-100/60 rounded-lg" />
      <HiOutlineEmojiHappy size={20} className="text-indigo-500" />
      <FaFile className="text-indigo-500" />
      <Button
        variant={"ghost"}
        className="bg-indigo-500 text-white"
        style={{ borderRadius: "8px" }}
      >
        <FaEnvelope />
      </Button>
    </div>
  );
};
export default Inbox;
