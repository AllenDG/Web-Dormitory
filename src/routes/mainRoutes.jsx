import HomeLayout from "../components/layouts/HomeLayout";
import PageNotFound from "../pages/PageNotFound";
import AboutUsPage from "../pages/AboutUsPage";
import FindRentalsPage from "../pages/FindRentalsPage";
import HowItWorksPage from "../pages/HowItWorksPage";
import LandingPage from "../pages/LandingPage";
import ViewListingPage from "../pages/ViewListingPage";
import RegisterPage from "../pages/RegisterPage";
import PostMyPropertyPage from "../pages/PostMyPropertyPage";

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
    ],
  },
];
