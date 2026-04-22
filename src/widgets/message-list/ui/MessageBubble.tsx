import { useTheme } from '@shopify/restyle';
import { Platform, StyleSheet } from 'react-native';

import type { Message } from '@/entities/message';
import { useColorScheme } from '@/shared/lib/hooks';
import { BUBBLE_READ_RECEIPT_ICON_SIZE, ReadReceiptTicks } from '@/shared/ui';
import { Box, Text, type Theme } from '@/shared/ui/restyle';

import { getBubbleContentMetrics, getBubbleShadowOpacity, getMessageBubbleCornerRadii } from '../lib/bubbleLayout';
import { MessageImageAttachmentRow } from './MessageImageAttachmentRow';
import { QuotedBlock } from './QuotedBlock';

type Props = {
  message: Message;
  /** Pixel cap from the message line (avoids iOS `maxWidth: '%'` collapse in lists). */
  maxBubbleWidth: number;
  /** First row in a same-sender run (oldest in the cluster, toward list top). */
  isFirstInGroup: boolean;
  /** Last row in a same-sender run (newest in the cluster, toward input). */
  isLastInGroup: boolean;
};

export function MessageBubble({ isFirstInGroup, isLastInGroup, maxBubbleWidth, message }: Props) {
  const { borderRadii, colors, spacing } = useTheme<Theme>();
  const scheme = useColorScheme();
  const { attachment, outgoing, readReceipt, replyTo, text, time } = message;
  const caption = text.trim();
  const hasImageAttachment = attachment?.kind === 'image';

  const cornerRadii = getMessageBubbleCornerRadii(
    isFirstInGroup,
    isLastInGroup,
    outgoing,
    borderRadii,
  );

  const {
    contentWidth,
    mainTextMaxWidth,
    maxQuoteTextWidth,
    paddingLeft: bubblePadLeft,
    paddingRight: bubblePadRight,
  } = getBubbleContentMetrics(
    maxBubbleWidth,
    spacing,
    hasImageAttachment ? { paddingLeft: spacing.sm, paddingRight: spacing.md } : {},
  );

  const isLight = scheme === 'light';
  const showIncomingEdge = isLight && !outgoing;
  const lightShadow = getBubbleShadowOpacity(scheme);

  return (
    <Box
      maxWidth={maxBubbleWidth}
      backgroundColor={outgoing ? 'bubbleOutgoing' : 'bubbleIncoming'}
      paddingTop="sm"
      paddingBottom="smd"
      alignSelf={outgoing ? 'flex-end' : 'flex-start'}
      style={[
        { paddingLeft: bubblePadLeft, paddingRight: bubblePadRight },
        cornerRadii,
        showIncomingEdge
          ? { borderWidth: StyleSheet.hairlineWidth, borderColor: colors.bubbleBorder }
          : null,
        Platform.select({
          ios: {
            shadowColor: colors.messageBubbleShadow,
            shadowOffset: { width: 0, height: 0.5 },
            shadowOpacity: lightShadow,
            shadowRadius: 1,
          },
          android: { elevation: 1 },
          default: { boxShadow: `0 0.5px 1px ${colors.messageBubbleWebShadow}` },
        }),
      ]}>
      {replyTo ? <QuotedBlock maxQuoteTextWidth={maxQuoteTextWidth} replyTo={replyTo} /> : null}
      {hasImageAttachment && attachment ? (
        <MessageImageAttachmentRow
          attachment={attachment}
          embedStatus={!caption}
          maxContentWidth={contentWidth}
          outgoing={outgoing}
          readReceipt={readReceipt}
          time={time}
        />
      ) : null}
      {caption ? (
        <Box
          flexDirection="row"
          alignItems="flex-end"
          maxWidth={contentWidth}
          minWidth={0}
          marginTop={hasImageAttachment ? 'sm' : undefined}>
          <Text
            variant="messageBody"
            style={{ maxWidth: mainTextMaxWidth }}
            allowFontScaling>
            {caption}
          </Text>
          <Text
            color={outgoing ? 'messageTimeOnBubbleOutgoing' : 'messageTimeOnBubble'}
            variant="messageBubbleTime"
            allowFontScaling>
            {time}
          </Text>
          {outgoing && readReceipt !== undefined ? (
            <ReadReceiptTicks iconSize={BUBBLE_READ_RECEIPT_ICON_SIZE} read={readReceipt} />
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
}
