import { ThemeProvider, useTheme } from '@shopify/restyle';
import { useCallback, useMemo, useState } from 'react';
import { type LayoutChangeEvent, useWindowDimensions } from 'react-native';

import type { Message } from '@/entities/message';
import {
    type ColorThemeOptionId,
    themePickerTilePresets,
    type ThemePickerTilePreview,
    themePreviewCopyPalettes,
} from '@/shared/config/theme';
import { Box, type Theme } from '@/shared/ui/restyle';
import { MessageBubble } from '@/widgets/message-list';

const PREVIEW_INCOMING: Message = {
  id: 'color-preview-in',
  chatId: 'color-preview',
  text: 'Do you know what time it is?',
  outgoing: false,
  time: '00:20',
  replyTo: { kind: 'text', authorName: 'Bob Harris', text: 'Good morning! 👋' },
};

const PREVIEW_OUTGOING: Message = {
  id: 'color-preview-out',
  chatId: 'color-preview',
  text: "It's morning in Tokyo 😎",
  outgoing: true,
  time: '00:20',
  readReceipt: true,
};

function usePreviewMessageTheme(optionId: ColorThemeOptionId): Theme {
  const base = useTheme<Theme>();
  const preview = themePickerTilePresets[optionId];
  const copy = themePreviewCopyPalettes[optionId];
  return useMemo(
    () => ({
      ...base,
      colors: {
        ...base.colors,
        bubbleIncoming: preview.bubbleIncoming,
        bubbleOutgoing: preview.bubbleOutgoing,
        textPrimary: copy.messageText,
        messageReplyBar: copy.replyBar,
        messageReplyAuthor: copy.replyAuthor,
        messageReplyBody: copy.replyBody,
        messageTimeOnBubble: copy.timeIncoming,
        messageTimeOnBubbleOutgoing: copy.timeOnOutgoing,
        chatReadReceiptTicks: copy.readReceipt,
      } as Theme['colors'],
    }),
    [base, preview, copy]
  );
}

export function ColorThemePreviewBlock({ optionId }: { optionId: ColorThemeOptionId }) {
  const preview: ThemePickerTilePreview = themePickerTilePresets[optionId];
  const previewTheme = usePreviewMessageTheme(optionId);
  const { width: windowWidth } = useWindowDimensions();
  const [bodyWidth, setBodyWidth] = useState(0);
  const maxBubbleWidth = useMemo(() => {
    const w = bodyWidth > 0 ? bodyWidth : Math.max(0, windowWidth - 48);
    return Math.max(120, w * 0.92);
  }, [bodyWidth, windowWidth]);

  const onBodyLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setBodyWidth((prev) => (Math.abs(w - prev) < 0.5 ? prev : w));
  }, []);

  return (
    <Box borderRadius="lg" overflow="hidden">
      <Box
        padding="md"
        minHeight={200}
        style={{ backgroundColor: preview.wallpaper }}
        onLayout={onBodyLayout}
      >
        <ThemeProvider theme={previewTheme}>
          <Box width="100%">
            <Box width="100%" flexDirection="row" justifyContent="flex-start">
              <MessageBubble
                isFirstInGroup
                isLastInGroup
                maxBubbleWidth={maxBubbleWidth}
                message={PREVIEW_INCOMING}
              />
            </Box>
            <Box width="100%" flexDirection="row" justifyContent="flex-end" marginTop="sm">
              <MessageBubble
                isFirstInGroup
                isLastInGroup
                maxBubbleWidth={maxBubbleWidth}
                message={PREVIEW_OUTGOING}
              />
            </Box>
          </Box>
        </ThemeProvider>
      </Box>
    </Box>
  );
}
