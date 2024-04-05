import { HiOutlineUserAdd } from "react-icons/hi";
import { Input } from "../ui/input";
import { FiSearch } from "react-icons/fi";
interface IProp {
  title: string;
}
const FriendList = ({ title }: IProp) => {
  return (
    <div className="h-screen dark:text-neutral-100 overflow-hidden dark:bg-neutral-900 bg-neutral-200 border-r-2 dark:border-neutral-950 border-neutral-300 shadow">
      <div className="px-[26px]">
        <div className="mt-[21px] flex flex-col gap-4 items-start justify-between">
          <h1 className="text-[21px] font-semibold">{title}</h1>
          <Input
            className="h-11"
            icon={<FiSearch size={22} className="text-neutral-200" />}
            placeholder="Search"
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="px-6 pt-16 max-h-[calc(100vh-145px)] min-h-[calc(100vh-145px)] overflow-y-auto">
        {Array.from({ length: 10 }).map((_, ind) => (
          <div
            key={ind}
            style={{ borderRadius: "6px" }}
            className={`hover:dark:bg-neutral-800 hover:bg-neutral-300 mb-1 h-16 flex px-4 pt-2 items-center justify-between cursor-pointer `}
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
              </div>
            </div>
            <div className="flex justify-center items-center">
              <HiOutlineUserAdd className="text-indigo-500" size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendList;
