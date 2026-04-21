import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useGetChatsQuery } from '@/entities/chat';
import { appTheme } from '@/shared/config/theme';
import { useColorScheme } from '@/shared/lib/hooks';
import { MessageList } from '@/widgets/message-list';

import { ChatPeekHeader } from './ChatPeekHeader';

type Props = {
  chatId: string;
};

/** Read-only chat chrome + messages (no composer). Used by chat peek overlay and ChatPage peek mode. */
export function ChatPeekShell({ chatId }: Props) {
  const scheme = useColorScheme();
  const t = appTheme[scheme];
  const { data: chats } = useGetChatsQuery();
  const chat = useMemo(() => chats?.find((c) => c.id === chatId), [chats, chatId]);

  return (
    <View style={[styles.root, { backgroundColor: t.chatWallpaper }]}>
      <ChatPeekHeader
        title={chat?.title ?? 'Chat'}
        subtitle={chat?.subtitle}
        savedMessages={chat?.savedMessages}
      />
      <View style={styles.flex}>
        <MessageList chatId={chatId} scrollEnabled={false} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
});
