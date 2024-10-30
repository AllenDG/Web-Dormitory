import HomeLayout from "../components/layouts/HomeLayout";
import OwnerLayout from "../components/layouts/OwnerLayout";
import PageNotFound from "../pages/PageNotFound";
import AboutUsPage from "../pages/AboutUsPage";
import FindRentalsPage from "../pages/FindRentalsPage";
import HowItWorksPage from "../pages/HowItWorksPage";
import LandingPage from "../pages/LandingPage";
import ViewListingPage from "../pages/ViewListingPage";
import RegisterPage from "../pages/RegisterPage";
import PostMyPropertyPage from "../pages/PostMyPropertyPage";
import ChatPage from "../pages/ChatPage";
import LoginPage from "../pages/LoginPage";
import OwnerDashboardPage from "../pages/OwnerDashboardPage";
import OwnerRentalsPage from "../pages/OwnerRentalsPage";
import OwnerAddRentalsPage from "../pages/OwnerAddRentalsPage";
import OwnerTenantsPage from "../pages/OwnerTenantsPage";
import OwnerSettingsPage from "../pages/OwnerSettingsPage";
import ScheduleVisitPage from "../pages/ScheduleVisitPage";

export const mainRoutes = [
  {
    path: "*",
    element: <PageNotFound />,
  },
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        path: "",
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "find-rentals",
        element: <FindRentalsPage />,
      },
      {
        path: "listing/:id",
        element: <ViewListingPage />,
      },
      {
        path: "about-us",
        element: <AboutUsPage />,
      },
      {
        path: "how-it-works",
        element: <HowItWorksPage />,
      },
      {
        path: "post-my-property",
        element: <PostMyPropertyPage />,
      },

      {
        path: "chat-page",
        element: <ChatPage />,
      },

      {
        path: "schedule-visit",
        element: <ScheduleVisitPage />,
      },
    ],
  },
  {
    path: "/owner",
    element: <OwnerLayout />,
    children: [
      {
        path: "",
        element: <OwnerDashboardPage />,
      },
      {
        path: "rentals",
        element: <OwnerRentalsPage />,
      },
      {
        path: "add-rentals",
        element: <OwnerAddRentalsPage />,
      },
      {
        path: "tenants",
        element: <OwnerTenantsPage />,
      },
      {
        path: "chats",
        element: <ChatPage />,
      },
      {
        path: "settings",
        element: <OwnerSettingsPage />,
      },
    ],
  },
];
