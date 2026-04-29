import { useTheme } from '@shopify/restyle';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { safeAsyncStorageGetItem, safeAsyncStorageSetItem } from '@/shared/lib/safe-async-storage';
import { Box, Text, type Theme } from '@/shared/ui/restyle';
import {
    TEXT_SIZE_DEFAULT_LEVEL_INDEX,
    TEXT_SIZE_MAX_LEVEL_INDEX,
    TextSizeSlider,
} from '@/shared/ui/text-size-slider';

const STORAGE_KEY = '@TESChat/appearanceTextSizeLevel';

export type TextSizeSectionProps = {
  /**
   * Level shown on first paint and when no valid value exists in storage.
   * If AsyncStorage returns a valid level, it replaces this after hydration.
   */
  initialValue?: number;
  onValueChange?: (value: number) => void;
  testID?: string;
};

/**
 * “Text size” settings block: section title and A–A discrete slider (7 steps).
 */
export function TextSizeSection({
  initialValue = TEXT_SIZE_DEFAULT_LEVEL_INDEX,
  onValueChange,
  testID,
}: TextSizeSectionProps) {
  const { colors } = useTheme<Theme>();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    let cancelled = false;
    void safeAsyncStorageGetItem(STORAGE_KEY).then((raw) => {
      if (cancelled || raw == null) return;
      const n = parseInt(raw, 10);
      if (!Number.isNaN(n) && n >= 0 && n <= TEXT_SIZE_MAX_LEVEL_INDEX) {
        setValue(n);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const onValueChangeInternal = useCallback(
    (n: number) => {
      setValue(n);
      onValueChange?.(n);
      void safeAsyncStorageSetItem(STORAGE_KEY, String(n));
    },
    [onValueChange]
  );

  return (
    <Box testID={testID} marginTop="md">
      <Box
        paddingHorizontal="md"
        paddingTop="md"
        paddingBottom="sm"
        style={{
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.textSizeSectionSeparator,
        }}
      >
        <Text
          fontSize={13}
          fontWeight="600"
          letterSpacing={0.6}
          textTransform="uppercase"
          color="textSecondary"
        >
          Text size
        </Text>
      </Box>
      <TextSizeSlider
        value={value}
        onValueChange={onValueChangeInternal}
        testID={testID ? `${testID}-slider` : undefined}
      />
    </Box>
  );
}
