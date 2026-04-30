import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { useRouter, useSegments } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { PLACEHOLDER_AVATAR_URI } from '@/shared/config/placeholders';
import { Avatar } from '@/shared/ui/avatar';
import { Box, Text, type Theme } from '@/shared/ui/restyle';

type IconName = ComponentProps<typeof Ionicons>['name'];

type RailItem = {
  key: string;
  label: string;
  href: string;
  icon: IconName;
  iconOutline: IconName;
  badge?: 'unread';
  avatar?: boolean;
};

const RAIL_ITEMS: RailItem[] = [
  {
    key: 'contacts',
    label: 'Contacts',
    href: '/(tabs)/contacts',
    icon: 'person-circle',
    iconOutline: 'person-circle-outline',
  },
  {
    key: 'calls',
    label: 'Calls',
    href: '/(tabs)/calls',
    icon: 'call',
    iconOutline: 'call',
  },
  {
    key: 'index',
    label: 'Chats',
    href: '/(tabs)',
    icon: 'chatbubbles',
    iconOutline: 'chatbubbles-outline',
    badge: 'unread',
  },
  {
    key: 'profile',
    label: 'Settings',
    href: '/(tabs)/profile',
    icon: 'settings',
    iconOutline: 'settings-outline',
    avatar: true,
  },
];

type WebMailRailProps = {
  unreadCount?: number;
};

export function WebMailRail({ unreadCount = 0 }: WebMailRailProps) {
  const { colors } = useTheme<Theme>();
  const router = useRouter();
  const segments = useSegments();
  const rest = segments.filter((s) => s !== '(tabs)');
  const activeKey = rest.length === 0 ? 'index' : (rest[rest.length - 1] ?? 'index');

  return (
    <Box
      width={72}
      flexShrink={0}
      alignItems="center"
      backgroundColor="railBg"
      style={{ borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.splitBorder }}>
      <Box flex={1} style={{ minHeight: 24 }} />
      <Box width="100%" paddingBottom="lg" gap="xs" alignItems="center">
        {RAIL_ITEMS.map((item) => {
          const focused = activeKey === item.key;
          const badgeCount = item.badge === 'unread' ? unreadCount : 0;

          return (
            <Pressable
              key={item.key}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              onPress={() => router.push(item.href as never)}
              style={({ pressed }) => [
                pressableBase,
                focused && { backgroundColor: colors.railItemActive },
                pressed && pressablePressed,
              ]}>
              <Box>
                {item.avatar ? (
                  <Avatar
                    size="forty"
                    uri={PLACEHOLDER_AVATAR_URI}
                    bordered
                    focused={focused}
                  />
                ) : (
                  <Ionicons
                    name={focused ? item.icon : item.iconOutline}
                    size={item.key === 'contacts' ? 28 : 24}
                    color={focused ? colors.tint : colors.textSecondary}
                  />
                )}
                {badgeCount > 0 && (
                  <Box
                    position="absolute"
                    backgroundColor="badgeDanger"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="full"
                    style={badgePosition}>
                    <Text variant="badgeLabel">{badgeCount}</Text>
                  </Box>
                )}
              </Box>
              <Text
                variant="railLabel"
                marginTop="xxs"
                numberOfLines={1}
                style={{ textAlign: 'center', color: focused ? colors.tint : colors.textSecondary }}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </Box>
    </Box>
  );
}

const BADGE_SIZE = 16;

const badgePosition = {
  top: -(BADGE_SIZE / 4),
  right: -(BADGE_SIZE / 2),
  minWidth: BADGE_SIZE,
  height: BADGE_SIZE,
  paddingHorizontal: 4,
} as const;

const pressableBase = {
  width: 56,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  paddingVertical: 8,
  borderRadius: 10,
};

const pressablePressed = { opacity: 0.75 };
