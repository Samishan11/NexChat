import { FaFile, FaPaperPlane } from "react-icons/fa6";
import { Button } from "../ui/button";
import { MdArrowBackIos } from "react-icons/md";
import { useLayoutState } from "@/state/layout.state";
import { IoTriangle } from "react-icons/io5";
import { Socket } from "socket.io-client";
import { getToken } from "@/service/token";
import { useEffect, useState, forwardRef, useRef, useCallback } from "react";
import { useListChat } from "@/service/chat";
import { checkUser } from "@/utils/checkUser";
import InputEmoji from "react-input-emoji";
import moment from "moment";
import { Friend, User } from "../contact/Contact";
import message from "@/assets/mp3/message.mp3";
import typing from "@/assets/mp3/typing.mp3";
import { IGroup } from "../adduser/AddUser";
import { BsDownload, BsXCircleFill } from "react-icons/bs";
import { useScrollToBottom } from "@/hooks/useScrollToBottom";
import { LoadingSkeleton } from "../skeleton/Skeleton";
import { baseURL } from "@/service/service.axios";
import { ICONS } from "@/constrants/chat.constrants";
import Detail from "./Detail";
import { handleDownload } from "@/utils/imageDownloader";
import useImageCheckHook from "@/hooks/useImageCheckHook";

interface IProp {
  socket: Socket | null;
}

export type TMessage = {
  _id: string;
  messageBy: User;
  messageTo: User;
  message: string;
  image: File;
  createdAt: string;
  isGroup: boolean;
  group: User[];
};

