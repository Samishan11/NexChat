import Content from "@/components/content/Content";
import Chatlist from "@/components/chatlist/Chatlist";
import Navbar from "@/components/navbar/Navbar";
import Profile from "@/components/profile/Profile";
import { useNavbarState } from "@/state/navbar.state";
import ChatLayout from "./ChatLayout";
import ChatLogo from "@/assets/chat.svg";
import Inbox from "@/components/inbox/Inbox";
import { useLayoutState } from "@/state/layout.state";
import Contact from "@/components/contact/Contact";
import Setting from "@/components/setting/Setting";
import FriendList from "@/components/friend/FriendList";
import Notification from "@/components/notification/Notification";

const Layout = () => {
  const { current } = useNavbarState();
  const { open } = useLayoutState();

  const COMPONENTS: { [key: string]: JSX.Element } = {
    Profile: <Profile title={current} />,
    Chat: <Chatlist title={current} />,
    Contact: <Contact title={current} />,
    Setting: <Setting title={current} />,
    Friends: <FriendList title={"Friend Requests"} />,
    Notification: <Notification title={"Notifications"} />,
  };

  return (
    <div className="w-full h-full flex">
      <Navbar />
      <Content>{COMPONENTS[current]}</Content>
      <ChatLayout>
        {open && <Inbox />}
        {!open && (
          <div className="h-full flex w-full flex-col gap-5 justify-center items-center">
            <div className="h-[120px] w-[120px] flex  justify-center items-center rounded-full bg-neutral-600/70">
              <img src={ChatLogo} alt="" />
            </div>
            <div className="px-6 text-lg font-medium py-2 rounded text-neutral-100 bg-neutral-700/20">
              Start Conversation
            </div>
          </div>
        )}
      </ChatLayout>
    </div>
  );
};

export default Layout;
