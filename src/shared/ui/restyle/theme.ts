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
  smd: 6,
  md: 12,
  /** Vertical line beside quoted text (px); pair with `sm` for bar→text gap. */
  messageQuoteBarWidth: 3,
  /** Quoted image/video preview in the reply strip (side length, px). */
  messageQuoteThumb: 40,
  /** Thumbnail in an image-file attachment bubble (side length, px). */
  messageAttachmentThumb: 72,
  /** Min width reserved for the timestamp on the last line (px). */
  messageBubbleTimeColumnReserve: 44,
  /** Message list horizontal inset (per side) — `LIST_H_PADDING` is `2 * this`. */
  messageListH: 10,
  messageListV: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
} as const;

const borderRadii = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 10,
  lg: 12,
  /** Chat row long-press action sheet (iOS-style grouped card). */
  actionSheet: 20,
  /** Long-press modal chat preview (peek) panel corners. */
  chatPeek: 14,
  /** Default bubble corner (non-cluster or inner corners). */
  messageBubble: 16,
  /**
   * Outer top corner of the first message in a group (slightly “tighter” before a true tail / SVG).
   * Incoming: top-left. Outgoing: top-right.
   */
  messageBubbleGroupAnchor: 2,
  /** Thin strip beside quoted-reply line. */
  messageQuoteBar: 2,
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
    chatUnreadBadge: {
      fontSize: 13,
      fontWeight: '600',
      color: 'chatUnreadBadgeLabel',
    },
    swipeActionStripLabel: {
      fontSize: 13,
      fontWeight: '500',
    },
    actionSheetLabel: {
      fontSize: 17,
      fontWeight: '500',
      letterSpacing: -0.2,
      color: 'textPrimary',
      flexShrink: 1,
    },
    actionSheetLabelDestructive: {
      fontSize: 17,
      fontWeight: '500',
      letterSpacing: -0.2,
      color: 'contextMenuDanger',
      flexShrink: 1,
    },
    /** Chat peek / overlay modal top bar */
    chatPeekHeaderTitle: {
      fontSize: 17,
      fontWeight: '600',
      letterSpacing: -0.4,
      color: 'navBarText',
      textAlign: 'center',
    },
    chatPeekHeaderSubtitle: {
      fontSize: 13,
      marginTop: 'xxs',
      color: 'textSecondary',
      textAlign: 'center',
    },
    messageBody: {
      fontSize: 16,
      lineHeight: 21,
      color: 'textPrimary',
      flexShrink: 1,
      minWidth: 0,
    },
    messageBubbleTime: {
      fontSize: 11,
      lineHeight: 16,
      fontStyle: 'italic',
      fontWeight: '500',
      color: 'messageTimeOnBubble',
      marginLeft: 'smd',
      flexShrink: 0,
    },
    messageReplyAuthor: {
      fontSize: 14,
      lineHeight: 18,
      fontWeight: '600',
      color: 'messageReplyAuthor',
    },
    messageReplyBody: {
      fontSize: 14,
      lineHeight: 18,
      marginTop: 'xxs',
      color: 'messageReplyBody',
    },
    messageAttachmentName: {
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '600',
      color: 'textPrimary',
      flexShrink: 1,
      minWidth: 0,
    },
    messageAttachmentSize: {
      fontSize: 13,
      lineHeight: 16,
      marginTop: 'xxs',
      color: 'textSecondary',
      flexShrink: 1,
      minWidth: 0,
    },
  },
});

export type Theme = typeof lightTheme;

export const darkTheme: Theme = {
  ...lightTheme,
  colors: palette(appTheme.dark) as unknown as Theme['colors'],
};
