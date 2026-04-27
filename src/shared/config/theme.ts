/**
 * Telegram-inspired tokens (generic styling — not Telegram assets).
 * Reference: blue nav, white chat rows, green outgoing bubbles, gray chat wallpaper.
 */
export const appTheme = {
  light: {
    // Main nav (chat list top)
    navBar: 'rgba(246, 246, 246, 1)',
    navBarText: '#000000',
    navBarSecondary: '#3390EC',
    /** Leading/trailing bar controls (e.g. Edit, compose). */
    navBarSideItem: '#037EE5',
    // Chat list
    chatListScreenBg: 'rgba(246, 246, 246, 1)',
    chatListRow: '#FFFFFF',
    chatListRowPressed: '#E8E8E8',
    rowSeparator: 'rgba(60, 60, 67, 0.29)',
    // Conversation
    chatWallpaper: '#E7EBF0',
    headerBar: '#5288C3',
    headerText: '#FFFFFF',
    headerSubtitle: 'rgba(255,255,255,0.75)',
    /** Current user (outgoing) message bubble. */
    bubbleOutgoing: '#E1FEC6',
    /** Other user (incoming) message bubble. */
    bubbleIncoming: '#FFFFFF',
    bubbleBorder: 'rgba(0,0,0,0.04)',
    messageTime: '#9B9B9B',
    messageTimeOnBubble: 'rgba(0,0,0,0.45)',
    /** Timestamp on the current user’s bubble (light). */
    messageTimeOnBubbleOutgoing: '#21C004',
    /** Inline reply bar + author (light: accent; matches `tint`). */
    messageReplyBar: '#3390EC',
    messageReplyAuthor: '#3390EC',
    messageReplyBody: '#000000',
    /** Image-file attachment filename in the bubble (outgoing light bubble). */
    messageImageAttachmentName: '#3EAA3C',
    /** File size line on image attachment (outgoing light bubble). */
    messageImageAttachmentSizeOutgoing: '#6FB26A',
    /** iOS (react-native) shadow; web uses `messageBubbleWebShadow` for `box-shadow`. */
    messageBubbleShadow: '#000000',
    /** Web: last color in `0 0.5px 1px <alpha>`. */
    messageBubbleWebShadow: 'rgba(0,0,0,0.12)',
    // Composer (message input bar)
    composerBar: '#F6F6F6',
    /** Hairline under nav / above thread */
    composerBarTop: 'rgba(0,0,0,0.08)',
    composerField: '#FFFFFF',
    composerFieldBorder: 'rgba(0,0,0,0.1)',
    /** Attach, in-field actions, voice; placeholder “Message” */
    composerIcon: '#858E99',
    /** Send icon in composer (active) — iOS system blue. */
    composerSend: '#007AFF',
    sendButton: '#5288C3',
    // Legacy / shared
    background: '#E7EBF0',
    listItem: '#FFFFFF',
    listItemActive: '#E4EDF5',
    textPrimary: '#000000',
    textSecondary: '#8E8E93',
    border: '#C8C7CC',
    tabBar: 'rgba(246, 246, 246, 1)',
    tint: '#3390EC',
    avatarText: '#FFFFFF',
    badgeUnread: '#4FA3F7',
    badgeDanger: '#FF3B30',
    badgeText: '#FFFFFF',
    /** Chat row unread pill — unmuted (draws attention). */
    chatUnreadBadgeActiveBg: '#037EE5',
    /** Chat row unread pill — muted conversation. */
    chatUnreadBadgeMutedBg: '#AEAEB2',
    chatUnreadBadgeLabel: '#FFFFFF',
    /** Chat list row — double-tick read / delivered indicator (outgoing). */
    chatReadReceiptTicks: '#21C004',
    /** Inline mute glyph beside chat title (muted conversation). */
    chatInlineMuteIcon: '#AEAEB2',
    searchFieldBg: 'rgba(255,255,255,0.22)',
    searchFieldPlaceholder: 'rgba(255,255,255,0.75)',
    searchMic: 'rgba(255,255,255,0.9)',
    splitBorder: 'rgba(0,0,0,0.12)',
    splitEmptyText: '#8E8E93',
    fabShadow: 'rgba(0,0,0,0.2)',
    railBg: '#F0F0F0',
    railItemActive: 'rgba(51, 144, 236, 0.12)',
    // Search input tokens (including use within navigation bars) — iOS system fill
    searchInputBg: 'rgba(118, 118, 128, 0.12)',
    searchInputIcon: '#8E8E93',
    searchInputPlaceholder: '#8E8E93',
    // Chat row context menu
    contextMenuBg: '#FFFFFF',
    contextMenuSeparator: 'rgba(0,0,0,0.08)',
    contextMenuDanger: '#FF3B30',
    contextMenuBackdrop: 'rgba(0,0,0,0.2)',
    /** Grouped “action sheet” surface (chat row long-press menu). */
    actionSheetSurface: '#F2F2F7',
    actionSheetSeparator: '#D1D1D6',
    /** Dimmed area behind the chat row action sheet (separate from the compact context menu). */
    actionSheetBackdrop: 'rgba(0,0,0,0.35)',
    /** Native long-press peek + menu modal — scrim outside the cards. */
    chatListContextModalBackdrop: 'rgba(133, 142, 150, 0.5)',
    /** Web / composited shadow color for long-press chat peek card. */
    chatPeekDropShadow: 'rgba(0,0,0,0.35)',
    // Chat list swipe actions
    chatListSwipeUnread: '#007ee5',
    chatListSwipePin: '#00c900',
    chatListSwipeMute: '#f09a37',
    chatListSwipeArchive: '#bbbbc3',
    chatListSwipeDelete: '#fe3b30',
    chatListSwipeActionLabel: '#FFFFFF',
    /** Saved Messages row avatar — gradient top (sky blue). */
    savedMessagesAvatarGradientTop: '#6FD4FC',
    /** Saved Messages row avatar — gradient bottom (medium blue). */
    savedMessagesAvatarGradientBottom: '#2B9EF0',
    /** Saved Messages row avatar — bookmark glyph. */
    savedMessagesAvatarIcon: '#FFFFFF',
    /** Appearance — theme picker tile selected frame + label. */
    themePickerActiveBorder: '#037EE5',
    /** Appearance — theme picker tile idle preview outline. */
    themePickerInactiveBorder: 'rgba(120, 120, 128, 0.2)',
    /** Settings — horizontal color theme tile carousel strip. */
    colorThemeCarouselStrip: '#FFFFFF',
  },
  dark: {
    navBar: 'rgba(28, 28, 30, 1)',
    navBarText: '#FFFFFF',
    navBarSecondary: 'rgba(255,255,255,0.65)',
    navBarSideItem: '#FFFFFF',
    chatListScreenBg: 'rgba(28, 28, 30, 1)',
    chatListRow: '#000000',
    chatListRowPressed: '#1C1C1E',
    rowSeparator: 'rgba(84, 84, 88, 0.65)',
    chatWallpaper: '#0E1621',
    headerBar: '#212D3B',
    headerText: '#FFFFFF',
    headerSubtitle: 'rgba(255,255,255,0.55)',
    bubbleOutgoing: '#313131',
    bubbleIncoming: '#262628',
    bubbleBorder: 'rgba(255,255,255,0.04)',
    messageTime: '#8E8E93',
    messageTimeOnBubble: 'rgba(255,255,255,0.55)',
    messageTimeOnBubbleOutgoing: 'rgba(255,255,255,0.55)',
    messageReplyBar: 'rgba(255,255,255,0.55)',
    messageReplyAuthor: '#FFFFFF',
    messageReplyBody: 'rgba(255,255,255,0.85)',
    messageImageAttachmentName: '#FFFFFF',
    messageImageAttachmentSizeOutgoing: '#8E8E93',
    messageBubbleShadow: '#000000',
    messageBubbleWebShadow: 'rgba(0,0,0,0.32)',
    composerBar: '#1C1C1D',
    composerBarTop: 'rgba(255,255,255,0.1)',
    composerField: '#060606',
    composerFieldBorder: 'rgba(255,255,255,0.12)',
    composerIcon: '#7F7F7F',
    composerSend: '#007AFF',
    sendButton: '#5288C3',
    background: '#0E1621',
    listItem: '#000000',
    listItemActive: '#2B5278',
    textPrimary: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#2B2B2B',
    tabBar: 'rgba(28, 28, 30, 1)',
    tint: '#6AB7FF',
    avatarText: '#FFFFFF',
    badgeUnread: '#5288C3',
    badgeDanger: '#FF453A',
    badgeText: '#FFFFFF',
    chatUnreadBadgeActiveBg: '#FFFFFF',
    chatUnreadBadgeMutedBg: '#636366',
    chatUnreadBadgeLabel: '#000000',
    chatReadReceiptTicks: '#FFFFFF',
    chatInlineMuteIcon: '#636366',
    searchFieldBg: 'rgba(255,255,255,0.12)',
    searchFieldPlaceholder: 'rgba(255,255,255,0.45)',
    searchMic: 'rgba(255,255,255,0.65)',
    splitBorder: 'rgba(255,255,255,0.08)',
    splitEmptyText: '#8E8E93',
    fabShadow: 'rgba(0,0,0,0.4)',
    railBg: '#1C1C1E',
    railItemActive: 'rgba(106, 183, 255, 0.15)',
    // Search input tokens (including use within navigation bars) — iOS system fill (dark)
    searchInputBg: 'rgba(0, 0, 0, 0.45)',
    searchInputIcon: '#8E8E93',
    searchInputPlaceholder: '#8E8E93',
    contextMenuBg: '#1C242F',
    contextMenuSeparator: '#2C3540',
    contextMenuDanger: '#FF595A',
    contextMenuBackdrop: 'rgba(0,0,0,0.35)',
    actionSheetSurface: '#2C2C2E',
    actionSheetSeparator: 'rgba(84, 84, 88, 0.48)',
    /**
     * `rgba(0,0,0,α)` over pure-black rows (#000) does not change the output pixel (alpha-blend math).
     * A subtle white haze is visible on dark UI (iOS / Telegram-style sheet dim).
     */
    actionSheetBackdrop: 'rgba(255, 255, 255, 0.16)',
    /** Native long-press peek + menu modal — scrim outside the cards. */
    chatListContextModalBackdrop: 'rgba(0, 0, 0, 0.6)',
    /** Web `box-shadow` last color (large peek / modal cards, combined with x/y/radius in code). */
    chatPeekDropShadow: 'rgba(0,0,0,0.35)',
    chatListSwipeUnread: '#666666',
    chatListSwipePin: '#08a723',
    chatListSwipeMute: '#cd7800',
    chatListSwipeArchive: '#666666',
    chatListSwipeDelete: '#c60c0c',
    chatListSwipeActionLabel: '#FFFFFF',
    savedMessagesAvatarGradientTop: '#6FD4FC',
    savedMessagesAvatarGradientBottom: '#2B9EF0',
    savedMessagesAvatarIcon: '#FFFFFF',
    themePickerActiveBorder: '#037EE5',
    themePickerInactiveBorder: 'rgba(120, 120, 128, 0.2)',
    colorThemeCarouselStrip: '#1C1C1D',
  },
} as const;

