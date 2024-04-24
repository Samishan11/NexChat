import { Link } from "react-router-dom";

const Pagenotfount = () => {
  return (
    <div className="bg-neutral-900 h-screen flex-col gap-2 text-2xl font-semibold uppercase flex items-center justify-center">
      Opps!! Page Not Found
      <Link
        className="text-base animate-border border px-2 py-1 rounded-[6px]"
        to="/"
      >
        Return Back
      </Link>
    </div>
  );
};

export default Pagenotfount;
