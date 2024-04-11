import { LoadingSkeleton } from "../skeleton/Skeleton";

interface IProp {
  title: string;
  notifications: any[];
  isLoading: boolean;
}
const Notification = ({ title, notifications, isLoading }: IProp) => {
  if (isLoading)
    return (
      <div className="pt-4 px-2">
        <LoadingSkeleton />
      </div>
    );

  return (
    <div className="w-full h-auto sm:h-auto dark:text-neutral-200">
      <div className="px-[26px]">
        <div className="mt-[21px] flex items-center justify-between">
          <h1 className=" text-[21px] font-semibold">{title}</h1>
        </div>
      </div>
      <div className="mt-10 md:pb-0 pb-14 px-[26px] max-h-[calc(100vh-100px)] overflow-y-auto mb-6">
        {notifications &&
          notifications &&
          notifications.map((data: any) => (
            <NOTIFICATION key={data._id + Math.random()} data={data} />
          ))}
      </div>
    </div>
  );
};

const NOTIFICATION = ({ data }: { data: any }) => {
  return (
    <div
      key={data._id}
      className="flex cursor-pointer mb-3 pt-1 dark:bg-neutral-800/70 bg-neutral-300/60 rounded-[8px] px-2 items-start gap-4"
    >
      {/* {!data.img && ( */}
      <p className="max-w-[48px] max-h-[38px] min-w-[42px] min-h-[42px] font-medium  bg-neutral-400/40 dark:bg-neutral-500/90 grid place-items-center  rounded-full  object-cover">
        {/* {data.name.charAt(0).toUpperCase()} */}S
      </p>
      {/* )} */}
      {/* {data.img && (
        <img
          key={data.id}
          src={data.img}
          className="w-[48px] h-[35px] rounded-full object-cover"
          alt={data.name}
        />
      )} */}
      <div>
        <span className="dark:text-neutral-400 text-neutral-800 text-sm">
          {data.notification}
        </span>
      </div>
    </div>
  );
};

export default Notification;
