import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';

import { Box, type Theme } from '@/shared/ui/restyle';

const DEFAULT_ICON_SIZE = 18;

/** Icon size for read/delivered ticks inline in a message bubble (caption or attachment row). */
export const BUBBLE_READ_RECEIPT_ICON_SIZE = 15;

export type ReadReceiptTicksProps = {
  /** `false` = single check (sent/delivered); `true` = double check (read). */
  read: boolean;
  iconSize?: number;
};

/** Read / delivered indicator for chat list rows (theme `chatReadReceiptTicks`). */
export function ReadReceiptTicks({ iconSize = DEFAULT_ICON_SIZE, read }: ReadReceiptTicksProps) {
  const { colors } = useTheme<Theme>();

  return (
    <Box
      marginRight="xxs"
      alignItems="center"
      justifyContent="center"
      accessibilityRole="image"
      accessibilityLabel={read ? 'Read' : 'Delivered'}
    >
      <Ionicons
        name={read ? 'checkmark-done' : 'checkmark'}
        size={iconSize}
        color={colors.chatReadReceiptTicks}
      />
    </Box>
  );
}
