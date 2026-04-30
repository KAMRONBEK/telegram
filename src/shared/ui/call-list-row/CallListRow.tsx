import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import type { PressableProps } from 'react-native';

import { Avatar, AVATAR_PX, avatarColor, type AvatarSize } from '@/shared/ui/avatar';
import { ListRowSeparator } from '@/shared/ui/list-row-separator';
import { Box, PressableBox, Text, type Theme } from '@/shared/ui/restyle';

export function callListRowDividerInsetLeft(
  spacing: Pick<Theme['spacing'], 'md'>,
  iconSize: number,
  avatarSize: AvatarSize
): number {
  return spacing.md + iconSize + spacing.md + AVATAR_PX[avatarSize] + spacing.md;
}

const ROW_LAYOUT = {
  backgroundColor: 'chatListRow',
  paddingHorizontal: 'md',
  paddingVertical: 'sm',
  flexDirection: 'row',
  alignItems: 'center',
} as const satisfies Record<string, unknown>;

export type CallType = 'incoming' | 'outgoing' | 'missed';

export type CallListRowProps = {
  name: string;
  callType: CallType;
  duration?: string;
  date: string;
  imageUri?: string | null;
  avatarBackgroundColor?: string;
  avatarSize?: AvatarSize;
  callIconSize?: number;
  onPress?: PressableProps['onPress'];
  onInfoPress?: () => void;
  showDivider?: boolean;
  dividerInsetLeft?: number;
  testID?: string;
  accessibilityLabel?: string;
};

function getCallStatusText(callType: CallType, duration?: string): string {
  const typeLabels: Record<CallType, string> = {
    incoming: 'Incoming',
    outgoing: 'Outgoing',
    missed: 'Missed',
  };

  const baseText = typeLabels[callType];
  if (duration && callType !== 'missed') {
    return `${baseText} (${duration})`;
  }
  return baseText;
}

export function CallListRow({
  name,
  callType,
  duration,
  date,
  imageUri,
  avatarBackgroundColor,
  avatarSize = 'forty',
  callIconSize = 20,
  onPress,
  onInfoPress,
  showDivider = true,
  dividerInsetLeft: dividerInsetLeftProp,
  testID,
  accessibilityLabel,
}: CallListRowProps) {
  const { colors, spacing } = useTheme<Theme>();
  const showCallIcon = callType === 'outgoing';
  const dividerInset =
    dividerInsetLeftProp ?? callListRowDividerInsetLeft(spacing, callIconSize, avatarSize);
  const isPressable = onPress != null;
  const fallbackBg = avatarBackgroundColor ?? avatarColor(name);
  const statusText = getCallStatusText(callType, duration);
  const statusColor = callType === 'missed' ? 'callMissed' : 'textSecondary';
  const nameColor = callType === 'missed' ? 'callMissed' : 'textPrimary';
  const callIconColor = callType === 'missed' ? colors.callMissed : colors.textSecondary;

  const inner = (
    <>
      <Box marginRight="md" flexShrink={0} flexDirection="row" alignItems="center" gap="md">
        {showCallIcon ? (
          <Box width={callIconSize} alignItems="center" justifyContent="center">
            <Ionicons name="call" size={callIconSize} color={callIconColor} />
          </Box>
        ) : (
          <Box width={callIconSize} />
        )}
        <Avatar size={avatarSize} uri={imageUri} name={name} backgroundColor={fallbackBg} />
      </Box>
      <Box flex={1} justifyContent="center" gap="xxs" minWidth={0}>
        <Text variant="chatRowTitle" fontWeight="600" numberOfLines={1} color={nameColor}>
          {name}
        </Text>
        <Text variant="stickerSetRowSubtitle" color={statusColor} numberOfLines={1}>
          {statusText}
        </Text>
      </Box>
      <Box marginLeft="sm" flexShrink={0} flexDirection="row" alignItems="center" gap="sm">
        <Text variant="chatRowTime" color="textSecondary">
          {date}
        </Text>
        {onInfoPress ? (
          <PressableBox
            onPress={(e) => {
              e?.stopPropagation?.();
              onInfoPress();
            }}
            accessibilityRole="button"
            accessibilityLabel="Call info"
            hitSlop={8}
          >
            <Box
              width={20}
              height={20}
              borderRadius="full"
              borderWidth={1.5}
              borderColor="tint"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize={12} fontWeight="600" color="tint">
                i
              </Text>
            </Box>
          </PressableBox>
        ) : null}
      </Box>
    </>
  );

  const rowA11y =
    accessibilityLabel ?? `${name}, ${statusText}, ${date}${onInfoPress ? ', Info button' : ''}`;

  return (
    <Box alignSelf="stretch">
      {isPressable ? (
        <PressableBox
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={rowA11y}
          testID={testID}
          {...ROW_LAYOUT}
          style={({ pressed }) =>
            pressed ? { backgroundColor: colors.chatListRowPressed } : undefined
          }
        >
          {inner}
        </PressableBox>
      ) : (
        <Box accessible accessibilityLabel={rowA11y} testID={testID} {...ROW_LAYOUT}>
          {inner}
        </Box>
      )}
      {showDivider ? (
        <ListRowSeparator insetLeft={dividerInset} backgroundColor="chatListRow" />
      ) : null}
    </Box>
  );
}
