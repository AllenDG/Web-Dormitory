import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  useBreakpointValue,
  Button,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiMessageSquare, FiArrowLeft } from 'react-icons/fi';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import useChatStore from '../../shared/stores/useChatStore';
import { useAuth } from '../../app/providers/AuthProvider';

/**
 * Chat Page
 * 
 * Main chat interface with conversation list and message window
 * Responsive: Side-by-side on desktop, stacked on mobile
 * 
 * Features:
 * - Conversation list
 * - Message window
 * - Real-time updates (mock)
 * - Mobile responsive
 * 
 * @component
 */
const ChatPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    getActiveConversation,
  } = useChatStore();

  const [showChatWindow, setShowChatWindow] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Handle conversation selection from URL
  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    if (conversationId) {
      setActiveConversation(conversationId);
      setShowChatWindow(true);
    }
  }, [searchParams, setActiveConversation]);

  // Handle conversation selection
  const handleSelectConversation = (conversationId) => {
    setActiveConversation(conversationId);
    if (isMobile) {
      setShowChatWindow(true);
    }
  };

  // Handle back to list (mobile)
  const handleBackToList = () => {
    setShowChatWindow(false);
    setActiveConversation(null);
  };

  const activeConversation = getActiveConversation();

  // Empty state
  if (conversations.length === 0) {
    return (
      <Box bg="gray.50" minH="calc(100vh - 64px)" py={8}>
        <Container maxW="1200px">
          <VStack spacing={8} py={20}>
            <Icon as={FiMessageSquare} boxSize={20} color="gray.300" />
            <VStack spacing={2}>
              <Heading size="lg" color="gray.700">
                No Conversations Yet
              </Heading>
              <Text color="gray.600" textAlign="center" maxW="500px">
                Start chatting with property owners by visiting a property and clicking "Chat
                with Owner"
              </Text>
            </VStack>
            <Button
              colorScheme="primary"
              size="lg"
              onClick={() => navigate('/find-rentals')}
              borderRadius="8px"
            >
              Browse Properties
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)">
      <Container maxW="1400px" p={0}>
        {/* Desktop Layout */}
        {!isMobile && (
          <Grid templateColumns="350px 1fr" h="calc(100vh - 64px)">
            {/* Conversation List */}
            <GridItem bg="white" borderRight="1px" borderColor="gray.200">
              <ChatList
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={handleSelectConversation}
              />
            </GridItem>

            {/* Chat Window */}
            <GridItem bg="gray.50">
              {activeConversation ? (
                <ChatWindow conversation={activeConversation} user={user} />
              ) : (
                <VStack h="full" justify="center" spacing={4}>
                  <Icon as={FiMessageSquare} boxSize={16} color="gray.300" />
                  <VStack spacing={1}>
                    <Heading size="md" color="gray.600">
                      Select a Conversation
                    </Heading>
                    <Text color="gray.500" fontSize="sm">
                      Choose a conversation from the list to start chatting
                    </Text>
                  </VStack>
                </VStack>
              )}
            </GridItem>
          </Grid>
        )}

        {/* Mobile Layout */}
        {isMobile && (
          <Box h="calc(100vh - 64px)">
            {!showChatWindow ? (
              <Box bg="white" h="full">
                <ChatList
                  conversations={conversations}
                  activeConversationId={activeConversationId}
                  onSelectConversation={handleSelectConversation}
                />
              </Box>
            ) : (
              <Box bg="gray.50" h="full">
                {activeConversation && (
                  <>
                    {/* Mobile Header */}
                    <HStack
                      bg="white"
                      p={4}
                      borderBottom="1px"
                      borderColor="gray.200"
                      spacing={3}
                    >
                      <Icon
                        as={FiArrowLeft}
                        boxSize={5}
                        cursor="pointer"
                        onClick={handleBackToList}
                      />
                      <VStack align="start" spacing={0} flex={1}>
                        <Text fontWeight="600" fontSize="sm">
                          {activeConversation.propertyName}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          {activeConversation.ownerName}
                        </Text>
                      </VStack>
                    </HStack>

                    {/* Chat Window */}
                    <Box h="calc(100% - 73px)">
                      <ChatWindow conversation={activeConversation} user={user} />
                    </Box>
                  </>
                )}
              </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ChatPage;
