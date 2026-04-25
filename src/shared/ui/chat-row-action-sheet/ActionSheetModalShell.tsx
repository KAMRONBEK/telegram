import { type ReactNode } from 'react';
import { Modal, Platform, Pressable } from 'react-native';

import { Box, type Theme } from '@/shared/ui/restyle';

export type ActionSheetModalShellProps = {
  visible: boolean;
  onClose: () => void;
  /** Shown for the full-screen dim tap target (screen readers). */
  backdropAccessibilityLabel?: string;
  /** Restyle color key for the dimmed fill behind the modal content. Defaults to `actionSheetBackdrop`. */
  backdropColor?: keyof Theme['colors'];
  /**
   * Web: pass viewport height so the dim fills the window when modal content
   * is shorter than the viewport.
   */
  contentMinHeight?: number;
  children: ReactNode;
};

/** Shared transparent `Modal`, dimmed backdrop, and full-screen dismiss `Pressable`. */
export function ActionSheetModalShell({
  visible,
  onClose,
  backdropAccessibilityLabel = 'Close',
  backdropColor = 'actionSheetBackdrop',
  contentMinHeight,
  children,
}: ActionSheetModalShellProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={Platform.OS === 'android'}
      presentationStyle={Platform.OS === 'ios' ? 'overFullScreen' : undefined}
    >
      <Box
        flex={1}
        width="100%"
        backgroundColor={backdropColor}
        style={contentMinHeight !== undefined ? { minHeight: contentMinHeight } : undefined}
      >
        <Box position="absolute" top={0} left={0} right={0} bottom={0} zIndex={0}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={backdropAccessibilityLabel}
            onPress={onClose}
            style={{ flex: 1 }}
          />
        </Box>
        {children}
      </Box>
    </Modal>
  );
}
