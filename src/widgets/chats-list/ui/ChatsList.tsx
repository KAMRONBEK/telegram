import { useTheme } from '@shopify/restyle';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Platform } from 'react-native';

import { useGetChatsQuery } from '@/entities/chat';
import { useColorScheme } from '@/shared/lib/hooks';
import { ChatListContextMenu, type ChatListMenuAction } from '@/shared/ui/chat-list-context-menu';
import { ListRowSeparator } from '@/shared/ui/list-row-separator';
import { Box, Text, type Theme } from '@/shared/ui/restyle';

import { ChatListRow } from './ChatListRow';
import { ChatPeekOverlay } from './ChatPeekOverlay';

export type ChatsListProps = {
  /** When set, called instead of navigating to `/chat/[id]` (e.g. wide web split). */
  onChatPress?: (chatId: string) => void;
  /** Highlights the active row (split layout). */
  selectedChatId?: string | null;
  /** Filters the list by title / last message (client-side). */
  searchQuery?: string;
  /** Chat row context menu (long-press / right-click). */
  onMenuAction?: (action: ChatListMenuAction, chatId: string) => void;
};

export function ChatsList({
  onChatPress,
  selectedChatId,
  searchQuery = '',
  onMenuAction,
}: ChatsListProps) {
  const router = useRouter();
  const scheme = useColorScheme();
  const { colors } = useTheme<Theme>();
  const { data, isLoading, isError } = useGetChatsQuery();
  const [menu, setMenu] = useState<null | { chatId: string; anchor: { x: number; y: number } }>(
    null
  );
  const [peekChatId, setPeekChatId] = useState<string | null>(null);

  const rows = useMemo(() => {
    if (!data) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (c) => c.title.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q)
    );
  }, [data, searchQuery]);

  const handlePress = (id: string) => {
    if (onChatPress) {
      onChatPress(id);
    } else {
      router.push(`/chat/${id}`);
    }
  };

  if (isLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="chatListScreenBg">
        <ActivityIndicator color={colors.tint} />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="chatListScreenBg">
        <Text color="textSecondary">Could not load chats</Text>
      </Box>
    );
  }

  return (
    <>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        style={{ backgroundColor: colors.chatListScreenBg }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 8 }}
        ListHeaderComponent={
          rows.length > 0 ? (
            <Text variant="sectionLabel" paddingHorizontal="lg" paddingTop="sm" paddingBottom="xs">
              All chats
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <Box flex={1} paddingTop="2xl" alignItems="center">
            <Text color="textSecondary">No chats found</Text>
          </Box>
        }
        ItemSeparatorComponent={() => <ListRowSeparator insetLeft={80} />}
        renderItem={({ item }) => (
          <ChatListRow
            chat={item}
            selected={item.id === selectedChatId}
            onPress={() => handlePress(item.id)}
            onOpenMenu={(anchor) => setMenu({ chatId: item.id, anchor })}
            onPeekOpen={() => setPeekChatId(item.id)}
            onPeekClose={() => setPeekChatId(null)}
          />
        )}
      />
      {menu !== null ? (
        <ChatListContextMenu
          visible
          onClose={() => setMenu(null)}
          anchor={menu.anchor}
          scheme={scheme}
          chatId={menu.chatId}
          onMenuAction={onMenuAction}
        />
      ) : null}
      {peekChatId !== null && Platform.OS !== 'web' ? (
        <ChatPeekOverlay visible chatId={peekChatId} scheme={scheme} />
      ) : null}
    </>
  );
}
