import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { RiRadioButtonLine } from "react-icons/ri";
import { useLayoutState } from "@/state/layout.state";

interface IProp {
  title: string;
}
const ChatList = ({ title }: IProp) => {
  return (
    <div className="max-h-screen dark:text-neutral-100 overflow-hidden dark:bg-neutral-900 bg-neutral-200 border-r-2 dark:border-neutral-950 border-neutral-300 shadow">
      <div className="px-[26px]">
        <div className="mt-[21px] flex flex-col gap-4 items-start justify-between">
          <h1 className="text-[21px] font-semibold">{title}</h1>
          <Input
            className="h-11"
            icon={<FiSearch size={22} className="text-neutral-200" />}
            placeholder="Search"
          />
        </div>
        <div className="mt-5 max-w-[400px] [&_.swiper-wrapper]:!w-[100px]">
          <Swiper spaceBetween={20} slidesPerView={4}>
            {Array.from({ length: 20 }).map((_, ind) => {
              return (
                <SwiperSlide key={ind}>
                  <span className="invisible">sami</span>
                  <UserAvatar />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
      <div className="px-4 mt-6 ">
        <p className="font-medium mb-4">Recent</p>
        <div className="max-h-screen chat_list pb-[275px] overflow-y-scroll">
          {Array.from({ length: 10 }).map((_, ind) => (
            <UserList ind={ind} key={ind} />
          ))}
        </div>
      </div>
    </div>
  );
};

const UserAvatar = () => {
  return (
    <div
      style={{ borderRadius: "8px" }}
      className=" dark:bg-neutral-700 bg-neutral-200 cursor-pointer rounded-md w-[68px] h-[51.6px] flex justify-center items-center relative"
    >
      <img
        src="https://cdn.pixabay.com/photo/2022/07/24/23/46/artificial-intelligence-7342613_1280.jpg"
        className="w-[35.2px] h-[35.2px] rounded-full absolute -top-5"
        alt=""
      />
      <RiRadioButtonLine
        className="absolute top-[2px] left-10 text-green-500"
        size={12}
      />
      <span className="font-medium text-[13px] mt-2">Patrick</span>
    </div>
  );
};

const UserList = ({ ind }: { ind: number }) => {
  const { setOpen } = useLayoutState();

  return (
    <div
      onClick={() => setOpen(true)}
      style={{ borderRadius: "6px" }}
      className={`hover:dark:bg-neutral-800 hover:bg-neutral-300 mb-1 h-16 flex px-4 pt-2 items-start justify-between cursor-pointer ${
        ind === 0 && "dark:bg-neutral-800 bg-neutral-300"
      }`}
    >
      <div className="flex justify-between items-center gap-4">
        <img
          src="https://source.unsplash.com/random?men"
          className="w-[35px] h-[35px] !z-50 rounded-full -top-5 object-cover"
          alt=""
        />
        <div>
          <p className="font-medium text-[15px] dark:text-neutral-100 text-neutral-800">
            Patrick Hendrick
          </p>
          <span className="text-neutral-400 dark:text-neutral-500 text-sm">
            Hey I am available
          </span>
        </div>
      </div>
      <div className="flex flex-col text-[11px]">
        <span className="text-neutral-500 dark:text-neutral-400">05 min</span>
        <span
          style={{ borderRadius: "20px" }}
          className="bg-indigo-200 mt-1 max-w-6 text-neutral-600 w-auto flex items-center justify-center px-2"
        >
          02
        </span>
      </div>
    </div>
  );
};

export default ChatList;
