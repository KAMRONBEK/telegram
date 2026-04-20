import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';

import { Box, type Theme } from '@/shared/ui/restyle';

const ICON_SIZE = 18;

export type ReadReceiptTicksProps = {
  /** `false` = single check (sent/delivered); `true` = double check (read). */
  read: boolean;
};

/** Read / delivered indicator for chat list rows (theme `chatReadReceiptTicks`). */
export function ReadReceiptTicks({ read }: ReadReceiptTicksProps) {
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
        size={ICON_SIZE}
        color={colors.chatReadReceiptTicks}
      />
    </Box>
  );
}