export type AppColorScheme = keyof typeof appTheme;

/**
 * Swatches for appearance-picker preview tiles (fixed palettes; independent of system light/dark).
 * Hex lives here so UI components stay token-driven per Restyle conventions.
 */
export type ThemePickerTilePreview = {
  wallpaper: string;
  bubbleIncoming: string;
  bubbleOutgoing: string;
};

export const themePickerTilePresets = {
  classic: {
    wallpaper: '#CCE4F9',
    bubbleIncoming: '#FFFFFF',
    bubbleOutgoing: '#E1FEC6',
  },
  day: {
    wallpaper: '#FFFFFF',
    bubbleIncoming: '#D4DDE6',
    bubbleOutgoing: '#057AFE',
  },
  night: {
    wallpaper: '#000000',
    bubbleIncoming: '#202020',
    bubbleOutgoing: '#313131',
  },
  tintedBlue: {
    wallpaper: '#18222D',
    bubbleIncoming: '#213140',
    bubbleOutgoing: '#3E6A97',
  },
} as const satisfies Record<string, ThemePickerTilePreview>;

export type ColorThemeOptionId = keyof typeof themePickerTilePresets;

/** Order and labels for the appearance color-theme picker + live preview. */
export const colorThemeOptions: { id: ColorThemeOptionId; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'day', label: 'Day' },
  { id: 'night', label: 'Night' },
  { id: 'tintedBlue', label: 'Tinted' },
];

