import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import type { PressableProps } from 'react-native';

import { ListRowSeparator } from '@/shared/ui/list-row-separator';
import { Box, PressableBox, Text, type Theme } from '@/shared/ui/restyle';

import { SETTINGS_ROW_MIN_HEIGHT } from './constants';

const CHEVRON_SIZE = 20;

export type SettingsRowProps = {
  label: string;
  /** Secondary status text before the chevron (e.g. “Disabled”). */
  value?: string;
  onPress?: PressableProps['onPress'];
  showChevron?: boolean;
  /** When false, omits the bottom hairline (typical for the last row in a group). */
  showDivider?: boolean;
  /** Left inset for the divider in px; defaults to the row’s horizontal padding. */
  dividerInsetLeft?: number;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
};

/**
 * Standard settings-style row: leading label, optional trailing value, optional chevron,
 * and an iOS-like inset divider.
 */
export function SettingsRow({
  label,
  value,
  onPress,
  showChevron = true,
  showDivider = true,
  dividerInsetLeft: dividerInsetLeftProp,
  disabled = false,
  testID,
  accessibilityLabel,
}: SettingsRowProps) {
  const { colors, spacing } = useTheme<Theme>();
  const dividerInset = dividerInsetLeftProp ?? spacing.lg;
  const isDisabled = disabled || onPress == null;
  const hasValue = value != null && value !== '';

  return (
    <Box alignSelf="stretch">
      <PressableBox
        onPress={onPress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        accessibilityLabel={accessibilityLabel ?? (hasValue ? `${label}, ${value}` : label)}
        testID={testID}
        backgroundColor="settingsRowBg"
        paddingHorizontal="lg"
        minHeight={SETTINGS_ROW_MIN_HEIGHT}
        flexDirection="row"
        alignItems="center"
        style={({ pressed }) =>
          pressed && onPress != null && !disabled
            ? { backgroundColor: colors.settingsRowPressed }
            : undefined
        }
      >
        <Text
          fontSize={17}
          lineHeight={22}
          fontWeight="400"
          color="textPrimary"
          flex={1}
          marginRight="sm"
          numberOfLines={1}
          style={{ minWidth: 0 }}
        >
          {label}
        </Text>
        {hasValue ? (
          <Text
            fontSize={17}
            lineHeight={22}
            fontWeight="400"
            color="textSecondary"
            numberOfLines={1}
            marginRight={showChevron ? 'xs' : 'none'}
            style={{ flexShrink: 0 }}
          >
            {value}
          </Text>
        ) : null}
        {showChevron ? (
          <Ionicons name="chevron-forward" size={CHEVRON_SIZE} color={colors.textSecondary} />
        ) : null}
      </PressableBox>
      {showDivider ? (
        <ListRowSeparator insetLeft={dividerInset} backgroundColor="settingsRowBg" />
      ) : null}
    </Box>
  );
}
