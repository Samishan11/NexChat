import { HiOutlineUserAdd } from "react-icons/hi";
import SearchableInput from "../form/SearchableInput";
import { useState } from "react";
import { useAuthData } from "@/context/auth.context";
import { getToken } from "@/service/token";
import { Friend } from "../contact/Contact";
import { LoadingSkeleton } from "../skeleton/Skeleton";
import { Socket } from "socket.io-client";
import Toast from "../Toast";

interface IProp {
  title: string;
  user: Friend[];
  socket: Socket | null;
  isLoading: boolean;
}

export interface IFriend {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  img: string;
}

const FriendList = ({ title, user, socket, isLoading }: IProp) => {
  const { authData } = useAuthData();
  const auth = getToken(authData);
  const [searchTerm, setSearchTerm] = useState<string>("");
  //
  const data: Friend[] = user;

  const filterUser = data.filter((user: Friend) =>
    user.requestBy.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const acceptRequest = (requestBy: any) => {
    if (!socket || !auth) return;
    const data = {
      requestBy,
      requestTo: auth._id,
    };
    socket.emit("accept-request", data);
    Toast({ type: "success", message: "Request accepted successfully" });
  };

  if (isLoading)
    return (
      <div className="pt-4 px-2">
        <LoadingSkeleton />
      </div>
    );

  return (
    <div className="h-screen dark:text-neutral-100 overflow-hidden dark:bg-neutral-900 bg-neutral-200 border-r-2 dark:border-neutral-950 border-neutral-300 shadow">
      <div className="px-[26px]">
        <div className="mt-[21px] flex flex-col gap-4 items-start justify-between">
          <h1 className="text-[21px] font-semibold">{title}</h1>
          <SearchableInput
            searchTerm={searchTerm}
            handleChange={setSearchTerm}
          />
        </div>
      </div>
      <div className="px-6 md:pb-0 pb-10 pt-16 max-h-[calc(100vh-145px)] min-h-[calc(100vh-145px)] overflow-y-auto">
        {filterUser && filterUser.length > 0 ? (
          filterUser.map((user: Friend) => (
            <UI handelClick={acceptRequest} key={user._id} user={user} />
          ))
        ) : (
          <div className="flex">No users found.</div>
        )}
      </div>
    </div>
  );
};

export function UI({ user, handelClick }: IUIProp) {
  return (
    <div
      style={{ borderRadius: "6px" }}
      className={`hover:dark:bg-neutral-800 hover:bg-neutral-300 mb-1 h-16 flex px-4 pt-2 items-center justify-between cursor-pointer `}
    >
      <div className="flex justify-between items-center gap-4">
        {user && user.img ? (
          <img
            src={user.img}
            className="w-[35px] h-[35px] rounded-full -top-5 object-cover"
            alt={user?.requestBy?.fullname}
          />
        ) : (
          <p className="w-[35px] font-medium bg-neutral-400/40 grid place-items-center h-[35px] !z-50 rounded-full -top-5 object-cover">
            {user?.requestBy?.fullname?.slice(0, 1)}
          </p>
        )}
        <div>
          <p className="font-medium text-[15px] dark:text-neutral-100 text-neutral-800">
            {user?.requestBy?.fullname}
          </p>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          handelClick(user?.requestBy._id as any);
        }}
        className="flex justify-center items-center"
      >
        <HiOutlineUserAdd
          className="text-neutral-500 dark:text-neutral-200"
          size={20}
        />
      </button>
    </div>
  );
}

interface IUIProp {
  user?: Friend;
  handelClick: (data: string) => void;
}

export default FriendList;
