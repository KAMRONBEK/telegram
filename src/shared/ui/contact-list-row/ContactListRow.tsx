import { useTheme } from '@shopify/restyle';
import type { PressableProps } from 'react-native';

import { Avatar, AVATAR_PX, avatarColor, type AvatarSize } from '@/shared/ui/avatar';
import { ListRowSeparator } from '@/shared/ui/list-row-separator';
import { Box, PressableBox, Text, type Theme } from '@/shared/ui/restyle';

/** Horizontal offset where the name/status column begins (matches row padding + avatar + gap). */
export function contactListRowDividerInsetLeft(
  spacing: Pick<Theme['spacing'], 'md'>,
  avatarSize: AvatarSize
): number {
  return spacing.md + AVATAR_PX[avatarSize] + spacing.md;
}

const ROW_LAYOUT = {
  backgroundColor: 'chatListRow',
  paddingHorizontal: 'md',
  paddingVertical: 'sm',
  flexDirection: 'row',
  alignItems: 'center',
} as const satisfies Record<string, unknown>;

export type ContactListRowProps = {
  name: string;
  /** Second line (e.g. “online”, “last seen …”). Omitted when empty. */
  statusText?: string;
  /** Restyle color token for the status line; default `textSecondary`. Use `tint` for accent (e.g. online). */
  statusColor?: keyof Theme['colors'];
  imageUri?: string | null;
  /** Fallback tile behind the letter when there is no photo. */
  avatarBackgroundColor?: string;
  avatarSize?: AvatarSize;
  onPress?: PressableProps['onPress'];
  /** When false, omits the bottom hairline (e.g. last row in a section). */
  showDivider?: boolean;
  /** Left inset for the divider; default aligns with the text column. */
  dividerInsetLeft?: number;
  testID?: string;
  accessibilityLabel?: string;
};

/**
 * Contacts / users list row: circular avatar, name, optional status — with chat-list styling
 * and an inset divider under the text (not under the avatar).
 */
export function ContactListRow({
  name,
  statusText,
  statusColor = 'textSecondary',
  imageUri,
  avatarBackgroundColor,
  avatarSize = 'thirtySix',
  onPress,
  showDivider = true,
  dividerInsetLeft: dividerInsetLeftProp,
  testID,
  accessibilityLabel,
}: ContactListRowProps) {
  const { colors, spacing } = useTheme<Theme>();
  const dividerInset = dividerInsetLeftProp ?? contactListRowDividerInsetLeft(spacing, avatarSize);
  const hasStatus = statusText != null && statusText !== '';
  const isPressable = onPress != null;

  const fallbackBg = avatarBackgroundColor ?? avatarColor(name);

  const inner = (
    <>
      <Box marginRight="md" flexShrink={0}>
        <Avatar size={avatarSize} uri={imageUri} name={name} backgroundColor={fallbackBg} />
      </Box>
      <Box flex={1} justifyContent="center" gap="xxs" minWidth={0}>
        <Text variant="chatRowTitle" fontWeight="600" numberOfLines={1}>
          {name}
        </Text>
        {hasStatus ? (
          <Text variant="stickerSetRowSubtitle" color={statusColor} numberOfLines={1}>
            {statusText}
          </Text>
        ) : null}
      </Box>
    </>
  );

  const rowA11y = accessibilityLabel ?? (hasStatus ? `${name}, ${statusText}` : name);

  return (
    <Box alignSelf="stretch">
      {isPressable ? (
        <PressableBox
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={rowA11y}
          testID={testID}
          {...ROW_LAYOUT}
          style={({ pressed }) =>
            pressed ? { backgroundColor: colors.chatListRowPressed } : undefined
          }
        >
          {inner}
        </PressableBox>
      ) : (
        <Box accessible accessibilityLabel={rowA11y} testID={testID} {...ROW_LAYOUT}>
          {inner}
        </Box>
      )}
      {showDivider ? (
        <ListRowSeparator insetLeft={dividerInset} backgroundColor="chatListRow" />
      ) : null}
    </Box>
  );
}
