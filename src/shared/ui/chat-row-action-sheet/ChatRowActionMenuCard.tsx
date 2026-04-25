import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { type ReactNode } from 'react';
import { Pressable, type StyleProp, StyleSheet, type ViewStyle } from 'react-native';

import { Box, Text, type Theme } from '@/shared/ui/restyle';

import type { ChatRowActionSheetAction } from './types';

const ICON_SIZE = 22;

export type ChatRowActionMenuCardProps = {
  onAction: (action: ChatRowActionSheetAction) => void;
  /** Optional outer wrapper (e.g. when a parent does not set width). */
  style?: StyleProp<ViewStyle>;
};

function MarkAsUnreadIcon({ color, dotColor }: { color: string; dotColor: string }) {
  return (
    <Box
      width={24}
      height={24}
      position="relative"
      alignItems="center"
      justifyContent="center"
      accessibilityElementsHidden
    >
      <Ionicons name="chatbubble-outline" size={ICON_SIZE} color={color} />
      <Box
        position="absolute"
        top={2.5}
        right={2}
        style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: dotColor }}
      />
    </Box>
  );
}

function ActionRow({
  label,
  onPress,
  rightIcon,
  variant,
}: {
  label: string;
  onPress: () => void;
  rightIcon: ReactNode;
  variant: 'default' | 'destructive';
}) {
  const textVariant =
    variant === 'destructive' ? 'actionSheetLabelDestructive' : 'actionSheetLabel';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [pressed && { opacity: 0.75 }]}
    >
      <Box
        flexDirection="row"
        alignItems="center"
        paddingVertical="md"
        paddingHorizontal="lg"
        minHeight={48}
        gap="sm"
      >
        <Box flex={1} minWidth={0}>
          <Text variant={textVariant} numberOfLines={1}>
            {label}
          </Text>
        </Box>
        <Box justifyContent="center" alignItems="center" minWidth={24}>
          {rightIcon}
        </Box>
      </Box>
    </Pressable>
  );
}

/** Four rows: Mark as Unread, Pin, Mute, Delete (shared by web popover and native peek+menu modal). */
export function ChatRowActionMenuCard({ onAction, style }: ChatRowActionMenuCardProps) {
  const { colors } = useTheme<Theme>();
  return (
    <Box width="100%" style={style} borderRadius="actionSheet" overflow="hidden">
      <Box
        width="100%"
        alignSelf="center"
        backgroundColor="actionSheetSurface"
        overflow="hidden"
        borderRadius="actionSheet"
      >
        <ActionRow
          onPress={() => onAction('markUnread')}
          label="Mark as Unread"
          rightIcon={<MarkAsUnreadIcon color={colors.textPrimary} dotColor={colors.textPrimary} />}
          variant="default"
        />
        <Box
          height={StyleSheet.hairlineWidth}
          marginHorizontal="lg"
          backgroundColor="actionSheetSeparator"
        />
        <ActionRow
          onPress={() => onAction('pin')}
          label="Pin"
          rightIcon={<AntDesign name="pushpin" size={ICON_SIZE} color={colors.textPrimary} />}
          variant="default"
        />
        <Box
          height={StyleSheet.hairlineWidth}
          marginHorizontal="lg"
          backgroundColor="actionSheetSeparator"
        />
        <ActionRow
          onPress={() => onAction('mute')}
          label="Mute"
          rightIcon={
            <Ionicons
              name="notifications-off-outline"
              size={ICON_SIZE}
              color={colors.textPrimary}
            />
          }
          variant="default"
        />
        <Box
          height={StyleSheet.hairlineWidth}
          marginHorizontal="lg"
          backgroundColor="actionSheetSeparator"
        />
        <ActionRow
          onPress={() => onAction('deleteChat')}
          label="Delete"
          rightIcon={
            <Ionicons name="trash-outline" size={ICON_SIZE} color={colors.contextMenuDanger} />
          }
          variant="destructive"
        />
      </Box>
    </Box>
  );
}
