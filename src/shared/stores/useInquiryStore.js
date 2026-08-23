import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import inquiriesData from '../../data/inquiries.json';
import useNotificationStore from './useNotificationStore';

/**
 * Inquiry Store using Zustand
 * Manages tenant-to-owner property inquiries (SendInquiryModal -> owner's
 * TenantsPage). Kept separate from useNotificationStore since inquiries are
 * a stateful conversation thread (new/replied/closed) rather than a simple
 * read/unread event.
 */

const useInquiryStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        inquiries: inquiriesData,

        // Actions
        addInquiry: (inquiry) => {
          const newInquiry = {
            id: crypto.randomUUID(),
            ...inquiry,
            status: 'new',
            createdAt: new Date().toISOString(),
          };

          set((state) => ({
            inquiries: [newInquiry, ...state.inquiries],
          }));

          if (inquiry.ownerEmail) {
            useNotificationStore.getState().addNotification({
              recipientEmail: inquiry.ownerEmail,
              type: 'message',
              title: 'New Inquiry',
              message: `${inquiry.tenantName} sent an inquiry about ${inquiry.propertyTitle || 'your property'}.`,
              actionUrl: '/owner/tenants',
            });
          }

          return newInquiry;
        },

        replyToInquiry: (id, replyMessage) => {
          set((state) => ({
            inquiries: state.inquiries.map((inquiry) =>
              inquiry.id === id
                ? {
                    ...inquiry,
                    status: 'replied',
                    replyMessage,
                    repliedAt: new Date().toISOString(),
                  }
                : inquiry
            ),
          }));

          const inquiry = get().inquiries.find((i) => i.id === id);
          if (inquiry?.tenantEmail) {
            useNotificationStore.getState().addNotification({
              recipientEmail: inquiry.tenantEmail,
              type: 'message',
              title: 'Owner Replied',
              message: `You have a reply about ${inquiry.propertyTitle || 'your inquiry'}.`,
              actionUrl: '/messages',
            });
          }
        },

        closeInquiry: (id) =>
          set((state) => ({
            inquiries: state.inquiries.map((inquiry) =>
              inquiry.id === id ? { ...inquiry, status: 'closed', closedAt: new Date().toISOString() } : inquiry
            ),
          })),

        getInquiriesByOwner: (ownerEmail) => {
          const { inquiries } = get();
          return inquiries.filter((inquiry) => inquiry.ownerEmail === ownerEmail);
        },
      }),
      {
        name: 'inquiry-storage',
        partialize: (state) => ({
          inquiries: state.inquiries,
        }),
      }
    ),
    { name: 'InquiryStore' }
  )
);

export default useInquiryStore;
