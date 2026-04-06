import { Modal, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { appTheme } from '@/shared/config/theme';
import { ChatPeekShell } from '@/widgets/chat-peek-shell';

type Props = {
  visible: boolean;
  chatId: string;
  scheme: 'light' | 'dark';
};

export function ChatPeekOverlay({ visible, chatId, scheme }: Props) {
  const t = appTheme[scheme];
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const maxCardWidth = Math.min(width - 32, 400);
  const cardHeight = Math.round(height * 0.72);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent={Platform.OS === 'android'}>
      <View
        style={[
          styles.root,
          {
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + 12,
            paddingHorizontal: 16,
            backgroundColor: t.contextMenuBackdrop,
          },
        ]}
        pointerEvents="box-none">
        <View
          style={[
            styles.card,
            {
              backgroundColor: t.chatWallpaper,
              height: cardHeight,
              maxWidth: maxCardWidth,
              width: '100%',
              alignSelf: 'center',
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.35,
                  shadowRadius: 24,
                },
                android: { elevation: 16 },
                default: {
                  boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
                },
              }),
            },
          ]}>
          <ChatPeekShell chatId={chatId} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    minHeight: 280,
  },
});