/**
 * Typography / chrome colors for the theme preview message block (not part of app light/dark scheme).
 * Paired with {@link themePickerTilePresets} for each option.
 */
export type ThemePreviewCopyPalette = {
  messageText: string;
  replyBar: string;
  replyAuthor: string;
  replyBody: string;
  timeIncoming: string;
  timeOnOutgoing: string;
  readReceipt: string;
};

export const themePreviewCopyPalettes = {
  classic: {
    messageText: '#000000',
    replyBar: '#3390EC',
    replyAuthor: '#3390EC',
    replyBody: '#000000',
    timeIncoming: 'rgba(0,0,0,0.45)',
    timeOnOutgoing: '#21C004',
    readReceipt: '#21C004',
  },
  day: {
    messageText: '#000000',
    replyBar: '#057AFE',
    replyAuthor: '#057AFE',
    replyBody: '#000000',
    timeIncoming: 'rgba(0,0,0,0.45)',
    timeOnOutgoing: '#FFFFFF',
    readReceipt: '#FFFFFF',
  },
  night: {
    messageText: '#FFFFFF',
    replyBar: 'rgba(255,255,255,0.55)',
    replyAuthor: '#FFFFFF',
    replyBody: 'rgba(255,255,255,0.85)',
    timeIncoming: 'rgba(255,255,255,0.55)',
    timeOnOutgoing: 'rgba(255,255,255,0.55)',
    readReceipt: '#FFFFFF',
  },
  tintedBlue: {
    messageText: '#FFFFFF',
    replyBar: '#6AB7FF',
    replyAuthor: '#6AB7FF',
    replyBody: 'rgba(255,255,255,0.9)',
    timeIncoming: 'rgba(255,255,255,0.55)',
    timeOnOutgoing: 'rgba(255,255,255,0.55)',
    readReceipt: '#FFFFFF',
  },
} as const satisfies Record<ColorThemeOptionId, ThemePreviewCopyPalette>;
