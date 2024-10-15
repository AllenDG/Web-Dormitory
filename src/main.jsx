import "./index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { mainRoutes } from "./routes/mainRoutes.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { myTheme } from "./components/theme/myTheme.js";
import theme from "./components/theme/theme.js";

const router = createBrowserRouter(mainRoutes);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider theme={myTheme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <RouterProvider router={router} />
    </ChakraProvider>
  </StrictMode>
);
