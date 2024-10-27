import {
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";

export default function PasswordInput({ label, placeholder, isRequired }) {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <FormControl isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>
      <InputGroup>
        <Input
          type={isOpen ? "text" : "password"}
          placeholder={placeholder}
          focusBorderColor="primary.500"
        />
        <InputRightElement>
          <IconButton
            variant="ghost"
            aria-label="Toggle Password Visibility"
            icon={isOpen ? <ViewOffIcon /> : <ViewIcon />}
            onClick={onToggle}
          />
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
}
