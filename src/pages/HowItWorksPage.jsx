import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

// Simple chatbot logic using string literals
function chatbotResponse(userInput) {
  const lowerCaseInput = userInput.toLowerCase();

  const responses = {
    "hello": "Hi there! How can I assist you today?",
    "how are you?": "I'm just a bunch of code, but I'm doing great! How about you?",
    "what is your name?": "I'm ChatBot 1.0, your virtual assistant.",
    "thank you": "You're welcome! Is there anything else I can help you with?",
    "bye": "Goodbye! Have a great day!",
  };

  return responses[lowerCaseInput] || "I'm sorry, I don't understand that. Can you please ask something else?";
}

// Chatbot UI component
export default function HowItWorksPage() {
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");

  const [messages, setMessages] = useState([]); // To store chat messages
  const [inputValue, setInputValue] = useState(""); // To store the current input

  // Handle message submission
  const handleSendMessage = () => {
    if (!inputValue.trim()) return; // Don't send empty messages

    const userMessage = { text: inputValue, sender: "user" };
    const botResponse = { text: chatbotResponse(inputValue), sender: "bot" };

    // Add the user's message and bot's response to the messages state
    setMessages([...messages, userMessage, botResponse]);
    setInputValue(""); // Clear the input field
  };

  return (
    <Flex
      direction="column"
      minH="100vh"
      justify="center"
      align="center"
      bg={bgColor}
      px={4}
    >
      {/* Chat Box */}
      <Box
        width="100%"
        maxW="500px"
        bg={useColorModeValue("white", "gray.800")}
        borderRadius="lg"
        boxShadow="lg"
        p={6}
      >
        <VStack spacing={4} align="stretch">
          {/* Display chat messages */}
          <Box
            height="300px"
            overflowY="scroll"
            bg={useColorModeValue("gray.50", "gray.700")}
            p={4}
            borderRadius="md"
          >
            {messages.length === 0 && (
              <Text color={textColor} textAlign="center">
                Start the conversation with the chatbot!
              </Text>
            )}
            {messages.map((msg, index) => (
              <Text
                key={index}
                alignSelf={msg.sender === "user" ? "flex-end" : "flex-start"}
                bg={msg.sender === "user" ? "teal.500" : "gray.500"}
                color="white"
                borderRadius="md"
                p={3}
                mb={2}
                maxWidth="80%"
              >
                {msg.text}
              </Text>
            ))}
          </Box>

          {/* Input and Send Button */}
          <Flex>
            <Input
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              flex="1"
              mr={2}
            />
            <Button onClick={handleSendMessage} colorScheme="teal">
              Send
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Flex>
  );
}
