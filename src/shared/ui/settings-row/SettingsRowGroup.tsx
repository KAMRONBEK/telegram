import type { ReactNode } from 'react';

import { Box, Text, type Theme } from '@/shared/ui/restyle';

export type SettingsRowGroupProps = {
  children: ReactNode;
  /** Uppercase caption above the card (e.g. “Appearance”). */
  sectionTitle?: string;
  /**
   * Background behind the section title row (screen tone on settings-style pages).
   * Defaults to `chatListScreenBg` so the heading matches the scroll area.
   */
  headingBackgroundColor?: keyof Theme['colors'];
  marginHorizontal?: keyof Theme['spacing'];
  marginTop?: keyof Theme['spacing'];
  marginBottom?: keyof Theme['spacing'];
  /** Corner radius for the grouped surface (clips row backgrounds + dividers). */
  borderRadius?: keyof Theme['borderRadii'];
  testID?: string;
};

/**
 * Full-bleed grouped block for {@link SettingsRow} children (edge-to-edge on `chatListScreenBg`).
 * Use `borderRadius` + `marginHorizontal` when you want an inset rounded card instead.
 * Omit the last row’s divider (`showDivider={false}`).
 */
export function SettingsRowGroup({
  children,
  sectionTitle,
  headingBackgroundColor = 'chatListScreenBg',
  marginHorizontal = 'none',
  marginTop = 'none',
  marginBottom = 'none',
  borderRadius = 'none',
  testID,
}: SettingsRowGroupProps) {
  const showHeading = sectionTitle != null && sectionTitle !== '';

  return (
    <Box
      marginHorizontal={marginHorizontal}
      marginTop={marginTop}
      marginBottom={marginBottom}
      testID={testID}
    >
      {showHeading ? (
        <Box
          paddingHorizontal="lg"
          paddingTop="md"
          paddingBottom="sm"
          backgroundColor={headingBackgroundColor}
        >
          <Text variant="stickerSetSectionHeading">{sectionTitle}</Text>
        </Box>
      ) : null}
      <Box
        width="100%"
        borderRadius={borderRadius}
        overflow="hidden"
        backgroundColor="settingsRowBg"
      >
        {children}
      </Box>
    </Box>
  );
}
