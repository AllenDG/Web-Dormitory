import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { IoChatbubbleOutline } from "react-icons/io5";

export default function InquireForm() {
  return (
    <>
      <Flex align="center" gap={2}>
        <IoChatbubbleOutline size={35} color="#0084FF"  />
        <Box>
          <Heading as='h5' size='sm' color="primary.500">
            Send an inquiry
          </Heading>
          <Text color="primary.500" fontSize='xs'>
            Need clarifications about this listing?
          </Text>
        </Box>
      </Flex>
    </>
  );
}
