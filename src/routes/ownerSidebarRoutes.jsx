import {
  IoBuildOutline,
  IoHomeOutline,
  IoPeopleOutline,
  IoSettingsOutline,
} from "react-icons/io5";

export const ownerSidebarRoutes= [
  {
    path: "/owner/",
    label: "Dashboard",
    icon: IoHomeOutline,
  },
  {
    path: "/owner/rentals",
    label: "Rentals",
    icon: IoBuildOutline,
  },
  {
    path: "/owner/tenants",
    label: "Tenants",
    icon: IoPeopleOutline,
  },
  {
    path: "/owner/settings",
    label: "Settings",
    icon: IoSettingsOutline,
  },
];
