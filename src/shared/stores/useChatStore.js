import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Chat Store
 * 
 * Manages chat conversations and messages
 * Uses Zustand for state management with persistence
 * 
 * Features:
 * - Conversation management
 * - Message history
 * - Unread counts
 * - Typing indicators
 * - Real-time updates (mock for now, Socket.IO ready)
 * 
 * @store
 */

// Mock data for development
const MOCK_CONVERSATIONS = [
  {
    id: '1',
    propertyId: '1',
    propertyName: 'Cozy Studio near University',
    ownerId: '2',
    ownerName: 'Maria Santos',
    ownerAvatar: null,
    tenantId: '1',
    tenantName: 'Juan Dela Cruz',
    tenantAvatar: null,
    lastMessage: 'Is the room still available?',
    lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
    unreadCount: 0,
    status: 'active',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const MOCK_MESSAGES = {
  '1': [
    {
      id: 'm1',
      conversationId: '1',
      senderId: '1',
      senderName: 'Juan Dela Cruz',
      senderRole: 'tenant',
      message: 'Hi! I\'m interested in this property.',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true,
      type: 'text',
    },
    {
      id: 'm2',
      conversationId: '1',
      senderId: '2',
      senderName: 'Maria Santos',
      senderRole: 'owner',
      message: 'Hello! Thank you for your interest. How can I help you?',
      timestamp: new Date(Date.now() - 5400000).toISOString(),
      read: true,
      type: 'text',
    },
    {
      id: 'm3',
      conversationId: '1',
      senderId: '1',
      senderName: 'Juan Dela Cruz',
      senderRole: 'tenant',
      message: 'Is the room still available?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true,
      type: 'text',
    },
  ],
};

const useChatStore = create(
  persist(
    (set, get) => ({
      // State
      conversations: MOCK_CONVERSATIONS,
      messages: MOCK_MESSAGES,
      activeConversationId: null,
      unreadCount: 0,
      typingUsers: {},
      isLoading: false,
      error: null,

      // Actions

      /**
       * Get all conversations for current user
       */
      getConversations: () => {
        return get().conversations;
      },

      /**
       * Get messages for a specific conversation
       */
      getMessages: (conversationId) => {
        return get().messages[conversationId] || [];
      },

      /**
       * Get active conversation
       */
      getActiveConversation: () => {
        const { conversations, activeConversationId } = get();
        return conversations.find((c) => c.id === activeConversationId);
      },

      /**
       * Set active conversation
       */
      setActiveConversation: (conversationId) => {
        set({ activeConversationId: conversationId });
        
        // Mark messages as read
        const { markConversationAsRead } = get();
        markConversationAsRead(conversationId);
      },

      /**
       * Create new conversation
       */
      createConversation: async (propertyId, propertyName, ownerId, ownerName, userId, userName) => {
        try {
          set({ isLoading: true, error: null });

          // Check if conversation already exists
          const { conversations } = get();
          const existing = conversations.find(
            (c) => c.propertyId === propertyId && c.tenantId === userId
          );

          if (existing) {
            set({ activeConversationId: existing.id, isLoading: false });
            return existing;
          }

          // Create new conversation
          const newConversation = {
            id: `conv_${Date.now()}`,
            propertyId,
            propertyName,
            ownerId,
            ownerName,
            ownerAvatar: null,
            tenantId: userId,
            tenantName: userName,
            tenantAvatar: null,
            lastMessage: '',
            lastMessageTime: new Date().toISOString(),
            unreadCount: 0,
            status: 'active',
            createdAt: new Date().toISOString(),
          };

          set((state) => ({
            conversations: [newConversation, ...state.conversations],
            messages: { ...state.messages, [newConversation.id]: [] },
            activeConversationId: newConversation.id,
            isLoading: false,
          }));

          return newConversation;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      /**
       * Send message
       */
      sendMessage: async (conversationId, senderId, senderName, senderRole, message, type = 'text') => {
        try {
          set({ isLoading: true, error: null });

          // Mock API delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          const newMessage = {
            id: `msg_${Date.now()}`,
            conversationId,
            senderId,
            senderName,
            senderRole,
            message,
            timestamp: new Date().toISOString(),
            read: false,
            type,
          };

          set((state) => ({
            messages: {
              ...state.messages,
              [conversationId]: [...(state.messages[conversationId] || []), newMessage],
            },
            conversations: state.conversations.map((c) =>
              c.id === conversationId
                ? {
                    ...c,
                    lastMessage: message,
                    lastMessageTime: newMessage.timestamp,
                  }
                : c
            ),
            isLoading: false,
          }));

          return newMessage;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      /**
       * Mark conversation as read
       */
      markConversationAsRead: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, unreadCount: 0 } : c
          ),
          messages: {
            ...state.messages,
            [conversationId]: (state.messages[conversationId] || []).map((m) => ({
              ...m,
              read: true,
            })),
          },
        }));

        // Update total unread count
        get().updateUnreadCount();
      },

      /**
       * Update total unread count
       */
      updateUnreadCount: () => {
        const { conversations } = get();
        const total = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
        set({ unreadCount: total });
      },

      /**
       * Set typing indicator
       */
      setTyping: (conversationId, userId, isTyping) => {
        set((state) => ({
          typingUsers: {
            ...state.typingUsers,
            [conversationId]: isTyping ? userId : null,
          },
        }));
      },

      /**
       * Get typing status
       */
      isUserTyping: (conversationId) => {
        return !!get().typingUsers[conversationId];
      },

      /**
       * Delete conversation
       */
      deleteConversation: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== conversationId),
          messages: {
            ...state.messages,
            [conversationId]: undefined,
          },
          activeConversationId:
            state.activeConversationId === conversationId
              ? null
              : state.activeConversationId,
        }));

        get().updateUnreadCount();
      },

      /**
       * Clear all conversations
       */
      clearConversations: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          unreadCount: 0,
          typingUsers: {},
        });
      },

      /**
       * Search conversations
       */
      searchConversations: (query) => {
        const { conversations } = get();
        if (!query) return conversations;

        const lowerQuery = query.toLowerCase();
        return conversations.filter(
          (c) =>
            c.propertyName.toLowerCase().includes(lowerQuery) ||
            c.ownerName.toLowerCase().includes(lowerQuery) ||
            c.lastMessage.toLowerCase().includes(lowerQuery)
        );
      },

      /**
       * Get conversation by property ID
       */
      getConversationByProperty: (propertyId, userId) => {
        const { conversations } = get();
        return conversations.find(
          (c) => c.propertyId === propertyId && c.tenantId === userId
        );
      },
    }),
    {
      name: 'dormy-chat-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        messages: state.messages,
        unreadCount: state.unreadCount,
      }),
    }
  )
);

export default useChatStore;
