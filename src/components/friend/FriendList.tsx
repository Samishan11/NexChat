import { HiOutlineUserAdd } from "react-icons/hi";
import SearchableInput from "../form/SearchableInput";
import { useState } from "react";
import { USERS } from "@/constrants/data";

interface IProp {
  title: string;
}

interface IUser {
  id: number;
  name: string;
  img: string;
}

const FriendList = ({ title }: IProp) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const data: IUser[] = USERS;

  const filteredUsers = data.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(filteredUsers);
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
      <div className="px-6 pt-16 max-h-[calc(100vh-145px)] min-h-[calc(100vh-145px)] overflow-y-auto">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => <UI user={user} />)
        ) : (
          <div className="flex">No users found.</div>
        )}
      </div>
    </div>
  );
};

const UI = ({ user }: { user: IUser }) => {
  return (
    <div
      key={user.id}
      style={{ borderRadius: "6px" }}
      className={`hover:dark:bg-neutral-800 hover:bg-neutral-300 mb-1 h-16 flex px-4 pt-2 items-center justify-between cursor-pointer `}
    >
      <div className="flex justify-between items-center gap-4">
        {!user.img ? (
          <p className="w-[35px] font-medium bg-neutral-400/40 grid place-items-center	 h-[35px] !z-50 rounded-full -top-5 object-cover">
            {user.name.charAt(0).toUpperCase()}
          </p>
        ) : (
          <img
            src={user.img}
            className="w-[35px] h-[35px]  rounded-full -top-5 object-cover"
            alt={user.name}
          />
        )}

        <div>
          <p className="font-medium text-[15px] dark:text-neutral-100 text-neutral-800">
            {user.name}
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <HiOutlineUserAdd className="text-indigo-500" size={20} />
      </div>
    </div>
  );
};

export default FriendList;
