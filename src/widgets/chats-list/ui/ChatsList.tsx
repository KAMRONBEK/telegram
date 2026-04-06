import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import type { GestureResponderEvent } from 'react-native';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LongPressGestureHandler, State } from 'react-native-gesture-handler';

import type { Chat } from '@/entities/chat';
import { useGetChatsQuery } from '@/entities/chat';
import { appTheme } from '@/shared/config/theme';
import { useColorScheme } from '@/shared/lib/hooks';
import {
  ChatListContextMenu,
  type ChatListMenuAction,
} from '@/shared/ui/chat-list-context-menu';

import { ChatPeekOverlay } from './ChatPeekOverlay';

const AVATAR_COLORS = ['#5B9BD5', '#70B477', '#9B7ED9', '#E67A7A', '#D4A35B', '#5C9EAD', '#4A90D9'];

function avatarColor(title: string): string {
  let h = 0;
  for (let i = 0; i < title.length; i++) {
    h = title.charCodeAt(i) + ((h << 5) - h);
  }
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

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
  const t = appTheme[scheme];
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
      (c) =>
        c.title.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q)
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
      <View style={[styles.center, { backgroundColor: t.chatListScreenBg }]}>
        <ActivityIndicator color={t.tint} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={[styles.center, { backgroundColor: t.chatListScreenBg }]}>
        <Text style={{ color: t.textSecondary }}>Could not load chats</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { backgroundColor: t.chatListScreenBg },
          rows.length === 0 ? styles.listEmpty : undefined,
        ]}
        ListHeaderComponent={
          rows.length > 0 ? (
            <Text style={[styles.sectionLabel, { color: t.textSecondary }]}>All chats</Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={[styles.emptyText, { color: t.textSecondary }]}>No chats found</Text>
          </View>
        }
        ItemSeparatorComponent={() => (
          <View style={[styles.separatorInset, { backgroundColor: t.chatListRow }]}>
            <View style={[styles.separatorLine, { borderBottomColor: t.rowSeparator }]} />
          </View>
        )}
        renderItem={({ item }) => (
          <ChatRow
            chat={item}
            scheme={scheme}
            avatarBg={avatarColor(item.title)}
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
      {peekChatId !== null ? (
        <ChatPeekOverlay visible chatId={peekChatId} scheme={scheme} />
      ) : null}
    </>
  );
}

function extractWebContextMenuCoords(e: unknown): { x: number; y: number } {
  const ev = e as {
    nativeEvent?: {
      pageX?: number;
      pageY?: number;
      clientX?: number;
      clientY?: number;
    };
    pageX?: number;
    pageY?: number;
  };
  if (typeof ev.pageX === 'number' && typeof ev.pageY === 'number') {
    return { x: ev.pageX, y: ev.pageY };
  }
  const ne = ev.nativeEvent;
  if (ne && typeof ne.pageX === 'number' && typeof ne.pageY === 'number') {
    return { x: ne.pageX, y: ne.pageY };
  }
  if (ne && typeof ne.clientX === 'number' && typeof ne.clientY === 'number') {
    if (typeof window !== 'undefined') {
      return { x: ne.clientX + window.scrollX, y: ne.clientY + window.scrollY };
    }
    return { x: ne.clientX, y: ne.clientY };
  }
  return { x: 0, y: 0 };
}

function ChatRow({
  chat,
  onPress,
  onOpenMenu,
  onPeekOpen,
  onPeekClose,
  scheme,
  avatarBg,
  selected,
}: {
  chat: Chat;
  onPress: () => void;
  onOpenMenu: (anchor: { x: number; y: number }) => void;
  onPeekOpen: () => void;
  onPeekClose: () => void;
  scheme: 'light' | 'dark';
  avatarBg: string;
  selected: boolean;
}) {
  const t = appTheme[scheme];
  const bg = selected ? t.listItemActive : t.chatListRow;
  const bodyRef = useRef<View>(null);
  const skipNextAvatarTap = useRef(false);

  const openFromLongPress = (e: GestureResponderEvent) => {
    const { pageX, pageY } = e.nativeEvent;
    if (Platform.OS !== 'web' && pageX === 0 && pageY === 0) {
      bodyRef.current?.measureInWindow((left, top, width, height) => {
        onOpenMenu({ x: left + width / 2, y: top + height / 2 });
      });
      return;
    }
    onOpenMenu({ x: pageX, y: pageY });
  };

  const webRowContextMenu =
    Platform.OS === 'web'
      ? {
          onContextMenu: (e: unknown) => {
            (e as { preventDefault?: () => void }).preventDefault?.();
            onOpenMenu(extractWebContextMenuCoords(e));
          },
        }
      : {};

  const bodyLongPressProps =
    Platform.OS === 'web'
      ? {}
      : {
          onLongPress: openFromLongPress,
          delayLongPress: 450 as const,
        };

  const onAvatarPeekStateChange = (state: number) => {
    if (state === State.ACTIVE) {
      skipNextAvatarTap.current = true;
      onPeekOpen();
    }
    if (state === State.END || state === State.CANCELLED || state === State.FAILED) {
      onPeekClose();
    }
  };

  const avatarLetter = chat.title.slice(0, 1).toUpperCase();

  const avatarVisual = (
    <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
      <Text style={styles.avatarText}>{avatarLetter}</Text>
    </View>
  );

  const avatarNode =
    Platform.OS === 'web' ? (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Chat ${chat.title}`}
        onPress={onPress}
        style={({ pressed }) => [pressed && { opacity: 0.88 }]}>
        {avatarVisual}
      </Pressable>
    ) : (
      <LongPressGestureHandler
        minDurationMs={350}
        onHandlerStateChange={(e) => onAvatarPeekStateChange(e.nativeEvent.state)}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Chat ${chat.title}`}
          onPress={() => {
            if (skipNextAvatarTap.current) {
              skipNextAvatarTap.current = false;
              return;
            }
            onPress();
          }}
          style={({ pressed }) => [pressed && { opacity: 0.88 }]}>
          {avatarVisual}
        </Pressable>
      </LongPressGestureHandler>
    );

  return (
    <View collapsable={false} style={styles.rowOuter} {...webRowContextMenu}>
      <View style={[styles.row, { backgroundColor: bg }]}>
        {avatarNode}
        <Pressable
          ref={bodyRef}
          collapsable={false}
          accessibilityRole="button"
          accessibilityLabel={`Chat ${chat.title}`}
          onPress={onPress}
          {...bodyLongPressProps}
          style={({ pressed }) => [
            styles.rowBodyPressable,
            {
              backgroundColor: pressed ? t.chatListRowPressed : 'transparent',
            },
          ]}>
          <View style={styles.rowBody}>
            <View style={styles.rowTop}>
              <Text style={[styles.title, { color: t.textPrimary }]} numberOfLines={1}>
                {chat.title}
              </Text>
              <Text style={[styles.time, { color: t.messageTime }]}>{chat.time}</Text>
            </View>
            <View style={styles.rowBottom}>
              <Text style={[styles.preview, { color: t.textSecondary }]} numberOfLines={1}>
                {chat.lastMessage}
              </Text>
              {chat.unread > 0 ? (
                <View style={[styles.badge, { backgroundColor: t.badgeUnread }]}>
                  <Text style={[styles.badgeText, { color: t.badgeText }]}>{chat.unread}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { flexGrow: 1, paddingBottom: 8 },
  listEmpty: { flexGrow: 1 },
  sectionLabel: { fontSize: 15, fontWeight: '500', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  emptyWrap: { paddingTop: 48, alignItems: 'center' },
  emptyText: { fontSize: 16 },
  rowOuter: {
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    paddingLeft: 12,
    paddingRight: 12,
    paddingVertical: 9,
    minHeight: 72,
    alignItems: 'center',
  },
  rowBodyPressable: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    minHeight: 56,
  },
  separatorInset: {
    paddingLeft: 80,
  },
  separatorLine: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: '600' },
  rowBody: { flex: 1, justifyContent: 'center', minHeight: 56 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 },
  title: { fontSize: 17, fontWeight: '500', flex: 1, marginRight: 8 },
  time: { fontSize: 15 },
  rowBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  preview: { fontSize: 16, flex: 1, marginRight: 8, fontWeight: '400' },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 13, fontWeight: '600' },
});
