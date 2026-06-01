import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Input,
  IconButton,
  Icon,
  Flex,
  Tooltip,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { FiSend, FiPaperclip, FiImage, FiMoreVertical, FiCalendar, FiHome } from 'react-icons/fi';
import { format, isToday, isYesterday } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import useChatStore from '../../../shared/stores/useChatStore';

/**
 * Chat Window Component
 * 
 * Displays messages and input for active conversation
 * Features: Message bubbles, typing indicator, quick actions
 * 
 * @component
 */
const ChatWindow = ({ conversation, user }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const messagesEndRef = useRef(null);
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const { getMessages, sendMessage, isUserTyping, setTyping } = useChatStore();
  const messages = getMessages(conversation.id);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle typing indicator
  useEffect(() => {
    if (messageText) {
      setTyping(conversation.id, user.id, true);
      const timeout = setTimeout(() => {
        setTyping(conversation.id, user.id, false);
      }, 3000);
      return () => clearTimeout(timeout);
    } else {
      setTyping(conversation.id, user.id, false);
    }
  }, [messageText, conversation.id, user.id, setTyping]);

  // Handle send message
  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      await sendMessage(
        conversation.id,
        user.id,
        user.name,
        user.role,
        messageText.trim()
      );
      setMessageText('');
    } catch (error) {
      toast({
        title: 'Failed to send message',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format message time
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };

  // Handle quick actions
  const handleScheduleVisit = () => {
    navigate(`/schedule-visit/${conversation.propertyId}`);
  };

  const handleBookNow = () => {
    navigate(`/booking/${conversation.propertyId}`);
  };

  const handleViewProperty = () => {
    navigate(`/listing/${conversation.propertyId}`);
  };

  const handleAttachment = () => {
    toast({
      title: 'Coming Soon',
      description: 'File attachments will be available soon',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleImageUpload = () => {
    toast({
      title: 'Coming Soon',
      description: 'Image sharing will be available soon',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const typingIndicator = isUserTyping(conversation.id);

  return (
    <Flex direction="column" h="full">
      {/* Header */}
      <HStack
        p={4}
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        justify="space-between"
      >
        <HStack spacing={3}>
          <Avatar size="sm" name={conversation.ownerName} bg="primary.500" />
          <VStack align="start" spacing={0}>
            <Text fontWeight="600" fontSize="sm">
              {conversation.propertyName}
            </Text>
            <Text fontSize="xs" color="gray.600">
              {conversation.ownerName}
            </Text>
          </VStack>
        </HStack>

        {/* Quick Actions Menu */}
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<Icon as={FiMoreVertical} />}
            variant="ghost"
            size="sm"
          />
          <MenuList>
            <MenuItem icon={<Icon as={FiHome} />} onClick={handleViewProperty}>
              View Property
            </MenuItem>
            <MenuItem icon={<Icon as={FiCalendar} />} onClick={handleScheduleVisit}>
              Schedule Visit
            </MenuItem>
            <MenuItem icon={<Icon as={FiHome} />} onClick={handleBookNow}>
              Book Now
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      {/* Messages */}
      <Box flex={1} overflowY="auto" p={4} bg="gray.50">
        <VStack spacing={4} align="stretch">
          {messages.length === 0 ? (
            <VStack py={8} spacing={2}>
              <Text color="gray.500" fontSize="sm" textAlign="center">
                Start the conversation by sending a message
              </Text>
            </VStack>
          ) : (
            messages.map((message) => {
              const isOwn = message.senderId === user.id;
              return (
                <Flex
                  key={message.id}
                  justify={isOwn ? 'flex-end' : 'flex-start'}
                >
                  <Box maxW="70%">
                    {!isOwn && (
                      <Text fontSize="xs" color="gray.600" mb={1} ml={2}>
                        {message.senderName}
                      </Text>
                    )}
                    <Box
                      bg={isOwn ? 'primary.500' : 'white'}
                      color={isOwn ? 'white' : 'gray.900'}
                      px={4}
                      py={3}
                      borderRadius="8px"
                      boxShadow="sm"
                    >
                      <Text fontSize="sm" whiteSpace="pre-wrap">
                        {message.message}
                      </Text>
                      <Text
                        fontSize="xs"
                        color={isOwn ? 'whiteAlpha.800' : 'gray.500'}
                        mt={1}
                        textAlign="right"
                      >
                        {formatMessageTime(message.timestamp)}
                      </Text>
                    </Box>
                  </Box>
                </Flex>
              );
            })
          )}

          {/* Typing Indicator */}
          {typingIndicator && (
            <Flex justify="flex-start">
              <Box bg="white" px={4} py={3} borderRadius="8px" boxShadow="sm">
                <HStack spacing={1}>
                  <Box
                    w="8px"
                    h="8px"
                    bg="gray.400"
                    borderRadius="full"
                    animation="bounce 1.4s infinite ease-in-out"
                  />
                  <Box
                    w="8px"
                    h="8px"
                    bg="gray.400"
                    borderRadius="full"
                    animation="bounce 1.4s infinite ease-in-out 0.2s"
                  />
                  <Box
                    w="8px"
                    h="8px"
                    bg="gray.400"
                    borderRadius="full"
                    animation="bounce 1.4s infinite ease-in-out 0.4s"
                  />
                </HStack>
              </Box>
            </Flex>
          )}

          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      {/* Input */}
      <Box p={4} bg="white" borderTop="1px" borderColor="gray.200">
        <HStack spacing={2}>
          <Tooltip label="Attach file">
            <IconButton
              icon={<Icon as={FiPaperclip} />}
              variant="ghost"
              size="sm"
              onClick={handleAttachment}
            />
          </Tooltip>
          <Tooltip label="Send image">
            <IconButton
              icon={<Icon as={FiImage} />}
              variant="ghost"
              size="sm"
              onClick={handleImageUpload}
            />
          </Tooltip>
          <Input
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            borderRadius="8px"
            bg="gray.50"
            border="1px"
            borderColor="gray.200"
            _focus={{
              borderColor: 'primary.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
              bg: 'white',
            }}
          />
          <IconButton
            icon={<Icon as={FiSend} />}
            colorScheme="primary"
            onClick={handleSendMessage}
            isDisabled={!messageText.trim()}
            borderRadius="8px"
          />
        </HStack>
      </Box>

      {/* Typing Animation CSS */}
      <style>
        {`
          @keyframes bounce {
            0%, 60%, 100% {
              transform: translateY(0);
            }
            30% {
              transform: translateY(-10px);
            }
          }
        `}
      </style>
    </Flex>
  );
};

export default ChatWindow;
