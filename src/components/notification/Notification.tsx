import useImageCheckHook from "@/hooks/useImageCheckHook";
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
          notifications.length > 0 &&
          notifications.map((data: any) => (
            <NOTIFICATION key={data._id + Math.random()} data={data} />
          ))}
        {notifications && notifications.length === 0 && (
          <p className="text-neutral-400">No Notification</p>
        )}
      </div>
    </div>
  );
};

const NOTIFICATION = ({ data }: { data: any }) => {
  const { imageUrl } = useImageCheckHook(data.notificationBy?.image);

  return (
    <div
      key={data._id}
      className="flex cursor-pointer mb-3 py-1 dark:bg-neutral-800/70 bg-neutral-300/60 rounded-[8px] px-2 items-start gap-4"
    >
      <img
        key={data.id}
        src={imageUrl}
        className="w-[48px] h-[35px] rounded-full object-cover"
        alt={data.name}
      />
      <div>
        <span className="dark:text-neutral-400 text-neutral-800 text-sm">
          {data.notification}
        </span>
      </div>
    </div>
  );
};

export default Notification;
