import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { RiRadioButtonLine } from "react-icons/ri";
import { useLayoutState } from "@/state/layout.state";
import { useListFriend } from "@/service/request";
import { useAuthData } from "@/context/auth.context";
import { getToken } from "@/service/token";
import { Friend, IGroup } from "../contact/Contact";
import { useEffect, useMemo, useState } from "react";
import { checkUser } from "@/utils/checkUser";
import { LoadingSkeleton } from "@/components/skeleton/Skeleton";
import moment from "moment";
import { Socket } from "socket.io-client";
import { useGroupQuery } from "@/service/room";
import useImageCheckHook from "@/hooks/useImageCheckHook";

interface IProp {
  title: string;
  onlineUsers: any[];
  socket: Socket | null;
}

const ChatList = ({ title, onlineUsers, socket }: IProp) => {
  const { authData } = useAuthData();
  const auth = getToken(authData);
  const [groups, setGroups] = useState<IGroup[]>([]);

  //  react query
  const { data: USERS, isLoading } = useListFriend(auth?._id);
  const { data: GROUPS, isLoading: loadingGroupList } = useGroupQuery(
    auth?._id
  );

  useEffect(() => {
    if (socket) {
      socket.on("list-new-group", handleNewGroup);
      return () => {
        socket.off("list-new-group", handleNewGroup);
      };
    }
  }, [socket]);

  const handleNewGroup = (data: IGroup) => {
    setGroups((prev) => [...prev, data]);
  };

  useEffect(() => {
    if (loadingGroupList) return;
    if (GROUPS && GROUPS.length > 0) {
      setGroups(GROUPS);
    }
  }, [loadingGroupList, GROUPS]);

  const formatedUsers = useMemo(() => {
    if (USERS) {
      return USERS.map((user: Friend) => {
        const onlineUser = onlineUsers.find(
          (onlineUser) => onlineUser.userId === checkUser(auth._id, user)._id
        );
        return {
          ...user,
          status: onlineUser ? onlineUser.status : "offline",
        };
      });
    }
  }, [USERS, onlineUsers, auth._id]);

  // Merge users and groups into a single array and sort by updatedAt in descending order
  const mergedData = useMemo(() => {
    const merged = [];
    if (formatedUsers) merged.push(...formatedUsers);
    if (groups) merged.push(...groups);
    return merged.sort((a, b) => {
      if (a.updatedAt && b.updatedAt) {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }
      return 0;
    });
  }, [formatedUsers, groups]);

  //  show online user only
  // const onlineUser = useMemo(() => {
  //   if ((USERS && USERS?.length > 0) || onlineUsers?.length > 0 || auth?._id) {
  //     const onlineFriends = USERS?.filter((friend: Friend) =>
  //       onlineUsers.some(
  //         (onlineUser) => onlineUser.userId === checkUser(auth._id, friend)._id
  //       )
  //     ).map((friend: Friend) => {
  //       const onlineUser = onlineUsers.find(
  //         (onlineUser) => onlineUser.userId === checkUser(auth._id, friend)._id
  //       );
  //       return {
  //         ...friend,
  //         status: onlineUser ? onlineUser.status : "offline",
  //       };
  //     });
  //     return onlineFriends;
  //   }
  //   return [];
  // }, [USERS, onlineUsers, auth._id]);

  const onlineUser = useMemo(() => {
    if (
      (formatedUsers && formatedUsers?.length > 0) ||
      onlineUsers?.length > 0 ||
      auth?._id
    ) {
      const onlineFriends = formatedUsers?.filter((friend: any) =>
        onlineUsers.some((a) => a.userId === checkUser(auth._id, friend)._id)
      );
      return onlineFriends;
    }
    return;
  }, [formatedUsers, onlineUsers, auth._id]);

  if (isLoading)
    return (
      <div className="pt-4 px-2">
        <LoadingSkeleton />
      </div>
    );

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
            {!isLoading &&
              onlineUser &&
              onlineUser.length > 0 &&
              onlineUser.map((user: Friend) => {
                return (
                  <SwiperSlide key={user._id}>
                    <span className="invisible">{user._id}</span>
                    <UserAvatar auth={auth} user={user} />
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
      </div>
      <div className="px-4 mt-6 ">
        <p className="font-medium mb-4">Recent</p>
        <div className="h-[calc(100vh-200px)] chat_list overflow-y-scroll">
          {!isLoading && !mergedData.length && (
            <p className="text-neutral-400">No Chat</p>
          )}
          {!isLoading &&
            mergedData &&
            mergedData.length > 0 &&
            mergedData.map((item: any, ind: number) => (
              <ListItem
                auth={auth}
                ind={ind}
                data={item}
                key={item._id + ind}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

const UserAvatar = ({ auth, user }: { auth: any; user: Friend }) => {
  const { setOpen, setData } = useLayoutState();

  const handelClick = (data: typeof user) => {
    setOpen(true);
    setData(data);
  };

  const { imageUrl } = useImageCheckHook(checkUser(auth._id, user)?.image);

  return (
    <div
      onClick={handelClick.bind(null, user)}
      style={{ borderRadius: "8px" }}
      className=" dark:bg-neutral-700 bg-neutral-300 cursor-pointer rounded-md w-[68px] h-[51.6px] flex justify-center items-center relative"
    >
      {/* {!user.image && (
        <p className="w-[35px]  font-medium absolute -top-5 dark:text-neutral-200 text-neutral-800 bg-neutral-300 dark:bg-neutral-700 grid place-items-center	h-[35px] rounded-full object-cover">
          {checkUser(auth._id, user).username.charAt(0).toUpperCase()}
        </p>
      )} */}
      <img
        src={imageUrl}
        className="w-[35px] bg-neutral-300 dark:bg-neutral-700 h-[35px] absolute rounded-full -top-5 object-cover"
        alt={""}
      />
      {/* {user.image && (
        <img
          src={`${baseURL}/uploaded_images/${user.image}`}
          className="w-[35px] h-[35px] absolute rounded-full -top-5 object-cover"
          alt={""}
        />
      )} */}
      <RiRadioButtonLine
        className="absolute top-[2px] left-[43px] text-green-500"
        size={12}
      />
      <span className="font-medium text-[13px] max-w-[60px] overflow-hidden mt-2">
        {checkUser(auth._id, user).username.split(" ")[0].toUpperCase()}
      </span>
    </div>
  );
};

const ListItem = ({ data, auth }: { ind: number; data: any; auth: any }) => {
  const { setOpen, setData } = useLayoutState();

  const handelClick = (val: typeof data) => {
    setOpen(true);
    setData(val);
  };

  const { data: state } = useLayoutState();

  const { imageUrl } = useImageCheckHook(checkUser(auth._id, data)?.image);

  return (
    <div
      onClick={() => handelClick(data)}
      className={`hover:dark:bg-neutral-800 rounded-[6px] hover:bg-neutral-300 mb-1 h-[70px] flex px-4 pt-3 items-start justify-between cursor-pointer ${
        data._id === state?._id && "dark:bg-neutral-800 bg-neutral-300"
      }`}
    >
      <div className="flex justify-between items-center gap-4">
        {/* {!user.img && ( */}
        <div className="relative">
          {/* <p className="w-[45px] text-indigo-500 font-medium bg-indigo-300/20 grid place-items-center	h-[45px] rounded-full object-cover">
            {data.groupName
              ? data.groupName.charAt(0).toUpperCase()
              : checkUser(auth._id, data).username.charAt(0).toUpperCase()}
          </p> */}
          {data.groupName && (
            <p className="w-[45px] text-indigo-500 font-medium bg-indigo-300/20 grid place-items-center	h-[45px] rounded-full object-cover">
              {data.groupName}
            </p>
          )}

          {!data.groupName && (
            <img
              className="w-[35px] h-[35px] bg-neutral-400/60 dark:bg-neutral-700 !z-50 rounded-full -top-5 object-cover"
              src={imageUrl}
              alt=""
            />
          )}

          {data.status === "online" && (
            <RiRadioButtonLine
              className="absolute bottom-[2px] -right-[3px] text-green-500"
              size={12}
            />
          )}
        </div>

        <div>
          <p className="font-medium text-[15px] dark:text-neutral-200 text-neutral-800">
            {data.groupName
              ? data.groupName
              : checkUser(auth._id, data).fullname}
          </p>
          <span
            className="text-neutral-500 overflow-hidden truncate text-ellipsis block max-w-[200px] dark:text-neutral-500 text-sm"
            dangerouslySetInnerHTML={{ __html: data?.lastMessage }}
          />
        </div>
      </div>
      <div className="flex flex-col text-[11px]">
        <span className="text-neutral-500 dark:text-neutral-400">
          {moment(data.updatedAt).fromNow()}
        </span>
        {/* <span
          style={{ borderRadius: "20px" }}
          className="bg-indigo-200 mt-1 max-w-6 text-neutral-600 w-auto flex items-center justify-center px-2"
        >
          02
        </span> */}
      </div>
    </div>
  );
};

export default ChatList;
