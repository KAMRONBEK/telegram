import { useTheme } from '@shopify/restyle';

import type { MessageImageAttachment } from '@/entities/message';
import { BUBBLE_READ_RECEIPT_ICON_SIZE, ReadReceiptTicks } from '@/shared/ui';
import { Box, Text, type Theme } from '@/shared/ui/restyle';

import { QuoteMediaThumb } from './QuoteMediaThumb';

type Props = {
  attachment: MessageImageAttachment;
  maxContentWidth: number;
  /** When true, time + read ticks are inline on the same row as the file preview (like a text bubble). */
  embedStatus: boolean;
  time: string;
  outgoing: boolean;
  readReceipt?: boolean;
};

export function MessageImageAttachmentRow({
  attachment,
  embedStatus,
  maxContentWidth,
  outgoing,
  readReceipt,
  time,
}: Props) {
  const { spacing } = useTheme<Theme>();
  const thumb = spacing.messageAttachmentThumb;
  const metaMaxWidth = Math.max(0, maxContentWidth - thumb - spacing.sm);

  return (
    <Box
      alignItems="flex-end"
      alignSelf="flex-start"
      flexDirection="row"
      maxWidth={maxContentWidth}
      minWidth={0}
    >
      <Box alignItems="center" flexDirection="row" flexShrink={1} minWidth={0}>
        <QuoteMediaThumb borderRadius="sm" uri={attachment.previewUri} size={thumb} />
        <Box flexShrink={1} marginLeft="sm" minWidth={0}>
          <Text
            color={outgoing ? 'messageImageAttachmentName' : 'textPrimary'}
            variant="messageAttachmentName"
            numberOfLines={2}
            allowFontScaling
            style={{ maxWidth: metaMaxWidth }}
          >
            {attachment.fileName}
          </Text>
          <Text
            color={outgoing ? 'messageImageAttachmentSizeOutgoing' : 'textSecondary'}
            variant="messageAttachmentSize"
            allowFontScaling
            style={{ maxWidth: metaMaxWidth }}>
            {attachment.sizeLabel}
          </Text>
        </Box>
      </Box>
      {embedStatus ? (
        <>
          <Text
            color={outgoing ? 'messageTimeOnBubbleOutgoing' : 'messageTimeOnBubble'}
            variant="messageBubbleTime"
            allowFontScaling>
            {time}
          </Text>
          {outgoing && readReceipt !== undefined ? (
            <ReadReceiptTicks iconSize={BUBBLE_READ_RECEIPT_ICON_SIZE} read={readReceipt} />
          ) : null}
        </>
      ) : null}
    </Box>
  );
}
