import Content from "@/components/content/Content";
import Chatlist from "@/components/chatlist/Chatlist";
import Navbar from "@/components/navbar/Navbar";
import Profile from "@/components/profile/Profile";
import { useNavbarState } from "@/state/navbar.state";
import ChatLayout from "./ChatLayout";
import ChatLogo from "@/assets/chat.svg";
import Inbox from "@/components/inbox/Inbox";
import { useLayoutState } from "@/state/layout.state";
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
          <div className="h-full flex w-full flex-col gap-5 justify-center items-center ">
            <div className="h-[120px] w-[120px] flex  justify-center items-center rounded-full bg-neutral-500/70">
              <img src={ChatLogo} alt="" />
            </div>
            <p
              style={{ borderRadius: "20px" }}
              className="px-4 text-xl font-semibold py-2 text-white bg-neutral-500/70"
            >
              Start Conversation
            </p>
          </div>
        )}
      </ChatLayout>
    </div>
  );
};

export default Layout;
