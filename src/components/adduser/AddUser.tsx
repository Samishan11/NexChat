import { forwardRef, useRef, useState } from "react";
import SearchableInput from "../form/SearchableInput";
import { useUserQuery } from "@/service/auth";
import Modal from "@/modal/Modal";
import { useModalState } from "@/state/modal.state";
import { Friend, User } from "../contact/Contact";
import { HiOutlineUserAdd } from "react-icons/hi";
import { useListFriend } from "@/service/request";
import { useAuthData } from "@/context/auth.context";
import { getToken } from "@/service/token";
import { checkUser } from "@/utils/checkUser";
import { LoadingSkeleton } from "../skeleton/Skeleton";
import { Socket } from "socket.io-client";
import Toast from "../Toast";
interface IProp {
  title: string;
  socket: Socket | null;
}

interface IUser {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGroup {
  _id: string;
  groupName: string;
  users: IUser[];
  roomId: string;
  createdBy: string | IUser;
  lastMessage: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const AddUser = ({ title, socket }: IProp) => {
  const { authData } = useAuthData();
  const auth = getToken(authData);

  const { open, setOpen } = useModalState();
  const ref = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data: users, isLoading } = useUserQuery();

  const { data: friends } = useListFriend(auth._id);

  const data: User[] = users;

  const filteredUsers = data?.filter((user: User) =>
    user?.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendRequest = (requestTo: any) => {
    if (socket && auth) {
      const data = {
        requestBy: auth._id,
        requestTo,
      };
      socket.emit("send-request", data);
      Toast({ type: "success", message: "Request sent successfully" });
    }
  };

  const handelCreateGroup = (data: any) => {
    if (socket) {
      socket.emit("create_group", data);
      setOpen(false);
      Toast({ type: "success", message: "Group created successfully" });
    }
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
          {data && (
            <button
              onClick={() => setOpen(!open)}
              className="dark:bg-neutral-700/40 bg-neutral-300 mb-5 p-2 rounded-[8px]"
            >
              Create Group
            </button>
          )}
          <Modal>
            <GroupForm
              data={friends}
              handelClick={() => setOpen(!open)}
              handelSubmit={handelCreateGroup}
              ref={ref}
              auth={auth}
            />
          </Modal>
        </div>
      </div>
      <div className="px-6 md:pb-0 pb-10 max-h-[calc(100vh-145px)] min-h-[calc(100vh-145px)] overflow-y-auto">
        {filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map((user: User) => (
            <div
              style={{ borderRadius: "6px" }}
              className={`hover:dark:bg-neutral-800 hover:bg-neutral-300 mb-1 h-16 flex px-4 pt-2 items-center justify-between cursor-pointer `}
            >
              <div className="flex justify-between items-center gap-4">
                {user && user.image ? (
                  <img
                    src={user.image}
                    className="w-[35px] h-[35px] rounded-full -top-5 object-cover"
                    alt={user.fullname}
                  />
                ) : (
                  <p className="w-[35px] font-medium bg-neutral-400/40 grid place-items-center h-[35px] !z-50 rounded-full -top-5 object-cover">
                    {user?.fullname?.slice(0, 1)}
                  </p>
                )}
                <div>
                  <p className="font-medium text-[15px] dark:text-neutral-100 text-neutral-800">
                    {user?.fullname}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  sendRequest(user._id);
                }}
                className="flex justify-center items-center"
              >
                <HiOutlineUserAdd
                  className="text-neutral-500 dark:text-neutral-200"
                  size={20}
                />
              </button>
            </div>
          ))
        ) : (
          <div className="flex mt-6">No users found.</div>
        )}
      </div>
    </div>
  );
};

const GroupForm = forwardRef(({ data, auth, handelSubmit }: IPropForm, ref) => {
  const { setOpen } = useModalState();
  const [users, setUsers] = useState<any[]>([]);
  const [text, setText] = useState<string>("");

  const handelSelect = (data: any) => {
    if (!users.some((user) => user === data)) {
      setUsers((prev) => [...prev, data]);
    }
  };

  const formData = {
    users,
    groupName: text,
    createdBy: auth._id,
  };

  if (!data)
    return (
      <div className="mt-4 flex justify-center items-center">No User Found</div>
    );

  return (
    <div className="">
      <form ref={ref as any} action="">
        <div className="flex flex-col mb-3 gap-2">
          <label htmlFor="">Group Name</label>
          <input
            onChange={(e) => setText(e.target.value)}
            className="p-2 border border-indigo-500 focus:outline-indigo-500 rounded-[8px]"
            type="text"
            name=""
            id=""
          />
        </div>
        <div className={` mt-4 overflow-y-scroll`}>
          {data.map((user) => (
            <div
              key={user._id}
              style={{ borderRadius: "6px" }}
              className={`hover:dark:bg-neutral-800 hover:bg-neutral-300 mb-1 h-16 flex px-4 pt-2 items-center justify-between cursor-pointer `}
            >
              <div className="flex justify-between items-center gap-4">
                {user && checkUser(auth._id, user).image ? (
                  <img
                    src={checkUser(auth._id, user).image}
                    className="w-[35px] h-[35px] rounded-full -top-5 object-cover"
                    alt={checkUser(auth._id, user).username}
                  />
                ) : (
                  <p className="w-[35px] font-medium bg-neutral-400/40 grid place-items-center h-[35px] !z-50 rounded-full -top-5 object-cover">
                    {checkUser(auth._id, user).fullname?.slice(0, 1)}
                  </p>
                )}
                <div>
                  <p className="font-medium text-[15px] dark:text-neutral-100 text-neutral-800">
                    {checkUser(auth._id, user).fullname}
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  handelSelect(checkUser(auth._id, user)._id);
                }}
                className="flex justify-center items-center"
              >
                <HiOutlineUserAdd
                  className="text-neutral-500 dark:text-neutral-200"
                  size={20}
                />
              </button>
            </div>
          ))}
        </div>
      </form>
      <div className="flex absolute bottom-0 left-2/4 -translate-x-2/4 mt-2 justify-center gap-4 items-center">
        <button
          onClick={() => setOpen(false)}
          className="bg-red-400 text-neutral-200 mb-5 py-2 px-4 rounded-[8px]"
        >
          cancel
        </button>
        <button
          onClick={() => handelSubmit(formData)}
          className="bg-indigo-500 text-neutral-200 mb-5 py-2 px-4 rounded-[8px]"
        >
          Save
        </button>
      </div>
    </div>
  );
});

interface IPropForm {
  handelSubmit: (data: any) => void;
  handelClick: () => void;
  data: Friend[];
  auth: any;
}

export default AddUser;
