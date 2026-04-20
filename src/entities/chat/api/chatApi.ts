import { baseApi } from '@/shared/api/baseApi';

import type { Chat } from '../model/types';

const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    title: 'Team',
    lastMessage: 'See you at standup',
    time: '10:42',
    unread: 2,
    readReceipt: false,
  },
  {
    id: '2',
    title: 'Alex',
    lastMessage: 'Sent a photo',
    time: 'Yesterday',
    unread: 0,
    readReceipt: true,
  },
];

export const chatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getChats: build.query<Chat[], void>({
      async queryFn() {
        await new Promise((r) => setTimeout(r, 120));
        return { data: MOCK_CHATS };
      },
      providesTags: ['Chat'],
    }),
  }),
});

export const { useGetChatsQuery } = chatApi;
