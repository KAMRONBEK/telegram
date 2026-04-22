import { useTheme } from '@shopify/restyle';

import type { QuotedMessageRef } from '@/entities/message';
import { Box, Text, type Theme } from '@/shared/ui/restyle';

import { QuoteMediaThumb } from './QuoteMediaThumb';

type Props = {
  maxQuoteTextWidth: number;
  replyTo: QuotedMessageRef;
};

function getQuotedMessagePreview(quoted: QuotedMessageRef): string {
  switch (quoted.kind) {
    case 'text':
      return quoted.text;
    case 'image': {
      const t = quoted.caption?.trim();
      return t || 'Photo';
    }
    case 'video': {
      const t = quoted.title?.trim();
      return t || 'Video';
    }
    case 'file':
      return quoted.fileName;
    case 'audio':
    case 'voice': {
      const t = quoted.label?.trim();
      return t || 'Voice message';
    }
    default: {
      const _exhaustive: never = quoted;
      return _exhaustive;
    }
  }
}

export function QuotedBlock({ maxQuoteTextWidth, replyTo }: Props) {
  const { spacing } = useTheme<Theme>();
  const bodyPreview = getQuotedMessagePreview(replyTo);
  const bodyLineLimit = replyTo.kind === 'text' ? 2 : 1;

  const isImage = replyTo.kind === 'image';
  const isVideo = replyTo.kind === 'video';
  const mediaUri = isImage || isVideo ? replyTo.previewUri : undefined;
  const showMediaThumb = (isImage || isVideo) && !!mediaUri?.trim();
  const thumb = spacing.messageQuoteThumb;
  const textColumnMax = showMediaThumb
    ? Math.max(0, maxQuoteTextWidth - thumb - spacing.sm)
    : maxQuoteTextWidth;

  return (
    <Box flexDirection="row" marginBottom="sm">
      <Box
        width={spacing.messageQuoteBarWidth}
        backgroundColor="messageReplyBar"
        borderRadius="messageQuoteBar"
        marginRight="sm"
        alignSelf="stretch"
      />
      {showMediaThumb && mediaUri ? (
        <Box marginRight="sm" alignSelf="flex-start">
          <QuoteMediaThumb uri={mediaUri} size={thumb} />
        </Box>
      ) : null}
      <Box minWidth={0} flex={1} flexShrink={1}>
        <Text
          variant="messageReplyAuthor"
          numberOfLines={1}
          maxWidth={textColumnMax}
          allowFontScaling>
          {replyTo.authorName}
        </Text>
        <Text
          variant="messageReplyBody"
          numberOfLines={bodyLineLimit}
          maxWidth={textColumnMax}
          allowFontScaling>
          {bodyPreview}
        </Text>
      </Box>
    </Box>
  );
}
