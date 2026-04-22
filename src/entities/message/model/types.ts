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

export type Message = {
  id: string;
  chatId: string;
  text: string;
  outgoing: boolean;
  time: string;
  /** Message this one replies to (thread / quote preview in the bubble). */
  replyTo?: QuotedMessageRef;
};
