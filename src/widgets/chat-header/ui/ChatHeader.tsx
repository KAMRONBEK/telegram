import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { appTheme } from '@/shared/config/theme';
import { useColorScheme } from '@/shared/lib/hooks';

type Props = {
  title: string;
  subtitle?: string;
  /** Split / desktop: hide back (list stays visible beside chat). */
  embedded?: boolean;
  /** Peek preview: minimal header (no call / video actions). */
  preview?: boolean;
};

export function ChatHeader({
  title,
  subtitle = 'last seen recently',
  embedded = false,
  preview = false,
}: Props) {
  const router = useRouter();
  const scheme = useColorScheme();
  const t = appTheme[scheme];
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.wrap, { paddingTop: preview ? 8 : insets.top, backgroundColor: t.headerBar }]}>
      <View style={styles.row}>
        {embedded ? (
          <View style={styles.backBtn} />
        ) : (
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color={t.headerText} />
          </Pressable>
        )}
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: t.headerText }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && !preview ? (
            <Text style={[styles.subtitle, { color: t.headerSubtitle }]} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {preview ? (
          <View style={styles.actions} />
        ) : (
          <View style={styles.actions}>
            <Pressable hitSlop={8} style={styles.iconBtn}>
              <Ionicons name="call-outline" size={22} color={t.headerText} />
            </Pressable>
            <Pressable hitSlop={8} style={styles.iconBtn}>
              <Ionicons name="videocam-outline" size={24} color={t.headerText} />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {},
  row: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  backBtn: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 4,
  },
  titleBlock: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  title: { fontSize: 17, fontWeight: '600' },
  subtitle: { fontSize: 13, marginTop: 1 },
  actions: { flexDirection: 'row', alignItems: 'center', paddingRight: 4 },
  iconBtn: { paddingHorizontal: 8, paddingVertical: 4 },
});
