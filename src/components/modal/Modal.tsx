import { useModalState } from "@/state/modal.state";
import { Cross1Icon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

interface IProp {
  children: React.ReactNode;
}

const Modal = ({ children }: IProp) => {
  const { open, setOpen } = useModalState();

  useEffect(() => {
    if (open) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className=" modal px-3 max-h-[60%] h-fit w-[89%] md:w-2/5 bg-white dark:bg-neutral-700 md:bg-neutral-200 !z-[9999] rounded-[5px] mx-5 md:mx-0 absolute left-0 md:left-[40%] top-[20%]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <div className="pt-2 mb-4 flex items-center justify-between">
            <h3 className="text-lg">Title</h3>
            <Cross1Icon onClick={() => setOpen(false)} className="" />
          </div>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
