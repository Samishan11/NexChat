import { ICONS } from "@/constrants/chat.constrants";
import { FaFile, FaPaperPlane } from "react-icons/fa6";
import { Button } from "../ui/button";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { MdArrowBackIos } from "react-icons/md";
import { useLayoutState } from "@/state/layout.state";
import { IoTriangle } from "react-icons/io5";

const Inbox = () => {
  return (
    <div className="dark:bg-neutral-800 bg-neutral-100 relative h-screen">
      <Header />
      <Body />
      <Footer />
    </div>
  );
};

const Header = () => {
  const { setOpen } = useLayoutState();
  return (
    <div className="border-b dark:border-neutral-700 border-neutral-200 flex justify-between gap-10 items-center h-20 px-6">
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
        <div className="">
          <p className="font-medium">Patrick Hendricks</p>
          <small className="font-thin block">5 min ago</small>
          {/* <FaDotCircle size={10} className="text-green-500" /> */}
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
    <div className="max-h-[calc(100vh-180px)] min-h-[calc(100vh-180px)] p-6 overflow-y-scroll">
      {Array.from({ length: 20 }).map((_, ind) => (
        <div key={ind}>
          <div className="flex mb-6 items-end  gap-4 relative z-50">
            <div className="flex flex-col px-4 py-2 rounded-t-[8px] rounded-bl-[8px] rounded-br-[4px] bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 max-w-[45%] relative">
              <span>
                Good morning, How are you? What about our next meeting?
              </span>
              <span className="text-neutral-400 dark:text-neutral-500 text-sm">
                10:02
              </span>
              <div className="absolute -right-3 bottom-0">
                <IoTriangle className="rotate-90 dark:text-neutral-700 text-neutral-200" />
              </div>
            </div>
            <div className="pt-2">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src="https://source.unsplash.com/random/women"
                alt=""
              />
            </div>
          </div>
          <div className="flex flex-row-reverse mb-6 items-end gap-4 relative z-50">
            <div
              style={{ borderRadius: "8px" }}
              className="flex flex-col px-4 py-2 rounded-t-[8px] rounded-bl-[4px] rounded-br-[8px] bg-indigo-500 text-white max-w-[45%] relative"
            >
              <span>Good morning, </span>
              <span className="text-neutral-300 text-sm">10:02</span>
              <div className="absolute -left-2.5 bottom-0">
                <IoTriangle className="-rotate-90 text-indigo-500" />
              </div>
            </div>
            <div className="pt-2">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src="https://source.unsplash.com/random/men"
                alt=""
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Footer = () => {
  return (
    <div className="h-24 w-full flex gap-6 items-center border-t dark:border-neutral-700 border-neutral-200 px-6 absolute bottom-0 right-0">
      <input
        type="text"
        className="w-full h-12 text-base dark:text-neutral-200 text-neutral-700 bg-transparent border-b dark:border-neutral-600 border-neutral-300 outline-none focus:border-indigo-600 focus:border-b-2 placeholder:text-neutral-600"
        placeholder="Type a message..."
      />
      <HiOutlineEmojiHappy className="text-neutral-500 text-2xl cursor-pointer" />
      <FaFile className="text-neutral-500 text-base cursor-pointer" />
      <Button className="text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-[6px]">
        <FaPaperPlane />
      </Button>
    </div>
  );
};
export default Inbox;
