import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

interface IUser {
  id: number;
  name: string;
}

interface IProp {
  title: string;
}

const Contact = ({ title }: IProp) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = USERS.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen dark:text-neutral-100 overflow-hidden dark:bg-neutral-900 bg-neutral-200 border-r-2 dark:border-neutral-950 border-neutral-300 shadow">
      <div className="px-[26px]">
        <div className="mt-[21px] flex flex-col gap-4 items-start justify-between">
          <h1 className="text-[21px] font-semibold">{title}</h1>
          <Input
            className="h-11"
            icon={<FiSearch size={22} className="text-neutral-200" />}
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className=" px-10 pt-8  max-h-[calc(100vh-145px)] min-h-[calc(100vh-145px)] overflow-y-auto">
        {filteredUsers.length > 0 &&
          filteredUsers.map((user, index) => {
            const firstLetter = user.name.charAt(0).toUpperCase();
            const isFirstInGroup =
              index === 0 ||
              user.name.charAt(0).toUpperCase() !==
                filteredUsers[index - 1].name.charAt(0).toUpperCase();
            return (
              <div className="mb-8" key={user.id}>
                {isFirstInGroup && (
                  <p className="text-indigo-500 mb-4 font-semibold">
                    {firstLetter}
                  </p>
                )}
                <div className="flex h-fit px-2 justify-between items-center">
                  <span className="font-medium  text-sm">{user.name}</span>
                  <HiOutlineDotsHorizontal className="rotate-90" />
                </div>
              </div>
            );
          })}
        {!filteredUsers.length && <div className="flex">No users found.</div>}
      </div>
    </div>
  );
};

const USERS: IUser[] = [
  { id: 1, name: "Albert Rodarte" },
  { id: 2, name: "Allison Etter" },
  { id: 3, name: "Craig Smiley" },
  { id: 4, name: "Daniel Clay" },
  { id: 5, name: "Doris Brown" },
  { id: 6, name: "Hanah Mile" },
  { id: 7, name: "Iris Wells" },
  { id: 8, name: "Juan Flakes" },
  { id: 9, name: "John Hall" },
  { id: 10, name: "Joy Southern" },
];

export default Contact;
