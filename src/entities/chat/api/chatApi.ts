import { baseApi } from '@/shared/api/baseApi';

import type { Chat } from '../model/types';

const MOCK_CHATS: Chat[] = [
  {
    id: 'saved',
    savedMessages: true,
    title: 'Saved Messages',
    lastMessage: 'image.jpeg',
    time: 'Fri',
    unread: 0,
    readReceipt: false,
    muted: false,
  },
  {
    id: '1',
    title: 'Team',
    subtitle: '3 members, 2 online',
    lastMessage: 'See you at standup',
    time: '10:42',
    unread: 2,
    readReceipt: false,
    muted: true,
  },
  {
    id: '2',
    title: 'Alex',
    subtitle: 'last seen just now',
    lastMessage: 'Sent a photo',
    time: 'Yesterday',
    unread: 0,
    readReceipt: true,
    muted: false,
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
