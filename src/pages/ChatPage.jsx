import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  Avatar,
  Spacer,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";

export default function ChatPage() {
  const bgColor = useColorModeValue("bg.light", "bg.dark");

  const [messages, setMessages] = useState([
    { id: 1, text: "Hi, I'm interested in your listing!", sender: "user" },
    { id: 2, text: "Great! How can I assist you?", sender: "owner" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: newMessage, sender: "user" },
      ]);
      setNewMessage("");
    }
  };

  return (
    <Flex
      direction="column"
      minH="100%"
      justify="flex-start"
      align="center"
      bg={bgColor}
      px={6}
      py={12}
    >
      <Box
        maxW="600px" // Set a maximum width for the chat box
        w="100%"
        borderRadius="lg" // Adds rounded corners
        boxShadow="lg" // Adds a shadow for better visual appeal
        overflow="hidden" // Ensures content stays within the box
      >
        {/* Chat Header */}
        <Box bg="blue.500" p={4} color="white">
          <Heading as="h1" size="md">
            Chat with Owner
          </Heading>
          <Text fontSize="sm">
            Feel free to ask any questions about the listing
          </Text>
        </Box>

        {/* Chat Messages */}
        <Flex
          direction="column"
          flex="1"
          p={4}
          overflowY="auto"
          bg="gray.50"
          h={400}
        >
          <VStack spacing={4} align="stretch">
            {messages.map((message) => (
              <HStack
                key={message.id}
                justify={message.sender === "user" ? "flex-end" : "flex-start"}
              >
                {message.sender === "owner" && (
                  <Avatar size="sm" name="Owner" bg="blue.500" />
                )}
                <Box
                  bg={message.sender === "user" ? "blue.400" : "gray.200"}
                  color={message.sender === "user" ? "white" : "black"}
                  p={3}
                  borderRadius="md"
                  maxW="80%"
                >
                  <Text>{message.text}</Text>
                </Box>
                {message.sender === "user" && <Spacer />}
              </HStack>
            ))}
          </VStack>
        </Flex>

        {/* Message Input Area */}
        <Box p={4} bg="white" borderTopWidth="1px">
          <Flex>
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              mr={2}
            />
            <Button colorScheme="blue" onClick={handleSendMessage}>
              Send
            </Button>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
}
