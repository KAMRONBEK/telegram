import { Box, Text } from '@/shared/ui/restyle';

export type NewMessagesBadgeProps = {
  count: number;
  /** Muted chats use a lower-emphasis pill (see light/dark theme tokens). */
  muted?: boolean;
};

/** Unread count pill for chat list rows (`chatUnreadBadge*` theme tokens). */
export function NewMessagesBadge({ count, muted = false }: NewMessagesBadgeProps) {
  if (count <= 0) {
    return null;
  }

  return (
    <Box
      minWidth={20}
      height={20}
      borderRadius="full"
      paddingHorizontal="xs"
      alignItems="center"
      justifyContent="center"
      backgroundColor={muted ? 'chatUnreadBadgeMutedBg' : 'chatUnreadBadgeActiveBg'}
      accessibilityRole="text"
      accessibilityLabel={`${count} unread messages`}
    >
      <Text variant="chatUnreadBadge">{count}</Text>
    </Box>
  );
}
