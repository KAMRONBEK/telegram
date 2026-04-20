export type Chat = {
  id: string;
  title: string;
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
