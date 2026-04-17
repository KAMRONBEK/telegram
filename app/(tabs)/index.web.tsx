import { useLocalSearchParams } from 'expo-router';

import { ChatsListPage } from '@/pages/chats-list-page';
import { useBreakpoint } from '@/shared/lib/hooks';

export default function ChatsRoute() {
  const { chatId } = useLocalSearchParams<{ chatId?: string }>();
  const { isWideWeb } = useBreakpoint();

  return (
    <ChatsListPage
      splitMode={isWideWeb}
      splitChatId={chatId ? String(chatId) : null}
      searchPlaceholder="Search for messages or users"
      searchInputPaddingVertical={4}
    />
  );
}
