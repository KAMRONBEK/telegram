import { useTheme } from '@shopify/restyle';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { GestureResponderEvent, View } from 'react-native';
import { Animated, Dimensions, Easing, Platform, Pressable } from 'react-native';
import { LongPressGestureHandler, State, Swipeable } from 'react-native-gesture-handler';

import type { Chat } from '@/entities/chat';
import { SwipeActionStrip, type SwipeActionStripItem } from '@/shared/ui';
import { Avatar, avatarColor } from '@/shared/ui/avatar';
import type { ChatListMenuAction } from '@/shared/ui/chat-list-context-menu';
import { Box, Text as RestyleText, type Theme } from '@/shared/ui/restyle';

export type ChatListRowProps = {
  chat: Chat;
  selected?: boolean;
  onPress: () => void;
  onOpenMenu: (anchor: { x: number; y: number }) => void;
  onPeekOpen: () => void;
  onPeekClose: () => void;
  /** Fired when the user chooses a swipe action (same actions as the row context menu). */
  onSwipeMenuAction?: (action: ChatListMenuAction) => void;
};

const IDLE_STYLE = { opacity: 1, backgroundColor: undefined } as const;

function buildWebContextMenuProps(
  onOpenMenu: (anchor: { x: number; y: number }) => void
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
  onSwipeMenuAction,
}: ChatListRowProps) {
  const { colors } = useTheme<Theme>();
  const rowRef = useRef<View>(null);
  const swipeableRef = useRef<Swipeable>(null);
  const skipNextTap = useRef(false);
  const isLongPressing = useRef(false);
  /** Armed state for overswipe commit (`SwipeActionStrip` + `transX` listener). */
  const leftArmedRef = useRef(false);
  const rightArmedRef = useRef(false);
  const exitTranslateX = useRef(new Animated.Value(0)).current;
  const [rowWidth, setRowWidth] = useState(0);

  /** Read vs unread — primary overswipe on the left matches the first cell. */
  const leftPrimaryAction: ChatListMenuAction = chat.unread > 0 ? 'markRead' : 'markUnread';

  const leftSwipeActions: SwipeActionStripItem<ChatListMenuAction>[] = useMemo(() => {
    const readOrUnread: SwipeActionStripItem<ChatListMenuAction> =
      chat.unread > 0
        ? {
            action: 'markRead',
            label: 'Read',
            icon: 'checkmark-done-outline',
            backgroundColor: colors.chatListSwipeUnread,
          }
        : {
            action: 'markUnread',
            label: 'Unread',
            icon: 'chatbubble',
            backgroundColor: colors.chatListSwipeUnread,
          };
    return [
      readOrUnread,
      {
        action: 'pin',
        label: 'Pin',
        icon: 'pushpin',
        iconSet: 'antdesign',
        backgroundColor: colors.chatListSwipePin,
      },
    ];
  }, [chat.unread, colors]);

  const rightSwipeActions: SwipeActionStripItem<ChatListMenuAction>[] = [
    {
      action: 'mute',
      label: 'Mute',
      icon: 'volume-mute-outline',
      backgroundColor: colors.chatListSwipeMute,
    },
    {
      action: 'deleteChat',
      label: 'Delete',
      icon: 'trash-bin-outline',
      backgroundColor: colors.chatListSwipeDelete,
    },
    {
      action: 'archive',
      label: 'Archive',
      icon: 'file-tray-full-outline',
      backgroundColor: colors.chatListSwipeArchive,
    },
  ];

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

  const emitSwipe = (action: ChatListMenuAction) => {
    onSwipeMenuAction?.(action);
  };

  const handleLeftArmedChange = useCallback((armed: boolean) => {
    leftArmedRef.current = armed;
  }, []);

  const handleRightArmedChange = useCallback((armed: boolean) => {
    rightArmedRef.current = armed;
  }, []);

  const handleSwipeableWillOpen = useCallback(
    (direction: 'left' | 'right') => {
      if (direction === 'left') {
        if (!leftArmedRef.current) return;
        leftArmedRef.current = false;
      } else {
        if (!rightArmedRef.current) return;
        rightArmedRef.current = false;
      }
      const commitAction: ChatListMenuAction =
        direction === 'left' ? leftPrimaryAction : 'archive';
      const width = rowWidth > 0 ? rowWidth : Dimensions.get('window').width;
      // Left actions commit → row exits right (+). Right actions (archive) → exits left (−).
      const exitOffset = direction === 'left' ? width : -width;
      // Start on the same frame as release — do not wait for `onSwipeableOpen` (avoids a visible pause).
      Animated.timing(exitTranslateX, {
        toValue: exitOffset,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;
        onSwipeMenuAction?.(commitAction);
        exitTranslateX.setValue(0);
        swipeableRef.current?.reset();
      });
    },
    [leftPrimaryAction, onSwipeMenuAction, rowWidth, exitTranslateX]
  );

  const handleSwipeableClose = () => {
    leftArmedRef.current = false;
    rightArmedRef.current = false;
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
          <RestyleText variant="chatRowTitle" numberOfLines={1} flex={1} marginRight="sm">
            {chat.title}
          </RestyleText>
          <RestyleText variant="chatRowTime">{chat.time}</RestyleText>
        </Box>
        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
          <RestyleText variant="chatRowPreview" numberOfLines={1} flex={1} marginRight="sm">
            {chat.lastMessage}
          </RestyleText>
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
              <RestyleText variant="chatRowBadge">{chat.unread}</RestyleText>
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
      onPressIn={() => {
        isLongPressing.current = true;
      }}
      onPressOut={() => {
        isLongPressing.current = false;
      }}
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

  const nativeRow = (
    <LongPressGestureHandler
      minDurationMs={350}
      onHandlerStateChange={(e) => onPeekStateChange(e.nativeEvent.state)}
    >
      <Box alignSelf="stretch">{pressable}</Box>
    </LongPressGestureHandler>
  );

  return (
    <Box
      alignSelf="stretch"
      onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}
      {...buildWebContextMenuProps(onOpenMenu)}
    >
      <Animated.View style={{ transform: [{ translateX: exitTranslateX }] }}>
        <Swipeable
        ref={swipeableRef}
        friction={1}
        overshootLeft
        overshootRight
        overshootFriction={1}
        useNativeAnimations={false}
        enableTrackpadTwoFingerGesture
        onSwipeableWillOpen={handleSwipeableWillOpen}
        onSwipeableClose={handleSwipeableClose}
        childrenContainerStyle={{ flex: 1, backgroundColor: colors.chatListRow }}
        renderLeftActions={
          rowWidth > 0
            ? (progress, transX) => (
                <SwipeActionStrip<ChatListMenuAction>
                  actions={leftSwipeActions}
                  labelColor={colors.chatListSwipeActionLabel}
                  revealProgress={progress}
                  transX={transX}
                  side="left"
                  basisWidth={rowWidth}
                  primaryAction={leftPrimaryAction}
                  onArmedChange={handleLeftArmedChange}
                  onSelect={emitSwipe}
                />
              )
            : undefined
        }
        renderRightActions={
          rowWidth > 0
            ? (progress, transX) => (
                <SwipeActionStrip<ChatListMenuAction>
                  actions={rightSwipeActions}
                  labelColor={colors.chatListSwipeActionLabel}
                  revealProgress={progress}
                  transX={transX}
                  side="right"
                  basisWidth={rowWidth}
                  primaryAction="archive"
                  onArmedChange={handleRightArmedChange}
                  onSelect={emitSwipe}
                />
              )
            : undefined
        }
      >
        {nativeRow}
      </Swipeable>
      </Animated.View>
    </Box>
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
