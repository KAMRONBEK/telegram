import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { LinearGradient } from 'expo-linear-gradient';

import { Box, type Theme } from '@/shared/ui/restyle';

/** Default diameter in px (matches design spec). */
export const SAVED_MESSAGES_AVATAR_DEFAULT_SIZE = 60;

export type SavedMessagesAvatarProps = {
  /** Circle diameter in px. Use `56` to align with `Avatar` `large` in chat rows. */
  size?: number;
};

/**
 * Special circular avatar for the “Saved Messages” chat: vertical blue gradient and white bookmark.
 */
export function SavedMessagesAvatar({
  size = SAVED_MESSAGES_AVATAR_DEFAULT_SIZE,
}: SavedMessagesAvatarProps) {
  const { colors } = useTheme<Theme>();
  const radius = size / 2;
  const iconSize = Math.round(size * 0.55);

  return (
    <Box width={size} height={size} accessibilityRole="image" accessibilityLabel="Saved Messages">
      <LinearGradient
        colors={[colors.savedMessagesAvatarGradientTop, colors.savedMessagesAvatarGradientBottom]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="bookmark" size={iconSize} color={colors.savedMessagesAvatarIcon} />
      </LinearGradient>
    </Box>
  );
}
