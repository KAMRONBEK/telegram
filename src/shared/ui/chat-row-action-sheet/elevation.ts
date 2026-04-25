import { Platform, type ViewStyle } from 'react-native';

import type { Theme } from '@/shared/ui/restyle';

type AppColors = Theme['colors'];

/**
 * Elevation for the small floating action menu (web popover or wrapped menu in native modal).
 * Uses theme colors for iOS `shadowColor` and web `box-shadow`.
 */
export function actionSheetMenuCardElevation(colors: AppColors): ViewStyle {
  return Platform.select({
    ios: {
      shadowColor: colors.messageBubbleShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
    },
    android: { elevation: 6 },
    default: { boxShadow: `0 4px 16px ${colors.messageBubbleWebShadow}` },
  }) as ViewStyle;
}

/**
 * Elevation for the large chat “peek” preview in the long-press modal.
 */
export function chatPeekCardElevation(colors: AppColors): ViewStyle {
  return Platform.select({
    ios: {
      shadowColor: colors.messageBubbleShadow,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.35,
      shadowRadius: 24,
    },
    android: { elevation: 16 },
    default: { boxShadow: `0 12px 32px ${colors.chatPeekDropShadow}` },
  }) as ViewStyle;
}
