import Content from "@/components/content/Content";
import Chatlist from "@/components/chatlist/Chatlist";
import Navbar from "@/components/navbar/Navbar";
import Profile from "@/components/profile/Profile";
import { useNavbarState } from "@/state/navbar.state";
import ChatLayout from "./ChatLayout";
import ChatLogo from "@/assets/chat.svg";
import Inbox from "@/components/inbox/Inbox";
import { useLayoutState } from "@/state/layout.state";
import Contact, { Friend } from "@/components/contact/Contact";
import Setting from "@/components/setting/Setting";
import FriendList from "@/components/friend/FriendList";
import Notification from "@/components/notification/Notification";
import { useSocket } from "@/context/socket.context";
import { useEffect, useState } from "react";
import AddUser from "@/components/adduser/AddUser";
import { useAuthData } from "@/context/auth.context";
import { getToken } from "@/service/token";
import { useListRequest } from "@/service/request";
import { useListNotification } from "@/service/notification/notification";
import notificationsound from "@/assets/mp3/notification.mp3";
const Layout = () => {
  const { socket } = useSocket();
  const { current } = useNavbarState();
  const { open } = useLayoutState();
  const { authData } = useAuthData();
  const auth = getToken(authData);
  // states
  const [onlineUsers, setOnlineusers] = useState<Friend[]>([]);
  const [friendRequestLists, setRequest] = useState<Friend[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);
  // list pending requests
  const { data: requestList, isLoading: isLoadingRequestList } = useListRequest(
    auth?._id
  );

  // list notifications
  const { data, isLoading } = useListNotification(auth?._id);

  // hooks for socket and set data
  useEffect(() => {
    if (socket) {
      socket.on("onlineUsers", (onlineUsers) => {
        setOnlineusers(onlineUsers);
      });
      return () => {
        socket.off("onlineUsers", () => {
          setOnlineusers([]);
        });
      };
    }
  }, [socket]);
  //
  useEffect(() => {
    if (!requestList) return;
    setRequest(requestList);
  }, [requestList]);
  //
  useEffect(() => {
    if (socket) {
      const handelRequest = (data: Friend) => {
        setRequest((prev) => [...prev, data]);
      };
      socket.on("list-request", handelRequest);
      return () => {
        socket.off("list-request", handelRequest);
      };
    }
  }, [socket]);
  // set notifications
  useEffect(() => {
    if (!data) return;
    setNotifications(data?.data);
    setCount(data?.count);
  }, [data]);
  // set notifications
  useEffect(() => {
    if (socket) {
      const handleNotification = (notiData: any) => {
        const audio = new Audio(notificationsound);
        audio.play();
        setNotifications((prev) => [...prev, notiData]);
        setCount(count + 1);
      };
      socket.on("get-notification", handleNotification);
      return () => {
        socket.off("get-notification", handleNotification);
      };
    }
  }, [socket, count]);

  // handel componets state
  const COMPONENTS: { [key: string]: JSX.Element } = {
    Profile: <Profile title={current} />,
    Chat: (
      <Chatlist socket={socket} onlineUsers={onlineUsers} title={current} />
    ),
    Contact: <Contact title={current} />,
    Setting: <Setting title={current} />,
    Requests: (
      <FriendList
        isLoading={isLoadingRequestList}
        socket={socket}
        user={friendRequestLists as Friend[]}
        title={"Friend Requests"}
      />
    ),
    Create: <AddUser socket={socket} title="Add User and Group" />,
    Notification: (
      <Notification
        isLoading={isLoading}
        notifications={notifications}
        title={"Notifications"}
      />
    ),
  };

  return (
    <div className="w-full chat-pannel z-10 relative h-full flex">
      <Navbar notifications={notifications} count={count} />
      <Content>{COMPONENTS[current]}</Content>
      <ChatLayout>
        {open && <Inbox socket={socket} />}
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
