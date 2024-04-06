import { USERS } from "@/constrants/data";

const Notification = ({ title }: { title: string }) => {
  return (
    <div className="w-full h-auto sm:h-auto dark:text-neutral-200">
      <div className="px-[26px]">
        <div className="mt-[21px] flex items-center justify-between">
          <h1 className=" text-[21px] font-semibold">{title}</h1>
        </div>
      </div>
      <div className="mt-10 px-[26px] max-h-[calc(100vh-100px)] overflow-y-auto mb-6">
        {USERS.map((data) => (
          <NOTIFICATION data={data} />
        ))}
      </div>
    </div>
  );
};

const NOTIFICATION = ({
  data,
}: {
  data: (typeof USERS)[keyof (typeof USERS)[keyof typeof USERS]];
}) => {
  return (
    <div className="flex cursor-pointer mb-3 pt-1 dark:bg-neutral-800/70 bg-neutral-300/60 rounded-[8px] px-2 items-start gap-4">
      {!data.img && (
        <p className="w-[48px] font-medium  bg-neutral-400/40 dark:bg-neutral-500/90 grid place-items-center	 h-[35px] rounded-full  object-cover">
          {data.name.charAt(0).toUpperCase()}
        </p>
      )}
      {data.img && (
        <img
          key={data.id}
          src={data.img}
          className="w-[48px] h-[35px] rounded-full object-cover"
          alt={data.name}
        />
      )}
      <div>
        <span className="text-neutral-400 dark:text-neutral-500 text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </span>
      </div>
    </div>
  );
};

export default Notification;
