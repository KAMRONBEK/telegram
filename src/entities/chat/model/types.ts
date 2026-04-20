export type Chat = {
  id: string;
  title: string;
  lastMessage: string;
  time: string;
  unread: number;
  /** When true, unread pill uses muted styling (lower emphasis). */
  muted?: boolean;
};
