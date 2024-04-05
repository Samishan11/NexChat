import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import useWindowSize from "@/hooks/useWindowSize";
import { useLayoutState } from "@/state/layout.state";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  const { width } = useWindowSize();
  const { open } = useLayoutState();
  return (
    <AnimatePresence key={"chat"}>
      <motion.div
        initial={{ x: 0, opacity: 0 }}
        animate={
          open
            ? { x: 0, opacity: 1 }
            : width >= 768
            ? { x: 0, opacity: 1 }
            : { x: "1000%", opacity: 0 }
        }
        exit={{
          x: "1000%",
          opacity: 0,
          transition: { type: "tween", duration: 1 },
        }}
        transition={{ duration: "1" }}
        className="z-[999] bg-neutral-100 w-full fixed left-0 top-0 h-screen md:relative dark:bg-neutral-900"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatLayout;
