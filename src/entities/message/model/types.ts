export type QuotedText = {
  kind: 'text';
  authorName: string;
  text: string;
};

export type QuotedImage = {
  kind: 'image';
  authorName: string;
  /** Optional user caption. */
  caption?: string;
  /** When set, a thumbnail is shown in the quote bar (remote, file, or `ph://` URI). */
  previewUri?: string;
};

export type QuotedVideo = {
  kind: 'video';
  authorName: string;
  title?: string;
  /** Poster / preview frame; thumbnail shown in the quote bar when set. */
  previewUri?: string;
};

export type QuotedFile = {
  kind: 'file';
  authorName: string;
  fileName: string;
};

export type QuotedAudio = {
  kind: 'audio' | 'voice';
  authorName: string;
  label?: string;
};

export type QuotedMessageRef =
  | QuotedText
  | QuotedImage
  | QuotedVideo
  | QuotedFile
  | QuotedAudio;

/** Image sent as a file row (thumbnail + filename + size), Telegram-style. */
export type MessageImageAttachment = {
  kind: 'image';
  fileName: string;
  /** Human-readable size, e.g. `2.8 MB`. */
  sizeLabel: string;
  previewUri: string;
};

export type Message = {
  id: string;
  chatId: string;
  text: string;
  outgoing: boolean;
  time: string;
  /** Message this one replies to (thread / quote preview in the bubble). */
  replyTo?: QuotedMessageRef;
  attachment?: MessageImageAttachment;
  /** When set on outgoing messages, shows checkmarks next to the status line. */
  readReceipt?: boolean;
};
