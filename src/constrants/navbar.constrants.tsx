import { FaRegUser } from "react-icons/fa6";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { RiContactsLine } from "react-icons/ri";
import { TbSettingsPause } from "react-icons/tb";

export const NAVBARITEM = [
  {
    name: "Profile",
    icon: (
      <FaRegUser
        className="text-neutral-500 dark:text-neutral-200"
        size={"24px"}
      />
    ),
  },
  {
    name: "Chat",
    icon: (
      <IoChatboxEllipsesOutline
        className="text-neutral-500 dark:text-neutral-200"
        size={"24px"}
      />
    ),
  },
  {
    name: "Friends",
    icon: (
      <FiUsers
        className="text-neutral-500 dark:text-neutral-200"
        size={"24px"}
      />
    ),
  },
  {
    name: "Contact",
    icon: (
      <RiContactsLine
        className="text-neutral-500 dark:text-neutral-200"
        size={"24px"}
      />
    ),
  },
  {
    name: "Setting",
    icon: (
      <TbSettingsPause
        className="text-neutral-500 dark:text-neutral-200"
        size={"24px"}
      />
    ),
  },
];
