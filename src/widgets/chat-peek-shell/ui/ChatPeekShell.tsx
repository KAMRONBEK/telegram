import { useMemo } from 'react';

import { useGetChatsQuery } from '@/entities/chat';
import { Box } from '@/shared/ui/restyle';
import { MessageList } from '@/widgets/message-list';

import { ChatPeekHeader } from './ChatPeekHeader';

type Props = {
  chatId: string;
};

/** Read-only chat chrome + messages (no composer). Used by chat peek overlay and ChatPage peek mode. */
export function ChatPeekShell({ chatId }: Props) {
  const { data: chats } = useGetChatsQuery();
  const chat = useMemo(() => chats?.find((c) => c.id === chatId), [chats, chatId]);

  return (
    <Box flex={1} backgroundColor="chatWallpaper">
      <ChatPeekHeader
        title={chat?.title ?? 'Chat'}
        subtitle={chat?.subtitle}
        savedMessages={chat?.savedMessages}
      />
      <Box flex={1}>
        <MessageList chatId={chatId} />
      </Box>
    </Box>
  );
}
