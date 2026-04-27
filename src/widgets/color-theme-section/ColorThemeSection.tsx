import { useTheme } from '@shopify/restyle';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import {
  type ColorThemeOptionId,
  colorThemeOptions,
  themePickerTilePresets,
} from '@/shared/config/theme';
import { Box, Text, type Theme } from '@/shared/ui/restyle';
import { ThemePickerTile } from '@/shared/ui/theme-picker-tile';

import { ColorThemePreviewBlock } from './ColorThemePreviewBlock';

export type ColorThemeSectionProps = {
  /** Uncontrolled initial selection. */
  initialSelection?: ColorThemeOptionId;
  /** Fires when the user picks a theme (including the initial mount if you need sync). */
  onSelectionChange?: (id: ColorThemeOptionId) => void;
  testID?: string;
};

/**
 * “Color theme” settings block: section title, live message preview for the selected palette,
 * and a horizontal carousel of {@link ThemePickerTile} options.
 */
export function ColorThemeSection({
  initialSelection = 'classic',
  onSelectionChange,
  testID,
}: ColorThemeSectionProps) {
  const [selected, setSelected] = useState<ColorThemeOptionId>(initialSelection);
  const { colors } = useTheme<Theme>();

  const onPick = useCallback(
    (id: ColorThemeOptionId) => {
      setSelected(id);
      onSelectionChange?.(id);
    },
    [onSelectionChange]
  );

  return (
    <Box testID={testID}>
      <Text
        paddingHorizontal="md"
        marginBottom="sm"
        fontSize={13}
        fontWeight="600"
        letterSpacing={0.6}
        textTransform="uppercase"
        color="textSecondary"
      >
        Color theme
      </Text>
      <Box paddingHorizontal="md" marginBottom="md">
        <ColorThemePreviewBlock optionId={selected} />
      </Box>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ backgroundColor: colors.colorThemeCarouselStrip }}
        contentContainerStyle={styles.carousel}
        keyboardShouldPersistTaps="handled"
      >
        {colorThemeOptions.map(({ id, label }) => (
          <ThemePickerTile
            key={id}
            label={label}
            selected={selected === id}
            preview={themePickerTilePresets[id]}
            onPress={() => onPick(id)}
            testID={testID ? `${testID}-tile-${id}` : undefined}
          />
        ))}
      </ScrollView>
    </Box>
  );
}
const styles = StyleSheet.create({
  carousel: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    columnGap: 4,
  },
});
