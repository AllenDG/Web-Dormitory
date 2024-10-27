import {
  Box,
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { TbMessageFilled } from "react-icons/tb";
import { chatbotResponses } from "./chatbotResponses";

export default function ChatBot() {
  const textColor = useColorModeValue("#0084FF", "whiteAlpha.900");

  const [messages, setMessages] = useState([]);
  const [questionStep, setQuestionStep] = useState("initial");

  const questionFlow = {
    initial: [
      { text: "Show me available rooms", next: "availableRooms" },
      { text: "Tell me about amenities", next: "amenities" },
    ],
    availableRooms: [
      { text: "Do you have rooms for families?", next: "familyRooms" },
      { text: "Which room is best for long stays?", next: "longStays" },
    ],
    amenities: [
      { text: "Is there free WiFi?", next: "wifi" },
      { text: "Do rooms have kitchens?", next: "kitchens" },
    ],
    familyRooms: [
      { text: "Tell me about the Family Studio Room", next: null },
      { text: "What is the cost for family rooms?", next: null },
    ],
    longStays: [
      { text: "What is the cost for long stays?", next: null },
      { text: "Do you offer discounts for long stays?", next: null },
    ],
    wifi: [
      { text: "Which rooms have free WiFi?", next: null },
      { text: "Is WiFi fast enough for work?", next: null },
    ],
    kitchens: [
      { text: "Which rooms have full kitchens?", next: null },
      { text: "Are there shared kitchens available?", next: null },
    ],
  };

  const handleCardClick = (question, nextStep) => {
    const userMessage = { text: question, sender: "user" };
    const botResponse = { text: chatbotResponses(question), sender: "bot" };

    setMessages((prevMessages) => [...prevMessages, userMessage, botResponse]);

    if (nextStep) {
      setQuestionStep(nextStep);
    } else {
      setQuestionStep("initial");
    }
  };

  return (
    <Box position="fixed" bottom={5} right={5}>
      <Popover placement="top-end">
        <PopoverTrigger>
          <Button>
            <TbMessageFilled />
          </Button>
        </PopoverTrigger>
        <PopoverContent w="100%" maxW={400}>
          <PopoverHeader fontWeight="semibold">Ask Anything?</PopoverHeader>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            <Box
              width="100%"
              maxW="500px"
              bg={useColorModeValue("white", "gray.800")}
              borderRadius="lg"
              boxShadow="lg"
              p={6}
            >
              <VStack spacing={4} align="stretch">
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
                      alignSelf={
                        msg.sender === "user" ? "flex-end" : "flex-start"
                      }
                      bg={msg.sender === "user" ? "#0084FF" : "gray.500"}
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
                <Flex wrap="wrap" justify="space-between" mt={4}>
                  {questionFlow[questionStep].map((question, index) => (
                    <Button
                      key={index}
                      onClick={() =>
                        handleCardClick(question.text, question.next)
                      }
                      variant="outline"
                      mb={2}
                      width="48%"
                      whiteSpace="normal"
                      textAlign="center"
                      p={2}
                      height="auto"
                      maxHeight="80px"
                      lineHeight="1.2"
                      overflow="hidden"
                      bg="#0084FF" // Set background color
                      color="white" // Set text color
                      borderColor="#0084FF" // Set border color to match background
                      _hover={{ bg: "#006bb3", borderColor: "#006bb3" }} // Darker shade on hover
                    >
                      {question.text}
                    </Button>
                  ))}
                </Flex>

                {/* Removed the Input field and Send button */}
              </VStack>
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
}
