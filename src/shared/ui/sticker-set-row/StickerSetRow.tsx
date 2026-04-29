import { useTheme } from '@shopify/restyle';
import { useState } from 'react';
import type { PressableProps } from 'react-native';
import { Image } from 'react-native';

import { ListRowSeparator } from '@/shared/ui/list-row-separator';
import { Box, PressableBox, Text, type Theme } from '@/shared/ui/restyle';

/** Pack artwork / fallback initial — matches sticker picker density. */
const THUMB_SIZE = 40;

/** Shared Restyle layout for pressable and static rows. */
const ROW_LAYOUT = {
  backgroundColor: 'stickerSetRowBg',
  paddingHorizontal: 'lg',
  paddingVertical: 'sm',
  minHeight: 56,
  flexDirection: 'row',
  alignItems: 'center',
} as const satisfies Record<string, unknown>;

function formatStickerSubtitle(count: number): string {
  return count === 1 ? '1 sticker' : `${count} stickers`;
}

export type StickerSetRowProps = {
  /** Sticker pack display name */
  title: string;
  /** If set without `subtitle`, shows “n sticker(s)” */
  stickerCount?: number;
  /** Overrides the line under the title (e.g. localized copy) */
  subtitle?: string;
  /** Pack cover image */
  imageUri?: string | null;
  /** Used for the placeholder initial when `imageUri` is missing or fails */
  name?: string;
  onPress?: PressableProps['onPress'];
  /** When false, omits the bottom hairline (e.g. last row in a list). */
  showDivider?: boolean;
  /** Left inset for the divider in px; defaults to past the thumbnail. */
  dividerInsetLeft?: number;
  testID?: string;
  accessibilityLabel?: string;
};

/**
 * Single sticker pack row: thumbnail, title, sticker count — with an inset divider
 * under the text block (not under the thumbnail).
 */
export function StickerSetRow({
  title,
  stickerCount,
  subtitle: subtitleProp,
  imageUri,
  name,
  onPress,
  showDivider = true,
  dividerInsetLeft: dividerInsetLeftProp,
  testID,
  accessibilityLabel,
}: StickerSetRowProps) {
  const { colors, spacing } = useTheme<Theme>();
  const [imgFailed, setImgFailed] = useState(false);

  const subtitle =
    subtitleProp ??
    (stickerCount != null && Number.isFinite(stickerCount) && stickerCount >= 0
      ? formatStickerSubtitle(stickerCount)
      : undefined);

  const dividerInset = dividerInsetLeftProp ?? spacing.lg + THUMB_SIZE + spacing.md;

  const placeholderLetter = name?.slice(0, 1).toUpperCase() ?? title.slice(0, 1).toUpperCase();
  const showImage = !!imageUri && !imgFailed;
  const isPressable = onPress != null;

  const inner = (
    <>
      <Box
        width={THUMB_SIZE}
        height={THUMB_SIZE}
        borderRadius="sm"
        marginRight="md"
        overflow="hidden"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
        style={!showImage ? { backgroundColor: colors.textSecondary } : undefined}
      >
        {showImage ? (
          <Image
            source={{ uri: imageUri! }}
            onError={() => setImgFailed(true)}
            style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
          />
        ) : (
          <Text variant="stickerSetThumbLetter">{placeholderLetter}</Text>
        )}
      </Box>
      <Box flex={1} justifyContent="center" gap="xxs" minWidth={0}>
        <Text variant="chatRowTitle" fontWeight="600" numberOfLines={1}>
          {title}
        </Text>
        {subtitle != null ? (
          <Text variant="stickerSetRowSubtitle" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </Box>
    </>
  );

  const rowAccessibilityLabel =
    accessibilityLabel ?? (subtitle != null ? `${title}, ${subtitle}` : title);

  return (
    <Box alignSelf="stretch">
      {isPressable ? (
        <PressableBox
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={rowAccessibilityLabel}
          testID={testID}
          {...ROW_LAYOUT}
          style={({ pressed }) =>
            pressed ? { backgroundColor: colors.stickerSetRowPressed } : undefined
          }
        >
          {inner}
        </PressableBox>
      ) : (
        <Box accessible accessibilityLabel={rowAccessibilityLabel} testID={testID} {...ROW_LAYOUT}>
          {inner}
        </Box>
      )}
      {showDivider ? (
        <ListRowSeparator insetLeft={dividerInset} backgroundColor="stickerSetRowBg" />
      ) : null}
    </Box>
  );
}
