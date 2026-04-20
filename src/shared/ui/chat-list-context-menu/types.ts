export type ChatListMenuStack = 'root' | 'mute' | 'folder';

export type ChatListMenuAction =
  | 'openInWindow'
  | 'pin'
  | 'mute'
  | 'mute1h'
  | 'mute8h'
  | 'mute2d'
  | 'muteDisable'
  | 'markRead'
  | 'markUnread'
  | 'preview'
  | 'archive'
  | 'addToFolder'
  | 'folderWork'
  | 'folderPersonal'
  | 'clearHistory'
  | 'deleteChat';
