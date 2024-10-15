import { IconButton, useColorMode } from "@chakra-ui/react";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

export default function ThemeController() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton variant="ghost" onClick={toggleColorMode}>
      {colorMode === "light" ? (
        <IoMoonOutline size={30} />
      ) : (
        <IoSunnyOutline size={30} />
      )}
    </IconButton>
  );
}
