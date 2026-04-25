import { useTheme } from '@shopify/restyle';
import { useCallback, useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  actionSheetMenuCardElevation,
  ActionSheetModalShell,
  CHAT_LIST_CONTEXT_MODAL_COLUMN_MAX_WIDTH,
  CHAT_LIST_CONTEXT_MODAL_EXTRA_BOTTOM_PAD,
  CHAT_LIST_CONTEXT_MODAL_PEEK_CARD_MIN_HEIGHT,
  CHAT_LIST_CONTEXT_MODAL_PEEK_HEIGHT_MAX,
  CHAT_LIST_CONTEXT_MODAL_PEEK_HEIGHT_MIN,
  CHAT_LIST_CONTEXT_MODAL_PEEK_HEIGHT_VH_RATIO,
  CHAT_LIST_CONTEXT_MODAL_PEEK_MENU_GAP,
  chatPeekCardElevation,
  ChatRowActionMenuCard,
  type ChatRowActionSheetAction,
} from '@/shared/ui/chat-row-action-sheet';
import { Box, type Theme } from '@/shared/ui/restyle';
import { BOTTOM_TAB_BAR_HEIGHT } from '@/shared/ui/tabs-bottom-tab-bar/constants';
import { ChatPeekShell } from '@/widgets/chat-peek-shell';

type Props = {
  visible: boolean;
  onClose: () => void;
  chatId: string;
  onAction?: (action: ChatRowActionSheetAction, chatId: string) => void;
};

/**
 * One `Modal` only: full-screen dim + **chat preview** (peek) + **action menu** under it (Telegram-style).
 * Taps on the dimmed area (outside the cards) use `box-none` so the underlying `Pressable` can dismiss.
 */
export function ChatListRowContextModal({ visible, onClose, chatId, onAction }: Props) {
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();
  const { width: vw, height: vh } = useWindowDimensions();

  const colWidth = useMemo(
    () => Math.min(vw - 2 * theme.spacing.lg, CHAT_LIST_CONTEXT_MODAL_COLUMN_MAX_WIDTH),
    [theme.spacing.lg, vw]
  );
  const peekHeight = useMemo(
    () =>
      Math.min(
        Math.max(Math.round(vh * CHAT_LIST_CONTEXT_MODAL_PEEK_HEIGHT_VH_RATIO), CHAT_LIST_CONTEXT_MODAL_PEEK_HEIGHT_MIN),
        CHAT_LIST_CONTEXT_MODAL_PEEK_HEIGHT_MAX
      ),
    [vh]
  );

  const emit = useCallback(
    (action: ChatRowActionSheetAction) => {
      onAction?.(action, chatId);
      onClose();
    },
    [chatId, onClose, onAction]
  );

  const bottomPad =
    insets.bottom + BOTTOM_TAB_BAR_HEIGHT + CHAT_LIST_CONTEXT_MODAL_EXTRA_BOTTOM_PAD;

  return (
    <ActionSheetModalShell
      visible={visible}
      onClose={onClose}
      backdropAccessibilityLabel="Close"
      backdropColor="chatListContextModalBackdrop"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={1}
        pointerEvents="box-none"
      >
        <Box
          flex={1}
          justifyContent="center"
          paddingHorizontal="lg"
          pointerEvents="box-none"
          style={{
            paddingTop: insets.top + theme.spacing.smd,
            paddingBottom: bottomPad,
          }}
        >
          <Box
            width="100%"
            pointerEvents="box-none"
            style={{
              width: colWidth,
              maxWidth: CHAT_LIST_CONTEXT_MODAL_COLUMN_MAX_WIDTH,
              alignSelf: 'center',
            }}
          >
            <Box
              backgroundColor="chatWallpaper"
              borderRadius="chatPeek"
              overflow="hidden"
              minHeight={CHAT_LIST_CONTEXT_MODAL_PEEK_CARD_MIN_HEIGHT}
              style={[
                { height: peekHeight, maxWidth: colWidth },
                chatPeekCardElevation(theme.colors),
              ]}
            >
              <ChatPeekShell chatId={chatId} />
            </Box>
            <Box height={CHAT_LIST_CONTEXT_MODAL_PEEK_MENU_GAP} />
            <Box
              width="75%"
              borderRadius="actionSheet"
              style={actionSheetMenuCardElevation(theme.colors)}
            >
              <ChatRowActionMenuCard onAction={emit} />
            </Box>
          </Box>
        </Box>
      </Box>
    </ActionSheetModalShell>
  );
}
