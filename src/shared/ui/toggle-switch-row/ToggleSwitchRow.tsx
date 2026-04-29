import { useTheme } from '@shopify/restyle';
import { Platform, Switch } from 'react-native';

import { ListRowSeparator } from '@/shared/ui/list-row-separator';
import { Box, PressableBox, Text, type Theme } from '@/shared/ui/restyle';

import { SETTINGS_ROW_MIN_HEIGHT } from '../settings-row/constants';

export type ToggleSwitchRowProps = {
  label: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  /** When false, omits the bottom hairline (typical for the last row in a group). */
  showDivider?: boolean;
  /** Left inset for the divider in px; defaults to the row’s horizontal padding. */
  dividerInsetLeft?: number;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
};

/**
 * Settings-style row with a leading label and a trailing toggle. The whole row toggles
 * the value; the native `Switch` is visual-only for pointer events so taps do not double-fire.
 */
export function ToggleSwitchRow({
  label,
  value,
  onValueChange,
  showDivider = true,
  dividerInsetLeft: dividerInsetLeftProp,
  disabled = false,
  testID,
  accessibilityLabel,
}: ToggleSwitchRowProps) {
  const { colors, spacing } = useTheme<Theme>();
  const dividerInset = dividerInsetLeftProp ?? spacing.lg;

  const toggle = () => {
    if (!disabled) onValueChange(!value);
  };

  const trackOff = colors.settingsToggleTrackOff;
  const trackOn = colors.settingsToggleTrackOn;

  return (
    <Box alignSelf="stretch">
      <PressableBox
        accessibilityRole="switch"
        accessibilityState={{ checked: value, disabled }}
        accessibilityLabel={accessibilityLabel ?? label}
        testID={testID}
        onPress={toggle}
        disabled={disabled}
        backgroundColor="settingsRowBg"
        paddingHorizontal="lg"
        minHeight={SETTINGS_ROW_MIN_HEIGHT}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        style={({ pressed }) =>
          pressed && !disabled ? { backgroundColor: colors.settingsRowPressed } : undefined
        }
      >
        <Text
          fontSize={17}
          lineHeight={22}
          fontWeight="400"
          color="textPrimary"
          flex={1}
          marginRight="sm"
          alignSelf="center"
          numberOfLines={1}
          style={{ minWidth: 0 }}
        >
          {label}
        </Text>
        {/*
          iOS: RCTSwitch’s layout box is taller than the visible knob; centering the row aligns
          that box, which looks top-heavy. Stretch this column to the row’s height and centre
          the switch inside — matches native Settings styling.
        */}
        <Box alignSelf="stretch" minHeight={SETTINGS_ROW_MIN_HEIGHT} justifyContent="center" flexShrink={0}>
          <Switch
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            value={value}
            disabled={disabled}
            pointerEvents="none"
            trackColor={{ false: trackOff, true: trackOn }}
            thumbColor={colors.settingsToggleThumb}
            ios_backgroundColor={trackOff}
            {...(Platform.OS === 'web'
              ? {
                  /** react-native-web: ON state reads `activeThumbColor`, not `thumbColor` */
                  activeThumbColor: colors.settingsToggleThumb,
                }
              : null)}
          />
        </Box>
      </PressableBox>
      {showDivider ? (
        <ListRowSeparator insetLeft={dividerInset} backgroundColor="settingsRowBg" />
      ) : null}
    </Box>
  );
}
