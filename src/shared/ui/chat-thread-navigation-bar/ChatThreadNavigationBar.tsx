import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { Platform, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, avatarColor } from '@/shared/ui/avatar';
import { Box, Text, type Theme } from '@/shared/ui/restyle';
import { SavedMessagesAvatar } from '@/shared/ui/saved-messages-avatar';
import { BOTTOM_TAB_BAR_HEIGHT } from '@/shared/ui/tabs-bottom-tab-bar';

const CHEVRON_SIZE = 22;
const AVATAR_PX = 36;
/** iOS-style nav row; web matches bottom tab bar (`BOTTOM_TAB_BAR_HEIGHT`) for split-pane alignment. */
const NAV_ROW_HEIGHT = Platform.OS === 'web' ? BOTTOM_TAB_BAR_HEIGHT : 44;

export type ChatThreadNavigationBarProps = {
  title: string;
  subtitle?: string | null;
  /** Trailing label after the chevron (e.g. parent list title). */
  backLabel?: string;
  onBackPress?: () => void;
  /** Saved Messages thread — gradient avatar. */
  savedMessages?: boolean;
  /** Optional photo URL when the backend supplies it. */
  avatarUri?: string | null;
  /** Peek / minimal preview — omits subtitle line. */
  preview?: boolean;
};

export function ChatThreadNavigationBar({
  title,
  subtitle,
  backLabel = 'Chats',
  onBackPress,
  savedMessages = false,
  avatarUri,
  preview = false,
}: ChatThreadNavigationBarProps) {
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();
  const backTint = theme.colors.navBarSideItem;
  const showSubtitle = Boolean(subtitle) && !preview;

  const leftControl =
    onBackPress == null ? null : (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Back to ${backLabel}`}
        hitSlop={12}
        onPress={onBackPress}
        style={styles.backPressable}
      >
        <Box flexDirection="row" alignItems="center">
          <Ionicons name="chevron-back" size={CHEVRON_SIZE} color={backTint} />
          <Text
            variant="navSideLabel"
            style={[styles.backLabel, { color: backTint }]}
            numberOfLines={1}
          >
            {backLabel}
          </Text>
        </Box>
      </Pressable>
    );

  const avatar = savedMessages ? (
    <SavedMessagesAvatar size={AVATAR_PX} />
  ) : (
    <Avatar size="medium" uri={avatarUri} name={title} backgroundColor={avatarColor(title)} />
  );

  return (
    <Box
      backgroundColor="navBar"
      style={[
        {
          paddingTop: insets.top,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme.colors.rowSeparator,
        },
      ]}
    >
      <Box style={styles.bar}>
        <Box
          pointerEvents="box-none"
          style={styles.titleOverlay}
          justifyContent="center"
          alignItems="center"
        >
          <Text variant="chatPeekHeaderTitle" numberOfLines={1} style={styles.titleMax}>
            {title}
          </Text>
          {showSubtitle ? (
            <Text variant="chatPeekHeaderSubtitle" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </Box>
        <Box
          flexDirection="row"
          alignItems="center"
          minHeight={preview ? Math.min(36, NAV_ROW_HEIGHT) : NAV_ROW_HEIGHT}
        >
          <Box
            flex={1}
            justifyContent="center"
            alignItems="flex-start"
            paddingLeft="sm"
            style={styles.sideSlot}
          >
            {leftControl}
          </Box>
          <Box
            flex={1}
            justifyContent="center"
            alignItems="flex-end"
            paddingRight="sm"
            style={styles.sideSlot}
          >
            {avatar}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'relative',
  },
  titleOverlay: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 72,
    zIndex: 0,
  },
  titleMax: {
    maxWidth: '100%',
  },
  sideSlot: {
    zIndex: 1,
  },
  backPressable: {
    flexShrink: 1,
    justifyContent: 'center',
    marginVertical: 4,
  },
  backLabel: {
    flexShrink: 1,
  },
});
