import { ICONS } from "@/constrants/chat.constrants";
import { FaFile, FaPaperPlane } from "react-icons/fa6";
import { Button } from "../ui/button";
import { MdArrowBackIos } from "react-icons/md";
import { useLayoutState } from "@/state/layout.state";
import { IoTriangle } from "react-icons/io5";
import { Socket } from "socket.io-client";
import { getToken } from "@/service/token";
import { useEffect, useState, forwardRef, useRef } from "react";
import { useListChat } from "@/service/chat";
import { checkUser } from "@/utils/checkUser";
import InputEmoji from "react-input-emoji";
import moment from "moment";
import { Friend } from "../contact/Contact";
import message from "@/assets/mp3/message.mp3";
import typing from "@/assets/mp3/typing.mp3";
import { IGroup } from "../adduser/AddUser";
import { BsXCircleFill } from "react-icons/bs";

import { useScrollToBottom } from "@/hooks/useScrollToBottom";
import { LoadingSkeleton } from "../skeleton/Skeleton";
interface IProp {
  socket: Socket | null;
}

type TMessage = {
  _id: string;
  messageBy: string;
  messageTo: string;
  message: string;
  image: File;
  createdAt: string;
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

  //  react query
  const { data: chat, isLoading: isLoadingChat } = useListChat(data?.roomId);

  // set chat list
  useEffect(() => {
    if (isLoadingChat) return;
    setMessages(chat);
  }, [isLoadingChat, chat]);

  // event join room
  useEffect(() => {
    if (socket && data) {
      socket.emit("join_room", data.roomId);
      return () => {
        socket.off("join_room");
      };
    }
  }, [socket, data]);

  useEffect(() => {
    if (!socket) return;
    socket.on("message", (data: any) => {
      const audio = new Audio(message);
      audio.play();
      setMessages((prev: any[]) => [...prev, data]);
    });
    return () => {
      socket.off("message");
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("userTyping", ({ userId: typingUserId, isTyping }) => {
        if (auth._id !== typingUserId) {
          setIsTyping(isTyping);
        }
      });
      return () => {
        socket.off("userTyping");
      };
    }
  }, [socket, auth._id]);

  // send message
  const sendMessage = (message: string) => {
    if (!data) return;
    const chat = message;
    const chatData = {
      message: chat,
      image: image ?? "",
      messageBy: auth?._id,
      ...(!data.groupName && {
        messageTo: checkUser(auth._id, data as Friend)._id,
      }),
      ...(data.groupName && {
        group: data?.users.filter((val: string) => val !== auth?._id),
      }),
      ...(data.groupName && { isGroup: true }),
      roomId: data?.roomId,
    };

    console.log(chatData);

    socket?.emit("chat", {
      data: chatData,
    });

    setImage(null);
    setMessages((prev) => [...prev, chatData]);
  };

  const handleImageChange = (file: any) => {
    if (file) {
      setImage(file);
    }
  };

  const handleOnChange = () => {
    if (socket && data) {
      socket.emit("typing", { roomId: data.roomId, userId: auth?._id });
    }
  };

  const handleStopTyping = () => {
    if (socket) {
      socket.emit("stopTyping", { roomId: data?.roomId, userId: auth?._id });
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("userTyping", ({ userId: typingUserId, isTyping }) => {
        if (auth._id !== typingUserId) {
          setIsTyping(isTyping);
        }
      });
      return () => {
        socket.off("userTyping");
      };
    }
  }, [socket, auth]);

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
    <div className="dark:bg-neutral-800 bg-neutral-100 relative h-screen">
      <Header auth={auth} data={data as Friend} />
      <Body auth={auth} messages={messages} />
      <Footer
        handelImage={handleImageChange}
        handelOnChange={handleOnChange}
        handleStopTyping={handleStopTyping}
        isTyping={isTyping}
        handelSubmit={sendMessage as any}
        ref={ref}
      />
    </div>
  );
};

const Header = ({ data, auth }: { data: Friend | IGroup; auth: any }) => {
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
          <p className="font-medium">
            {data.groupName
              ? data.groupName
              : checkUser(auth._id, data as Friend).fullname}
          </p>
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
const Body = ({ auth, messages }: { auth: any; messages: TMessage[] }) => {
  const ref = useRef<HTMLDivElement>(null);

  useScrollToBottom({ ref, messages });

  return (
    <div className="max-h-[calc(100vh-180px)] min-h-[calc(100vh-180px)] p-6 overflow-y-scroll">
      {messages.map((data) => (
        <div key={data._id}>
          <div
            className={
              auth._id !== data.messageBy
                ? "flex mb-6 items-end  gap-4 relative z-50"
                : "flex flex-row-reverse mb-6 items-end gap-4 relative z-50"
            }
          >
            <div
              className={
                auth._id !== data.messageBy
                  ? "flex flex-col px-4 py-2 rounded-t-[8px] rounded-bl-[8px] rounded-br-[4px] bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 max-w-[65%] md:max-w-[45%] relative"
                  : "flex flex-col px-4 py-2 rounded-t-[8px] rounded-bl-[4px] rounded-br-[8px] bg-indigo-500 text-white max-w-[65%] md:max-w-[45%] relative"
              }
            >
              {data?.image && (
                <img
                  className="w-[150px] "
                  src={
                    data?.image?.name
                      ? URL.createObjectURL(data?.image)
                      : `https://api-chatting-app.onrender.com/uploaded_images/${data?.image}`
                  }
                  alt="image"
                />
              )}
              <span dangerouslySetInnerHTML={{ __html: data.message }} />
              <span
                className={`${
                  auth._id !== data.messageBy
                    ? "text-neutral-400 text-left dark:text-neutral-500"
                    : "text-neutral-200 text-right"
                } text-xs`}
              >
                {moment(data.createdAt).format("hh:mm")}
              </span>
              <div
                className={`absolute bottom-0 ${
                  auth._id !== data.messageBy ? "-right-3" : "-left-2.5"
                }`}
              >
                <IoTriangle
                  className={`${
                    auth._id !== data.messageBy
                      ? "rotate-90 dark:text-neutral-700 text-neutral-200"
                      : "-rotate-90 text-indigo-500"
                  } `}
                />
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
        {image ? (
          <div className="flex justify-around relative  w-full rounded-xl focus:outline-none">
            <img
              className="h-20  w-20 y-2"
              src={URL.createObjectURL(image)}
              alt=""
            />
            <BsXCircleFill
              onClick={() => setImage(null)}
              className="absolute top-1 text-red-500/80 left-1 text-md"
            />
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
              placeholder={isTyping ? "Typing......" : "Type a message"}
            />
          </div>
        ) : (
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
            placeholder={isTyping ? "Typing......" : "Type a message"}
          />
        )}

        <FaFile
          onClick={() => imageRef?.current?.click()}
          className="text-neutral-500 text-base cursor-pointer"
        />

        <input
          onChange={handleImageChange}
          ref={imageRef}
          id="image"
          type="file"
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
  handelImage: (data: any) => void;
}

export default Inbox;
