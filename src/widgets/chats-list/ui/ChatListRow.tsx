import { useTheme } from '@shopify/restyle';
import { useRef } from 'react';
import type { GestureResponderEvent, View } from 'react-native';
import { Platform, Pressable } from 'react-native';
import { LongPressGestureHandler, State } from 'react-native-gesture-handler';

import type { Chat } from '@/entities/chat';
import { Avatar, avatarColor } from '@/shared/ui/avatar';
import { Box, Text, type Theme } from '@/shared/ui/restyle';

export type ChatListRowProps = {
  chat: Chat;
  selected?: boolean;
  onPress: () => void;
  onOpenMenu: (anchor: { x: number; y: number }) => void;
  onPeekOpen: () => void;
  onPeekClose: () => void;
};

const IDLE_STYLE = { opacity: 1, backgroundColor: undefined } as const;

function buildWebContextMenuProps(
  onOpenMenu: (anchor: { x: number; y: number }) => void,
): Record<string, unknown> {
  if (Platform.OS !== 'web') return {};
  return {
    onContextMenu: (e: unknown) => {
      (e as { preventDefault?: () => void }).preventDefault?.();
      onOpenMenu(extractWebContextMenuCoords(e));
    },
  };
}

export function ChatListRow({
  chat,
  selected = false,
  onPress,
  onOpenMenu,
  onPeekOpen,
  onPeekClose,
}: ChatListRowProps) {
  const { colors } = useTheme<Theme>();
  const rowRef = useRef<View>(null);
  const skipNextTap = useRef(false);
  const isLongPressing = useRef(false);

  const openMenuAtEvent = (e: GestureResponderEvent) => {
    const { pageX, pageY } = e.nativeEvent;
    if (Platform.OS !== 'web' && pageX === 0 && pageY === 0) {
      rowRef.current?.measureInWindow((left, top, width, height) => {
        onOpenMenu({ x: left + width / 2, y: top + height / 2 });
      });
      return;
    }
    onOpenMenu({ x: pageX, y: pageY });
  };

  const onPeekStateChange = (state: number) => {
    if (Platform.OS === 'web') return;
    if (state === State.ACTIVE) {
      skipNextTap.current = true;
      onPeekOpen();
    }
    if (state === State.END || state === State.CANCELLED || state === State.FAILED) {
      onPeekClose();
    }
  };

  const rowContent = (
    <Box
      flexDirection="row"
      paddingHorizontal="md"
      paddingVertical="xs"
      minHeight={72}
      alignItems="center"
      backgroundColor={selected ? 'listItemActive' : 'chatListRow'}
    >
      <Box marginRight="md">
        <Avatar size="large" name={chat.title} backgroundColor={avatarColor(chat.title)} />
      </Box>
      <Box flex={1} justifyContent="center" minHeight={56}>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="baseline"
          marginBottom="xxs"
        >
          <Text variant="chatRowTitle" numberOfLines={1} flex={1} marginRight="sm">
            {chat.title}
          </Text>
          <Text variant="chatRowTime">{chat.time}</Text>
        </Box>
        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
          <Text variant="chatRowPreview" numberOfLines={1} flex={1} marginRight="sm">
            {chat.lastMessage}
          </Text>
          {chat.unread > 0 ? (
            <Box
              minWidth={20}
              height={20}
              borderRadius="full"
              paddingHorizontal="xs"
              alignItems="center"
              justifyContent="center"
              backgroundColor="badgeUnread"
            >
              <Text variant="chatRowBadge">{chat.unread}</Text>
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  );

  const pressable = (
    <Pressable
      ref={rowRef}
      collapsable={false}
      accessibilityRole="button"
      accessibilityLabel={`Chat with ${chat.title}`}
      onPress={() => {
        if (skipNextTap.current) {
          skipNextTap.current = false;
          return;
        }
        onPress();
      }}
      onPressIn={() => { isLongPressing.current = true; }}
      onPressOut={() => { isLongPressing.current = false; }}
      onLongPress={(e) => {
        isLongPressing.current = false;
        openMenuAtEvent(e);
      }}
      delayLongPress={450}
      style={({ pressed }) => {
        if (!pressed) return IDLE_STYLE;
        if (isLongPressing.current) return { opacity: 0.5, backgroundColor: undefined };
        return { opacity: 1, backgroundColor: colors.chatListRowPressed };
      }}
    >
      {rowContent}
    </Pressable>
  );

  if (Platform.OS === 'web') {
    return (
      <Box alignSelf="stretch" {...buildWebContextMenuProps(onOpenMenu)}>
        {pressable}
      </Box>
    );
  }

  return (
    <LongPressGestureHandler
      minDurationMs={350}
      onHandlerStateChange={(e) => onPeekStateChange(e.nativeEvent.state)}
    >
      <Box alignSelf="stretch">{pressable}</Box>
    </LongPressGestureHandler>
  );
}

function extractWebContextMenuCoords(e: unknown): { x: number; y: number } {
  const ev = e as {
    nativeEvent?: { pageX?: number; pageY?: number; clientX?: number; clientY?: number };
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
