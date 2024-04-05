import Content from "@/components/content/Content";
import Chatlist from "@/components/chatlist/Chatlist";
import Navbar from "@/components/navbar/Navbar";
import Profile from "@/components/profile/Profile";
import { useNavbarState } from "@/state/navbar.state";
import ChatLayout from "./ChatLayout";
import ChatLogo from "@/assets/chat.svg";
import Inbox from "@/components/inbox/Inbox";
import { useLayoutState } from "@/state/layout.state";
import { FaComment } from "react-icons/fa6";
const Layout = () => {
  const { current } = useNavbarState();
  const { open } = useLayoutState();

  return (
    <div className="w-full h-full flex">
      <Navbar />
      <Content>
        {current === "Profile" && <Profile title={current} />}
        {current === "Chat" && <Chatlist title={current} />}
      </Content>
      <ChatLayout>
        {open && <Inbox />}
        {!open && (
          <div className="h-full flex w-full flex-col gap-5 justify-center items-center">
            <div className="h-[120px] w-[120px] flex  justify-center items-center rounded-full bg-neutral-800/70">
              <img src={ChatLogo} alt="" />
              {/* <FaComment className="text-4xl" /> */}
            </div>
            <div
              className="px-6 text-lg font-medium py-2 rounded text-neutral-100 bg-neutral-700/20"
            >
              Start Conversation
            </div>
          </div>
        )}
      </ChatLayout>
    </div>
  );
};

export default Layout;
