import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { useTotalUnread } from '@/application/index';
import { PLACEHOLDER_AVATAR_URI } from '@/shared/config/placeholders';
import { Avatar } from '@/shared/ui/avatar';
import { type Theme } from '@/shared/ui/restyle';
import {
  BOTTOM_TAB_BAR_HEIGHT,
  BOTTOM_TAB_BAR_TOP_BORDER,
  TabsBottomTabBar,
} from '@/shared/ui/tabs-bottom-tab-bar';

export default function TabLayout() {
  const { colors } = useTheme<Theme>();
  const totalUnread = useTotalUnread();

  return (
    <Tabs
      initialRouteName="index"
      tabBar={(props) => <TabsBottomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          borderTopWidth: BOTTOM_TAB_BAR_TOP_BORDER,
          ...(Platform.OS === 'web' ? { height: BOTTOM_TAB_BAR_HEIGHT } : {}),
        },
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '500', marginTop: 2 },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contacts',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person-circle' : 'person-circle-outline'}
              size={(size ?? 24) + 4}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calls"
        options={{
          title: 'Calls',
          tabBarIcon: ({ color, size }) => <Ionicons name="call" size={size ?? 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chats',
          tabBarBadge: totalUnread > 0 ? totalUnread : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.badgeDanger,
            fontSize: 11,
            fontWeight: '600',
          },
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
              size={size ?? 24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <Avatar size="twentySix" uri={PLACEHOLDER_AVATAR_URI} bordered focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
