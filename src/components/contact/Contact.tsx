import { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import SearchableInput from "../form/SearchableInput";
import { useListFriend, useRemoveFriend } from "@/service/request";
import { useAuthData } from "@/context/auth.context";
import { getToken } from "@/service/token";
import { checkUser } from "@/utils/checkUser";
import { LoadingSkeleton } from "../skeleton/Skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { FaTrash } from "react-icons/fa6";

export interface User {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  image: string;
  bio: string;
}

export interface IGroup {
  users: any[];
  groupName: string;
}

export interface Friend extends IGroup {
  _id: string;
  requestBy: User;
  requestTo: User;
  isAccepted: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
  roomId: string;
  image: string;
  lastMessage: string;
}

interface IProp {
  title: string;
}

const Contact = ({ title }: IProp) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { authData } = useAuthData();
  const auth = getToken(authData);
  const { data: USERS, isLoading } = useListFriend(auth._id);
  const removeFriend = useRemoveFriend();

  const handelRemoveFriend = async (id: string, roomId: string) => {
    await removeFriend.mutateAsync({ id, roomId });
  };

  if (isLoading)
    return (
      <div className="pt-4 px-2">
        <LoadingSkeleton />
      </div>
    );

  // const filteredUsers: Friend[] = USERS.sort((a: Friend, b: Friend) => {
  //   if (auth._id !== a.requestBy._id) {
  //     if (a.requestBy.fullname < b.requestBy.fullname) {
  //       return -1;
  //     }
  //     if (a.requestBy.fullname > b.requestBy.fullname) {
  //       return 1;
  //     }
  //   } else {
  //     if (a.requestTo.fullname < b.requestTo.fullname) {
  //       return -1;
  //     }
  //     if (a.requestTo.fullname > b.requestTo.fullname) {
  //       return 1;
  //     }
  //   }
  //   return 0;
  // }).filter((user: Friend) =>
  //   user.requestBy.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const filteredUsers: Friend[] = USERS.filter((user: Friend) =>
    user.requestBy.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a: Friend, b: Friend) => {
    const nameA = checkUser(auth._id, a).fullname.toUpperCase();
    const nameB = checkUser(auth._id, b).fullname.toUpperCase();
    return nameA.localeCompare(nameB);
  });

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
      <div className="px-10 pt-8 pb-8 md:pb-0 max-h-[calc(100vh-145px)] min-h-[calc(100vh-145px)] overflow-y-auto">
        {!isLoading && filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map((user: Friend, index: number) => {
            const firstLetter = checkUser(auth._id, user)
              .fullname.charAt(0)
              .toUpperCase();
            const isFirstInGroup =
              index === 0 ||
              (auth._id === user.requestBy._id
                ? user.requestTo.fullname.charAt(0).toUpperCase() !==
                  filteredUsers[index - 1]?.requestTo?.fullname
                    .charAt(0)
                    .toUpperCase()
                : user.requestBy.fullname.charAt(0).toUpperCase() !==
                  filteredUsers[index - 1]?.requestBy?.fullname
                    .charAt(0)
                    .toUpperCase());
            return (
              <div className="mb-8" key={user._id}>
                {isFirstInGroup && (
                  <p className="text-indigo-500 mb-4 font-semibold">
                    {firstLetter}
                  </p>
                )}
                <div className="flex h-fit px-2 justify-between items-center">
                  <span className="font-medium  text-sm">
                    {checkUser(auth._id, user).fullname}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button>
                        <HiOutlineDotsHorizontal className="rotate-90" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel
                        onClick={() =>
                          handelRemoveFriend(user._id, user.roomId)
                        }
                        className="flex cursor-pointer items-center gap-2 dark:bg-neutral-800 border-none"
                      >
                        <FaTrash size={14} />
                        Remove
                      </DropdownMenuLabel>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex">No users found.</div>
        )}
      </div>
    </div>
  );
};

export default Contact;
