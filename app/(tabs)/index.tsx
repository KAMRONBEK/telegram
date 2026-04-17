import { useLocalSearchParams } from 'expo-router';

import { ChatsListPage } from '@/pages/chats-list-page';

export default function ChatsRoute() {
  const { chatId } = useLocalSearchParams<{ chatId?: string }>();

  return (
    <ChatsListPage
      splitMode={false}
      splitChatId={chatId ? String(chatId) : null}
      searchPlaceholder="Search for messages or users"
    />
  );
}
