import { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import SearchableInput from "../form/SearchableInput";
import { useListFriend } from "@/service/request";
import { useAuthData } from "@/context/auth.context";
import { getToken } from "@/service/token";
import { checkUser } from "@/utils/checkUser";
import { LoadingSkeleton } from "../skeleton/Skeleton";

export interface User {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  image: string;
}

export interface Friend {
  _id: string;
  requestBy: User;
  requestTo: User;
  isAccepted: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
  roomId: string;
  img: string;
  groupName: string;
  users: any[];
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

  if (isLoading)
    return (
      <div className="pt-4 px-2">
        <LoadingSkeleton />
      </div>
    );

  const filteredUsers: Friend[] = USERS.sort((a: Friend, b: Friend) => {
    if (auth._id !== a.requestBy._id) {
      if (a.requestBy.username < b.requestBy.username) {
        return -1;
      }
      if (a.requestBy.username > b.requestBy.username) {
        return 1;
      }
    } else {
      if (a.requestTo.username < b.requestTo.username) {
        return -1;
      }
      if (a.requestTo.username > b.requestTo.username) {
        return 1;
      }
    }
    return 0;
  }).filter((user: Friend) =>
    user.requestBy.username.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="px-10 pt-8 pb-8 md:pb-0 max-h-[calc(100vh-145px)] min-h-[calc(100vh-145px)] overflow-y-auto">
        {!isLoading && filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map((user: Friend, index: number) => {
            const firstLetter = checkUser(auth._id, user)
              .username.charAt(0)
              .toUpperCase();
            const isFirstInGroup =
              index === 0 ||
              (auth._id === user.requestBy._id
                ? user.requestTo.username.charAt(0).toUpperCase() !==
                  filteredUsers[index - 1]?.requestTo?.username
                    .charAt(0)
                    .toUpperCase()
                : user.requestBy.username.charAt(0).toUpperCase() !==
                  filteredUsers[index - 1]?.requestBy?.username
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
                    {checkUser(auth._id, user).username}
                  </span>
                  <HiOutlineDotsHorizontal className="rotate-90" />
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
