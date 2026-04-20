import { AntDesign, Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { appTheme } from '@/shared/config/theme';

import type { ChatListMenuAction, ChatListMenuStack } from './types';

const MENU_MIN_WIDTH = 220;
const MENU_ESTIMATE_HEIGHT_ROOT = 380;
const MENU_ESTIMATE_HEIGHT_SUB = 168;

const ICON_SIZE = 18;
const CHEVRON_SIZE = 14;

type Props = {
  visible: boolean;
  onClose: () => void;
  anchor: { x: number; y: number };
  scheme: 'light' | 'dark';
  chatId: string;
  onMenuAction?: (action: ChatListMenuAction, chatId: string) => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export function ChatListContextMenu({
  visible,
  onClose,
  anchor,
  scheme,
  chatId,
  onMenuAction,
}: Props) {
  const t = appTheme[scheme];
  const { width: vw, height: vh } = useWindowDimensions();
  const [stack, setStack] = useState<ChatListMenuStack>('root');
  const [menuSize, setMenuSize] = useState({ w: MENU_MIN_WIDTH, h: MENU_ESTIMATE_HEIGHT_ROOT });

  useEffect(() => {
    if (visible) {
      setStack('root');
    }
  }, [visible]);

  useEffect(() => {
    if (stack === 'root') {
      setMenuSize((s) => ({ ...s, h: MENU_ESTIMATE_HEIGHT_ROOT }));
    } else {
      setMenuSize((s) => ({ ...s, h: MENU_ESTIMATE_HEIGHT_SUB }));
    }
  }, [stack]);

  const position = useMemo(() => {
    const w = menuSize.w;
    const h = menuSize.h;
    const left = clamp(anchor.x, 8, Math.max(8, vw - w - 8));
    const top = clamp(anchor.y, 8, Math.max(8, vh - h - 8));
    return { left, top };
  }, [anchor.x, anchor.y, menuSize.w, menuSize.h, vw, vh]);

  const emit = useCallback(
    (action: ChatListMenuAction) => {
      onMenuAction?.(action, chatId);
      onClose();
    },
    [chatId, onClose, onMenuAction]
  );

  const onMenuLayout = useCallback(
    (e: { nativeEvent: { layout: { width: number; height: number } } }) => {
      const { width, height } = e.nativeEvent.layout;
      if (width > 0 && height > 0) {
        setMenuSize({ w: width, h: height });
      }
    },
    []
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={Platform.OS === 'android'}
    >
      <View style={styles.modalRoot} pointerEvents="box-none">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close menu"
          style={[styles.backdrop, { backgroundColor: t.contextMenuBackdrop }]}
          onPress={onClose}
        />
        <View
          style={[styles.menuWrap, { left: position.left, top: position.top }]}
          onLayout={onMenuLayout}
          pointerEvents="box-none"
        >
          <View
            style={[
              styles.menu,
              {
                backgroundColor: t.contextMenuBg,
                ...Platform.select({
                  ios: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.35,
                    shadowRadius: 16,
                  },
                  android: { elevation: 12 },
                  default: {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                  },
                }),
              },
            ]}
          >
            {stack === 'root' ? (
              <RootMenu
                scheme={scheme}
                onNavigateMute={() => setStack('mute')}
                onNavigateFolder={() => setStack('folder')}
                onAction={emit}
              />
            ) : stack === 'mute' ? (
              <MuteSubmenu scheme={scheme} onBack={() => setStack('root')} onAction={emit} />
            ) : (
              <FolderSubmenu scheme={scheme} onBack={() => setStack('root')} onAction={emit} />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Separator({ color }: { color: string }) {
  return <View style={[styles.separator, { backgroundColor: color }]} />;
}

type IonIconName = ComponentProps<typeof Ionicons>['name'];
type AntIconName = ComponentProps<typeof AntDesign>['name'];

type RowProps = {
  scheme: 'light' | 'dark';
  label: string;
  onPress: () => void;
  destructive?: boolean;
  showChevron?: boolean;
} & (
  | { icon: IonIconName; iconFamily?: 'ionicons' }
  | { icon: AntIconName; iconFamily: 'antdesign' }
);

function MenuRow(props: RowProps) {
  const { scheme, label, onPress, destructive, showChevron } = props;
  const t = appTheme[scheme];
  const color = destructive ? t.contextMenuDanger : t.textPrimary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.75 }]}
    >
      {props.iconFamily === 'antdesign' ? (
        <AntDesign name={props.icon} size={ICON_SIZE} color={color} style={styles.rowIcon} />
      ) : (
        <Ionicons name={props.icon} size={ICON_SIZE} color={color} style={styles.rowIcon} />
      )}
      <Text style={[styles.rowLabel, { color }]} numberOfLines={1}>
        {label}
      </Text>
      {showChevron ? (
        <Ionicons name="chevron-forward" size={CHEVRON_SIZE} color={t.textSecondary} />
      ) : (
        <View style={styles.rowChevronSpacer} />
      )}
    </Pressable>
  );
}

function SubmenuHeader({
  scheme,
  title,
  onBack,
}: {
  scheme: 'light' | 'dark';
  title: string;
  onBack: () => void;
}) {
  const t = appTheme[scheme];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Back from ${title}`}
      onPress={onBack}
      style={({ pressed }) => [styles.subHeader, pressed && { opacity: 0.75 }]}
    >
      <Ionicons name="chevron-back" size={ICON_SIZE} color={t.tint} />
      <Text style={[styles.subHeaderTitle, { color: t.textPrimary }]}>{title}</Text>
    </Pressable>
  );
}

function RootMenu({
  scheme,
  onNavigateMute,
  onNavigateFolder,
  onAction,
}: {
  scheme: 'light' | 'dark';
  onNavigateMute: () => void;
  onNavigateFolder: () => void;
  onAction: (a: ChatListMenuAction) => void;
}) {
  const t = appTheme[scheme];
  return (
    <View>
      <MenuRow
        scheme={scheme}
        label="Open in window"
        icon="open-outline"
        onPress={() => onAction('openInWindow')}
      />
      <Separator color={t.contextMenuSeparator} />
      <MenuRow
        scheme={scheme}
        label="Pin"
        icon="pushpin"
        iconFamily="antdesign"
        onPress={() => onAction('pin')}
      />
      <MenuRow
        scheme={scheme}
        label="Mute"
        icon="volume-mute-outline"
        onPress={onNavigateMute}
        showChevron
      />
      <MenuRow
        scheme={scheme}
        label="Mark as unread"
        icon="chatbubble-outline"
        onPress={() => onAction('markUnread')}
      />
      <MenuRow
        scheme={scheme}
        label="Preview"
        icon="eye-outline"
        onPress={() => onAction('preview')}
      />
      <Separator color={t.contextMenuSeparator} />
      <MenuRow
        scheme={scheme}
        label="Archive"
        icon="file-tray-full-outline"
        onPress={() => onAction('archive')}
      />
      <MenuRow
        scheme={scheme}
        label="Add to folder…"
        icon="folder-open-outline"
        onPress={onNavigateFolder}
        showChevron
      />
      <Separator color={t.contextMenuSeparator} />
      <MenuRow
        scheme={scheme}
        label="Clear history"
        icon="close-circle-outline"
        onPress={() => onAction('clearHistory')}
      />
      <MenuRow
        scheme={scheme}
        label="Delete chat"
        icon="trash-bin-outline"
        destructive
        onPress={() => onAction('deleteChat')}
      />
    </View>
  );
}

function MuteSubmenu({
  scheme,
  onBack,
  onAction,
}: {
  scheme: 'light' | 'dark';
  onBack: () => void;
  onAction: (a: ChatListMenuAction) => void;
}) {
  const t = appTheme[scheme];
  return (
    <View>
      <SubmenuHeader scheme={scheme} title="Mute" onBack={onBack} />
      <Separator color={t.contextMenuSeparator} />
      <MenuRow
        scheme={scheme}
        label="For 1 hour"
        icon="time-outline"
        onPress={() => onAction('mute1h')}
      />
      <MenuRow
        scheme={scheme}
        label="For 8 hours"
        icon="time-outline"
        onPress={() => onAction('mute8h')}
      />
      <MenuRow
        scheme={scheme}
        label="For 2 days"
        icon="time-outline"
        onPress={() => onAction('mute2d')}
      />
      <MenuRow
        scheme={scheme}
        label="Disable"
        icon="volume-high-outline"
        onPress={() => onAction('muteDisable')}
      />
    </View>
  );
}

function FolderSubmenu({
  scheme,
  onBack,
  onAction,
}: {
  scheme: 'light' | 'dark';
  onBack: () => void;
  onAction: (a: ChatListMenuAction) => void;
}) {
  const t = appTheme[scheme];
  return (
    <View>
      <SubmenuHeader scheme={scheme} title="Add to folder" onBack={onBack} />
      <Separator color={t.contextMenuSeparator} />
      <MenuRow
        scheme={scheme}
        label="Work"
        icon="briefcase-outline"
        onPress={() => onAction('folderWork')}
      />
      <MenuRow
        scheme={scheme}
        label="Personal"
        icon="person-outline"
        onPress={() => onAction('folderPersonal')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  menuWrap: {
    position: 'absolute',
    minWidth: MENU_MIN_WIDTH,
  },
  menu: {
    borderRadius: 10,
    overflow: 'hidden',
    minWidth: MENU_MIN_WIDTH,
    maxWidth: 240,
    paddingVertical: 4,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 2,
    marginHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    minHeight: 34,
  },
  rowIcon: {
    marginRight: 8,
    width: 20,
  },
  rowLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: -0.1,
  },
  rowChevronSpacer: {
    width: CHEVRON_SIZE,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    gap: 2,
  },
  subHeaderTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
});