const Inbox = ({ socket }: IProp) => {
  const auth: any = getToken();
  const { data } = useLayoutState();

  // hook
  const ref = useRef<HTMLDivElement>(null);

  //  states
  const [messages, setMessages] = useState<any[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [openDetail, setOpenDetail] = useState<boolean>(false);

  //  react query chat data
  const { data: chat, isLoading: isLoadingChat } = useListChat(data?.roomId);

  useEffect(() => {
    if (!isLoadingChat) {
      setMessages(chat);
    }
  }, [isLoadingChat, chat]);

  useEffect(() => {
    if (socket && data) {
      socket.emit("join_room", data.roomId);
      return () => {
        socket.off("join_room");
      };
    }
  }, [socket, data]);

  useEffect(() => {
    if (socket) {
      socket.on("message", (data: TMessage) => {
        if (auth._id !== data.messageBy._id) {
          const audio = new Audio(message);
          audio.play();
        }
        setMessages((prev: any[]) => [...prev, data]);
      });
      return () => {
        socket.off("message");
      };
    }
  }, [socket, auth._id]);

  useEffect(() => {
    if (socket) {
      socket.on(
        "userTyping",
        ({ userId: typingUserId, isTyping, userName }) => {
          if (auth._id !== typingUserId) {
            setIsTyping(isTyping);
            setTypingUser(userName);
          }
        }
      );
      return () => {
        socket.off("userTyping");
      };
    }
  }, [socket, auth._id]);

  const sendMessage = useCallback(
    (message: string) => {
      if (!data) return;
      const chatData = {
        message: message.trim().replace(/&lt;\/br&gt;/g, ""),
        image: image ?? "",
        messageBy: auth?._id,
        ...(data.groupName
          ? { isGroup: true }
          : { messageTo: checkUser<Friend>(auth?._id, data as Friend)?._id }),
        roomId: data?.roomId,
      };

      socket?.emit("chat", {
        data: chatData,
      });

      setImage(null);
    },
    [auth._id, data, socket, image]
  );

  const handleImageChange = useCallback((file: File) => {
    setImage(file);
  }, []);

  const handleOnChange = useCallback(() => {
    if (socket && data) {
      socket.emit("typing", { roomId: data.roomId, userId: auth?._id });
    }
  }, [socket, data, auth]);

  const handleStopTyping = useCallback(() => {
    if (socket) {
      socket.emit("stopTyping", { roomId: data?.roomId, userId: auth?._id });
    }
  }, [socket, data, auth]);

  useEffect(() => {
    const audio = new Audio(typing);
    if (isTyping) {
      setTimeout(() => {
        audio.play();
      }, 3000);
    } else {
      audio.pause();
    }
  }, [isTyping]);

  const handelOpenDetail = useCallback(() => {
    setOpenDetail(!openDetail);
  }, [openDetail]);
  if (isLoadingChat) {
    return Array.from({ length: 20 }).map((_, ind) => (
      <div key={ind + 1} className="flex justify-between">
        <div className="pt-4 px-2">
          <LoadingSkeleton count={1} />
        </div>
        <div className="pt-4 mt-12 px-2">
          <LoadingSkeleton count={1} />
        </div>
      </div>
    ));
  }

  return (
    <div
      className={`grid  ${
        openDetail ? "grid-cols-1 sm:grid-cols-[60fr_40fr]" : "grid-cols-1"
      }`}
    >
      <div
        className={`dark:bg-neutral-800 bg-neutral-100 relative h-screen ${
          openDetail && "hidden sm:block"
        }`}
      >
        <Header
          handelOpenDetail={handelOpenDetail}
          auth={auth}
          data={data as Friend}
        />
        <Body data={data as Friend} auth={auth} messages={messages} />
        <Footer
          typingUser={typingUser}
          handelImage={handleImageChange}
          handelOnChange={handleOnChange}
          handleStopTyping={handleStopTyping}
          isTyping={isTyping}
          handelSubmit={sendMessage as any}
          ref={ref}
        />
      </div>
      {openDetail && (
        <Detail
          handelClick={handelOpenDetail}
          bio={
            !data?.groupName
              ? checkUser(auth._id, data as any)?.bio
              : "If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual."
          }
          name={
            data?.groupName
              ? data?.groupName
              : checkUser(auth._id, data as any)?.fullname
          }
          image={
            data?.groupName
              ? "https://github.com/shadcn.png"
              : checkUser(auth._id, data as any)?.image
          }
          files={chat}
        />
      )}
    </div>
  );
};

const Header = ({
  handelOpenDetail,
  data,
  auth,
}: {
  handelOpenDetail: () => void;
  data: Friend | IGroup;
  auth: any;
}) => {
  const { setOpen } = useLayoutState();

  const { imageUrl } = useImageCheckHook(
    checkUser(auth._id, data as Friend)?.image
  );

  return (
    <div className="border-b dark:border-neutral-700 border-neutral-200 flex justify-between gap-10 items-center h-20 px-6">
      <div className="flex gap-4 items-center justify-center">
        <MdArrowBackIos
          onClick={() => setOpen(false)}
          className="md:hidden block"
        />
        <img className="w-10 rounded-full" src={imageUrl} alt="" />
        <div className="">
          <p className="font-medium">
            {data.groupName
              ? data.groupName
              : checkUser(auth._id, data as Friend).fullname}
          </p>
          {/* <small className="font-thin block">5 min ago</small> */}
          {/* <FaDotCircle size={10} className="text-green-500" /> */}
        </div>
      </div>
      <div className="flex gap-6 items-start">
        {ICONS.map((item, ind) => (
          <div
            key={ind}
            onClick={item.name === "user" ? handelOpenDetail : undefined}
          >
            {item.icon}
          </div>
        ))}
      </div>
    </div>
  );
};
const Body = ({
  auth,
  messages,
  data,
}: {
  auth: any;
  messages: TMessage[];
  data: any;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useScrollToBottom({ ref, messages });

  //

  return (
    <div className="max-h-[calc(100vh-180px)] min-h-[calc(100vh-180px)] p-6 overflow-y-scroll">
      {messages.map((chat) => (
        <div key={chat._id}>
          <div
            className={`${
              auth._id !== chat.messageBy._id
                ? "flex mb-6 items-end gap-3 relative z-50"
                : "flex flex-row-reverse mb-6 items-end gap-3 relative z-50"
            }`}
          >
            <div className="pt-2">
              {chat.isGroup && (
                <p className="w-[40px] h-[40px] rounded-full font-medium dark:bg-neutral-700 bg-neutral-200 text-indigo-500 grid place-content-center">
                  {chat.messageBy.username.slice(0, 1).toLocaleUpperCase()}
                </p>
              )}

              {!data.groupName && (
                <p className="w-[40px] h-[40px] rounded-full font-medium dark:bg-neutral-700 bg-neutral-200 text-indigo-500 grid place-content-center">
                  {chat.messageBy.username.slice(0, 1).toLocaleUpperCase()}
                </p>
              )}
            </div>
            <div
              className={
                auth._id !== chat.messageBy._id
                  ? "flex flex-col px-4 py-2 rounded-t-[8px] rounded-bl-[8px] rounded-br-[4px] bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 max-w-[65%] md:max-w-[45%] relative"
                  : "flex flex-col px-4 py-2 rounded-t-[8px] rounded-bl-[4px] rounded-br-[8px] bg-indigo-500 text-white max-w-[65%] md:max-w-[45%] relative"
              }
            >
              {chat?.image && (
                <div
                  className={`${
                    auth._id !== chat.messageBy._id
                      ? "flex items-end  relative z-50"
                      : "flex flex-row-reverse items-end relative z-50"
                  } mb-2 relative`}
                >
                  <img
                    className="w-[250px] rounded-[8px] "
                    src={
                      chat?.image?.name
                        ? URL.createObjectURL(chat?.image)
                        : `${baseURL}/uploaded_images/${chat?.image}`
                    }
                    alt="image"
                  />
                  <BsDownload
                    onClick={() =>
                      handleDownload({
                        imageUrl: `${baseURL}/uploaded_images/${chat?.image}`,
                        fileName: "image",
                      })
                    }
                    className="absolute text-white top-2 right-2"
                    size={20}
                  />
                </div>
              )}
              <span
                dangerouslySetInnerHTML={{
                  __html: chat.message,
                }}
              />
              <span
                className={`${
                  auth._id !== chat.messageBy._id
                    ? "text-neutral-400 text-left dark:text-neutral-500"
                    : "text-neutral-200 text-right"
                } text-xs`}
              >
                {moment(chat.createdAt).format("hh:mm")}
              </span>
              <div
                className={`absolute -bottom-2 ${
                  auth._id !== chat.messageBy._id ? "left-0" : "right-0"
                }`}
              >
                <IoTriangle
                  className={`${
                    auth._id !== chat.messageBy._id
                      ? "rotate-180 dark:text-neutral-700 text-neutral-200"
                      : "-rotate-180 text-indigo-500"
                  } `}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      <div ref={ref}></div>
    </div>
  );
};

const Footer = forwardRef(
  (
    {
      handelSubmit,
      handelImage,
      isTyping,
      typingUser,
      handelOnChange,
      handleStopTyping,
    }: IPropFooter,
    ref
  ) => {
    const [text, setText] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);

    const imageRef = useRef<HTMLInputElement>(null);

    function handleOnEnter(text: string) {
      handelSubmit(text);
    }

    const handleImageChange = (event: any) => {
      const selectedImage = event.target.files[0];
      setImage(selectedImage);
      handelImage(selectedImage);
    };

    return (
      <div className="h-24 [&_.react-emoji-picker--wrapper]:!z-50 [&_.react-input-emoji--container]:border-0 w-full dark:[&_.react-input-emoji--input]:!text-neutral-200 flex gap-6 items-center border-t dark:border-neutral-700 border-neutral-200 px-6 absolute bottom-0 right-0">
        <div className="flex [&_.react-input-emoji--button]:!fill-indigo-400 justify-around relative  w-full rounded-xl focus:outline-none">
          {image && (
            <>
              <img
                className="h-20 object-cover w-20 y-2"
                src={URL.createObjectURL(image)}
                alt=""
              />
              <BsXCircleFill
                onClick={() => setImage(null)}
                className="absolute top-1 text-white left-1 text-md"
              />
            </>
          )}
          <InputEmoji
            ref={ref}
            value={text}
            inputClass="w-full  h-12 text-base dark:text-neutral-200 text-neutral-700 bg-transparent border-b dark:border-neutral-600 border-neutral-300 outline-none focus:border-indigo-600 focus:border-b-2 placeholder:text-neutral-600"
            borderRadius={0}
            background="none"
            borderColor="none"
            shouldConvertEmojiToImage
            shouldReturn
            onChange={setText}
            onFocus={handelOnChange}
            onBlur={handleStopTyping}
            onEnter={handleOnEnter}
            cleanOnEnter
            placeholder={
              isTyping
                ? `${typingUser && typingUser} is typing......`
                : "Type a message"
            }
          />
        </div>

        <FaFile
          onClick={() => imageRef?.current?.click()}
          className="text-indigo-500 text-base cursor-pointer"
        />

        <input
          onChange={handleImageChange}
          ref={imageRef}
          id="image"
          type="file"
          accept="image/png, image/jpeg"
          className="hidden"
        />
        <Button
          onClick={() => {
            handelSubmit(text);
            setText("");
            setImage(null);
          }}
          className="text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-[6px]"
        >
          <FaPaperPlane />
        </Button>
      </div>
    );
  }
);

interface IPropFooter {
  handelSubmit: (data: any) => void;
  isTyping: boolean;
  handelOnChange: () => void;
  handleStopTyping: () => void;
  typingUser: string | null;
  handelImage: (data: any) => void;
}

export default Inbox;
