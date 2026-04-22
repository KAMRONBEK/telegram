import { useTheme } from '@shopify/restyle';
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  type LayoutChangeEvent,
  type ListRenderItemInfo,
  useWindowDimensions,
} from 'react-native';

import type { Message } from '@/entities/message';
import { Box, type Theme } from '@/shared/ui/restyle';

import { MessageBubble } from './MessageBubble';

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
  {
    id: 'm4',
    chatId: '1',
    text: 'I will be free tomorrow.',
    outgoing: false,
    time: '10:41',
    replyTo: { kind: 'image', authorName: 'John Doe', caption: 'Photo' },
  },
  {
    id: 'm5',
    chatId: '1',
    text: "Do you know what time is it? When you are free, let's go to the gym.",
    outgoing: false,
    time: '11:40',
    replyTo: {
      kind: 'image',
      authorName: 'Martha Craig',
      caption: 'Good morning!',
      previewUri: 'https://picsum.photos/seed/tes-quote/80/80',
    },
  },
  {
    id: 'm6',
    chatId: '1',
    text: 'I will be free tomorrow.',
    outgoing: true,
    time: '11:51',
    readReceipt: true,
  },
  {
    id: 'm7',
    chatId: '1',
    text: '',
    outgoing: true,
    time: '11:51',
    readReceipt: true,
    attachment: {
      kind: 'image',
      fileName: 'IMG_0483.PNG',
      sizeLabel: '2.8 MB',
      previewUri: 'https://picsum.photos/seed/tes-sushi/120/120',
    },
  },
  {
    id: 'm8',
    chatId: '1',
    text: '',
    outgoing: false,
    time: '11:52',
    readReceipt: true,
    attachment: {
      kind: 'image',
      fileName: 'IMG_0484.PNG',
      sizeLabel: '1.2 MB',
      previewUri: 'https://picsum.photos/seed/tes-noodles/120/120',
    },
  },
];

type Props = {
  chatId: string;
  /** When false, list is static (e.g. chat peek preview). */
  scrollEnabled?: boolean;
};

export function MessageList({ chatId, scrollEnabled = true }: Props) {
  const { colors, spacing } = useTheme<Theme>();
  const data = useMemo(() => MOCK.filter((m) => m.chatId === chatId), [chatId]);
  const { width: windowWidth } = useWindowDimensions();
  const [lineWidth, setLineWidth] = useState(0);
  const listHPad = spacing.messageListH * 2;
  const listBodyWidth = lineWidth > 0 ? lineWidth : Math.max(0, windowWidth - listHPad);
  const maxBubbleWidth = Math.max(120, listBodyWidth * 0.78);

  const onListLayout = useCallback((e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setLineWidth((prev) => (Math.abs(w - prev) < 0.5 ? prev : w));
  }, []);

  const renderItem = useCallback(
    ({ index, item }: ListRenderItemInfo<Message>) => {
      const prev = index > 0 ? data[index - 1] : null;
      const next = index < data.length - 1 ? data[index + 1] : null;
      const isFirstInGroup = !prev || prev.outgoing !== item.outgoing;
      const isLastInGroup = !next || next.outgoing !== item.outgoing;
      return (
        <Box
          width="100%"
          style={{ marginBottom: spacing.xs }}
          flexDirection="row"
          justifyContent={item.outgoing ? 'flex-end' : 'flex-start'}
        >
          <MessageBubble
            isFirstInGroup={isFirstInGroup}
            isLastInGroup={isLastInGroup}
            maxBubbleWidth={maxBubbleWidth}
            message={item}
          />
        </Box>
      );
    },
    [data, maxBubbleWidth, spacing.xs]
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  return (
    <Box flex={1} width="100%" onLayout={onListLayout}>
      <FlatList
        style={{ flex: 1, width: '100%' }}
        data={data}
        keyExtractor={keyExtractor}
        scrollEnabled={scrollEnabled}
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: colors.chatWallpaper,
          paddingHorizontal: spacing.messageListH,
          paddingVertical: spacing.messageListV,
        }}
        renderItem={renderItem}
      />
    </Box>
  );
}
