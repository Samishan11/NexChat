import React from "react";

const Content = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full md:w-[550px] h-screen dark:bg-neutral-900 bg-indigo-50/50 text-black">
      {children}
    </div>
  );
};

export default Content;
