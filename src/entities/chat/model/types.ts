export type Chat = {
  id: string;
  /** When true, the row uses the Saved Messages gradient avatar instead of initials/photo. */
  savedMessages?: boolean;
  title: string;
  /** Status line shown under the title in headers/peek overlays (e.g. "last seen recently", "online", "3 members"). */
  subtitle?: string;
  lastMessage: string;
  time: string;
  unread: number;
  /** When true, unread pill uses muted styling (lower emphasis). */
  muted?: boolean;
  /**
   * Outgoing message ticks beside the time. Omitted when there is nothing to show.
   * `false` — one check (sent / delivered); `true` — double check (read).
   */
  readReceipt?: boolean;
};
