import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { IoChatbubbleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom"; // For navigation

export default function InquireForm() {
  const navigate = useNavigate();

  // Function to handle navigation when clicking on the inquiry section
  const handleInquiryClick = () => {
    navigate('/chat-page'); // This should navigate to your chat page
  };

  return (
    <>
      <Flex align="center" gap={2} onClick={handleInquiryClick} cursor="pointer">
        <IoChatbubbleOutline size={35} color="#0084FF" />
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
