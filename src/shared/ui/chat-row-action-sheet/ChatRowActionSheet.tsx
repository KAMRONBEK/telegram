import { useTheme } from '@shopify/restyle';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

import { Box, type Theme } from '@/shared/ui/restyle';

import { ActionSheetModalShell } from './ActionSheetModalShell';
import { ChatRowActionMenuCard } from './ChatRowActionMenuCard';
import {
  CHAT_ROW_ACTION_MENU_ESTIMATE_HEIGHT,
  CHAT_ROW_ACTION_MENU_MIN_WIDTH,
  CHAT_ROW_ACTION_POPOVER_EDGE_INSET,
  CHAT_ROW_ACTION_POPOVER_VIEWPORT_GUTTER,
} from './constants';
import { actionSheetMenuCardElevation } from './elevation';
import type { ChatRowActionSheetAction } from './types';

type Props = {
  visible: boolean;
  onClose: () => void;
  anchor: { x: number; y: number };
  chatId: string;
  onAction?: (action: ChatRowActionSheetAction, chatId: string) => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

/**
 * **Web** (or split web): long-press / right-click context **popover** at `anchor`.
 * **Native** iOS/Android use `ChatListRowContextModal` in the chats list (peek + action menu, one window).
 */
export function ChatRowActionSheet({ visible, onClose, anchor, chatId, onAction }: Props) {
  const theme = useTheme<Theme>();
  const { width: vw, height: vh } = useWindowDimensions();
  const [menuSize, setMenuSize] = useState({
    w: CHAT_ROW_ACTION_MENU_MIN_WIDTH,
    h: CHAT_ROW_ACTION_MENU_ESTIMATE_HEIGHT,
  });

  useEffect(() => {
    if (visible) {
      setMenuSize({
        w: CHAT_ROW_ACTION_MENU_MIN_WIDTH,
        h: CHAT_ROW_ACTION_MENU_ESTIMATE_HEIGHT,
      });
    }
  }, [visible]);

  const edge = CHAT_ROW_ACTION_POPOVER_EDGE_INSET;
  const gutter = CHAT_ROW_ACTION_POPOVER_VIEWPORT_GUTTER;

  const position = useMemo(() => {
    const w = Math.min(menuSize.w, vw - gutter);
    const h = menuSize.h;
    const left = clamp(anchor.x, edge, Math.max(edge, vw - w - edge));
    const top = clamp(anchor.y, edge, Math.max(edge, vh - h - edge));
    return { left, top };
  }, [anchor.x, anchor.y, edge, gutter, menuSize.h, menuSize.w, vh, vw]);

  const onMenuLayout = useCallback(
    (e: { nativeEvent: { layout: { width: number; height: number } } }) => {
      const { width, height } = e.nativeEvent.layout;
      if (width > 0 && height > 0) {
        setMenuSize(() => ({ w: width, h: height }));
      }
    },
    []
  );

  const emit = useCallback(
    (action: ChatRowActionSheetAction) => {
      onAction?.(action, chatId);
      onClose();
    },
    [chatId, onClose, onAction]
  );

  return (
    <ActionSheetModalShell
      visible={visible}
      onClose={onClose}
      backdropAccessibilityLabel="Close menu"
      backdropColor="chatListContextModalBackdrop"
      contentMinHeight={Platform.OS === 'web' ? vh : undefined}
    >
      <Box
        position="absolute"
        maxWidth="100%"
        onLayout={onMenuLayout}
        pointerEvents="box-none"
        style={{ left: position.left, top: position.top, zIndex: 2, elevation: 12 }}
      >
        <Box
          minWidth={CHAT_ROW_ACTION_MENU_MIN_WIDTH}
          alignSelf="flex-start"
          style={actionSheetMenuCardElevation(theme.colors)}
          borderRadius="actionSheet"
          overflow="hidden"
        >
          <ChatRowActionMenuCard onAction={emit} />
        </Box>
      </Box>
    </ActionSheetModalShell>
  );
}
