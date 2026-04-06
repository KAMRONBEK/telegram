import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';

import type { Message } from '@/entities/message';
import { appTheme } from '@/shared/config/theme';
import { useColorScheme } from '@/shared/lib/hooks';

const MOCK: Message[] = [
  { id: 'm1', chatId: '1', text: 'Hey — ready for the release?', outgoing: false, time: '10:38' },
  { id: 'm2', chatId: '1', text: 'Almost, fixing the last bug.', outgoing: true, time: '10:39' },
  {
    id: 'm3',
    chatId: '1',
    text: 'Great, ping me when green.',
    outgoing: false,
    time: '10:40',
  },
];

type Props = {
  chatId: string;
  /** When false, list is static (e.g. chat peek preview). */
  scrollEnabled?: boolean;
};

export function MessageList({ chatId, scrollEnabled = true }: Props) {
  const scheme = useColorScheme();
  const t = appTheme[scheme];
  const data = MOCK.filter((m) => m.chatId === chatId);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      scrollEnabled={scrollEnabled}
      contentContainerStyle={[styles.list, { backgroundColor: t.chatWallpaper }]}
      renderItem={({ item, index }) => {
        const prev = index > 0 ? data[index - 1] : null;
        const gap = prev && prev.outgoing === item.outgoing ? 2 : 10;
        return (
          <View style={{ marginBottom: gap }}>
            <View style={[styles.row, item.outgoing ? styles.rowOut : styles.rowIn]}>
              <View
                style={[
                  styles.bubble,
                  {
                    backgroundColor: item.outgoing ? t.bubbleOutgoing : t.bubbleIncoming,
                    borderWidth: scheme === 'light' && !item.outgoing ? StyleSheet.hairlineWidth : 0,
                    borderColor: t.bubbleBorder,
                    ...Platform.select({
                      ios: {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 0.5 },
                        shadowOpacity: scheme === 'light' ? 0.12 : 0.2,
                        shadowRadius: 1,
                      },
                      android: { elevation: 1 },
                      default: {},
                    }),
                  },
                ]}>
                <Text style={[styles.messageText, { color: t.textPrimary }]}>{item.text}</Text>
                <View style={styles.meta}>
                  <Text style={[styles.time, { color: t.messageTimeOnBubble }]}>{item.time}</Text>
                </View>
              </View>
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 10, paddingVertical: 12, flexGrow: 1 },
  row: { flexDirection: 'row' },
  rowOut: { justifyContent: 'flex-end' },
  rowIn: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '78%',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 21,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  time: {
    fontSize: 11,
    fontWeight: '500',
  },
});
