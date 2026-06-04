import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Heading,
  Divider,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiSearch, FiMessageSquare } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import useChatStore from '../../../shared/stores/useChatStore';

/**
 * Chat List Component
 * 
 * Displays list of conversations with search
 * Shows unread counts and last message preview
 * 
 * @component
 */
const ChatList = ({ conversations, activeConversationId, onSelectConversation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { searchConversations } = useChatStore();

  const filteredConversations = searchQuery
    ? searchConversations(searchQuery)
    : conversations;

  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return '';
    }
  };

  return (
    <VStack spacing={0} align="stretch" h="full">
      {/* Header */}
      <Box p={4} borderBottom="1px" borderColor="gray.200">
        <HStack spacing={3} mb={4}>
          <Icon as={FiMessageSquare} boxSize={6} color="primary.500" />
          <Heading size="md">Messages</Heading>
        </HStack>

        {/* Search */}
        <InputGroup size="md">
          <InputLeftElement>
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
        </InputGroup>
      </Box>

      {/* Conversation List */}
      <Box flex={1} overflowY="auto">
        {filteredConversations.length === 0 ? (
          <VStack py={8} spacing={2}>
            <Icon as={FiMessageSquare} boxSize={12} color="gray.300" />
            <Text color="gray.500" fontSize="sm">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </Text>
          </VStack>
        ) : (
          <VStack spacing={0} align="stretch">
            {filteredConversations.map((conversation, index) => (
              <Box key={conversation.id}>
                <HStack
                  p={4}
                  spacing={3}
                  cursor="pointer"
                  bg={
                    activeConversationId === conversation.id
                      ? 'primary.50'
                      : 'transparent'
                  }
                  _hover={{ bg: 'gray.50' }}
                  onClick={() => onSelectConversation(conversation.id)}
                  transition="all 0.2s"
                  position="relative"
                >
                  {/* Avatar */}
                  <Avatar
                    size="md"
                    name={conversation.ownerName}
                    bg="primary.500"
                  />

                  {/* Content */}
                  <VStack align="start" spacing={1} flex={1} minW={0}>
                    <HStack justify="space-between" w="full">
                      <Text
                        fontWeight="600"
                        fontSize="sm"
                        noOfLines={1}
                        color={
                          activeConversationId === conversation.id
                            ? 'primary.600'
                            : 'gray.900'
                        }
                      >
                        {conversation.propertyName}
                      </Text>
                      {conversation.lastMessageTime && (
                        <Text fontSize="xs" color="gray.500" flexShrink={0}>
                          {formatTime(conversation.lastMessageTime)}
                        </Text>
                      )}
                    </HStack>

                    <Text fontSize="xs" color="gray.600" noOfLines={1}>
                      {conversation.ownerName}
                    </Text>

                    <HStack justify="space-between" w="full">
                      <Text
                        fontSize="sm"
                        color="gray.600"
                        noOfLines={1}
                        flex={1}
                      >
                        {conversation.lastMessage || 'No messages yet'}
                      </Text>
                      {conversation.unreadCount > 0 && (
                        <Badge
                          colorScheme="red"
                          borderRadius="full"
                          px={2}
                          fontSize="xs"
                        >
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </HStack>
                  </VStack>
                </HStack>
                {index < filteredConversations.length - 1 && <Divider />}
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </VStack>
  );
};

export default ChatList;
