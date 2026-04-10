import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGetChatsQuery } from '@/entities/chat';
import { ChatPage } from '@/pages/chat-page';
import { appTheme } from '@/shared/config/theme';
import { useBreakpoint, useSplitTabNavigation } from '@/shared/lib/hooks';
import { useColorScheme } from '@/shared/lib/hooks';
import { BOTTOM_TAB_BAR_HEIGHT } from '@/shared/ui/tabs-bottom-tab-bar';
import { ChatsList } from '@/widgets/chats-list';

export type ChatsListPageProps = {
  splitMode?: boolean;
  splitChatId?: string | null;
  /** Search field placeholder. */
  searchPlaceholder?: string;
  /** Extra vertical padding for web search inputs. */
  searchInputPaddingVertical?: number;
};

export function ChatsListPage({
  splitMode = false,
  splitChatId = null,
  searchPlaceholder = 'qotoq bormi qidirib',
  searchInputPaddingVertical = 0,
}: ChatsListPageProps) {
  const scheme = useColorScheme();
  const t = appTheme[scheme];
  const insets = useSafeAreaInsets();
  const { sidebarWidth } = useBreakpoint();
  const { data: chats } = useGetChatsQuery();
  const [searchQuery, setSearchQuery] = useState('');

  const { openDetail } = useSplitTabNavigation({
    splitMode,
    paramName: 'chatId',
    pushPath: (id) => `/chat/${id}`,
  });

  const openFirstOrDemo = useCallback(() => {
    const id = chats?.[0]?.id ?? '1';
    openDetail(id);
  }, [chats, openDetail]);

  const onChatPress = useCallback(
    (id: string) => {
      openDetail(id);
    },
    [openDetail]
  );

  /** Wide split: tabs sit under the master column only — leave room above the bar + gap. */
  const fabBottomOffset = splitMode ? BOTTOM_TAB_BAR_HEIGHT + 16 : BOTTOM_TAB_BAR_HEIGHT;

  const column = (
    <View style={styles.column}>
      <StatusBar style="light" />
      <View style={[styles.navBar, { backgroundColor: t.navBar, paddingTop: insets.top }]}>
        <View style={styles.navRow}>
          <Pressable hitSlop={10} style={styles.navSide}>
            <Text style={[styles.editLabel, { color: t.navBarSecondary }]}>Edit</Text>
          </Pressable>
          <Text style={[styles.navTitle, { color: t.navBarText }]}>Chats</Text>
          <Pressable hitSlop={10} style={[styles.navSide, styles.navRight]} onPress={openFirstOrDemo}>
            <Ionicons name="create-outline" size={26} color={t.navBarText} />
          </Pressable>
        </View>
        <View style={[styles.searchRow, { backgroundColor: t.searchFieldBg }]}>
          <Ionicons name="search" size={18} color={t.searchFieldPlaceholder} style={styles.searchIcon} />
          <TextInput
            style={[
              styles.searchInput,
              { color: t.navBarText, paddingVertical: searchInputPaddingVertical },
            ]}
            placeholder={searchPlaceholder}
            placeholderTextColor={t.searchFieldPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            {...(Platform.OS === 'ios' ? { clearButtonMode: 'while-editing' as const } : {})}
          />
          <Pressable hitSlop={8}>
            <Ionicons name="mic-outline" size={22} color={t.searchMic} />
          </Pressable>
        </View>
      </View>
      <View style={[styles.body, { backgroundColor: t.chatListScreenBg }]}>
        <ChatsList
          onChatPress={onChatPress}
          selectedChatId={splitMode ? splitChatId : null}
          searchQuery={searchQuery}
        />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="New message"
        onPress={openFirstOrDemo}
        style={[
          styles.fab,
          {
            bottom: insets.bottom + fabBottomOffset,
            backgroundColor: t.tint,
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
              },
              android: { elevation: 4 },
              default: {},
            }),
          },
        ]}>
        <Ionicons name="create" size={24} color="#FFFFFF" />
      </Pressable>
    </View>
  );

  if (splitMode) {
    return (
      <View style={styles.splitRoot}>
        <View style={[styles.splitLeft, { width: sidebarWidth, borderRightColor: t.splitBorder }]}>
          {column}
        </View>
        <View style={[styles.splitRight, { backgroundColor: t.chatWallpaper }]}>
          {splitChatId ? (
            <ChatPage chatId={splitChatId} embedded />
          ) : (
            <View style={[styles.splitEmptyWrap, { backgroundColor: t.chatWallpaper }]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Info"
                style={[styles.splitInfoBtn, { top: insets.top + 8 }]}>
                <Ionicons name="information-circle-outline" size={26} color={t.textSecondary} />
              </Pressable>
              <View style={styles.splitEmpty}>
                <Ionicons name="chatbubbles-outline" size={56} color={t.splitEmptyText} />
                <Text style={[styles.splitEmptyTitle, { color: t.textSecondary }]}>
                  Select a chat to start messaging
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }

  return <View style={styles.root}>{column}</View>;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  column: { flex: 1 },
  splitRoot: { flex: 1, flexDirection: 'row' },
  splitLeft: {
    flexShrink: 0,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  splitRight: { flex: 1, minWidth: 0 },
  splitEmptyWrap: { flex: 1, position: 'relative' },
  splitInfoBtn: {
    position: 'absolute',
    right: 12,
    zIndex: 2,
    padding: 8,
  },
  splitEmpty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  splitEmptyTitle: { marginTop: 16, fontSize: 16, textAlign: 'center' },
  navBar: {},
  navRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  navSide: {
    width: 72,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  navRight: { alignItems: 'flex-end' },
  editLabel: { fontSize: 17 },
  navTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 10,
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  body: { flex: 1 },
  fab: {
    position: 'absolute',
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
