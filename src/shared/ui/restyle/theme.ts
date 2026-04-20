import { createTheme } from '@shopify/restyle';

import { appTheme } from '@/shared/config/theme';

function palette<T extends Record<string, string>>(p: T): T {
  return { ...p };
}

const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
} as const;

const borderRadii = {
  none: 0,
  sm: 8,
  md: 10,
  lg: 12,
  full: 9999,
} as const;

export const lightTheme = createTheme({
  colors: palette(appTheme.light),
  spacing,
  borderRadii,
  textVariants: {
    defaults: {
      color: 'textPrimary',
      fontSize: 16,
    },
    navTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: 'navBarText',
      textAlign: 'center',
      width: '100%',
    },
    navSideLabel: {
      fontSize: 17,
    },
    searchIdleLabel: {
      fontSize: 16,
      flexShrink: 1,
    },
    tabLabel: {
      fontSize: 10,
      fontWeight: '500',
    },
    railLabel: {
      fontSize: 9,
      fontWeight: '500',
    },
    avatarLetter: {
      fontWeight: '600',
      color: 'avatarText',
    },
    badgeLabel: {
      fontSize: 10,
      fontWeight: '700',
      color: 'badgeText',
    },
    sectionLabel: {
      fontSize: 15,
      fontWeight: '500',
      color: 'textSecondary',
    },
    chatRowTitle: {
      fontSize: 17,
      fontWeight: '500',
      color: 'textPrimary',
    },
    chatRowPreview: {
      fontSize: 16,
      fontWeight: '400',
      color: 'textSecondary',
    },
    chatRowTime: {
      fontSize: 15,
      color: 'messageTime',
    },
    chatRowBadge: {
      fontSize: 13,
      fontWeight: '600',
      color: 'badgeText',
    },
    swipeActionStripLabel: {
      fontSize: 13,
      fontWeight: '500',
    },
  },
});

export type Theme = typeof lightTheme;

export const darkTheme: Theme = {
  ...lightTheme,
  colors: palette(appTheme.dark) as unknown as Theme['colors'],
};
