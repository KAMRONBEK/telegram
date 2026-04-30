import { StyleSheet } from 'react-native';

import { Avatar, AVATAR_PX as AVATAR_SIZES_PX, avatarColor } from '@/shared/ui/avatar';
import { Box, Text } from '@/shared/ui/restyle';
import { SavedMessagesAvatar } from '@/shared/ui/saved-messages-avatar';

/** Matches `Avatar` `thirtySix` — used for `SavedMessagesAvatar` and layout column width. */
const AVATAR_PX = AVATAR_SIZES_PX.thirtySix;

type Props = {
  title: string;
  subtitle?: string;
  savedMessages?: boolean;
};

export function ChatPeekHeader({ title, subtitle, savedMessages = false }: Props) {
  return (
    <Box
      backgroundColor="contextMenuBg"
      borderBottomColor="rowSeparator"
      style={{ borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: 10 }}
      flexDirection="row"
      alignItems="center"
      paddingHorizontal="md"
      minHeight={60}
    >
      <Box width={AVATAR_PX} />
      <Box flex={1} alignItems="center" paddingHorizontal="sm">
        <Text variant="chatPeekHeaderTitle" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="chatPeekHeaderSubtitle" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </Box>
      <Box width={AVATAR_PX} alignItems="flex-end">
        {savedMessages ? (
          <SavedMessagesAvatar size={AVATAR_PX} />
        ) : (
          <Avatar size="thirtySix" name={title} backgroundColor={avatarColor(title)} />
        )}
      </Box>
    </Box>
  );
}
