import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { useCallback, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  type StyleProp,
  StyleSheet,
  TextInput,
  type TextInput as TextInputType,
  type ViewStyle,
} from 'react-native';

import { Box, Text, type Theme } from '@/shared/ui/restyle';

const ICON_SIZE = 17;
const H_PAD = 12;
const ICON_TEXT_GAP = 6;
/** Left inset for typed text: padding + icon + gap */
const INPUT_PAD_LEFT = H_PAD + ICON_SIZE + ICON_TEXT_GAP;

export type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  /** Merged onto the outer container (e.g. `flex: 1`, zero margins when embedded in a toolbar row). */
  containerStyle?: StyleProp<ViewStyle>;
  /** Extra `paddingVertical` on the text field (e.g. web). */
  inputPaddingVertical?: number;
};

export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Search for messages or users',
  onSubmit,
  containerStyle,
  inputPaddingVertical = 0,
}: SearchInputProps) {
  const theme = useTheme<Theme>();
  const inputRef = useRef<TextInputType>(null);
  const [focused, setFocused] = useState(false);

  const showIdlePlaceholder = value.length === 0 && !focused;
  const showClearButton = Platform.OS !== 'ios' && value.length > 0;

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Box
      backgroundColor="searchInputBg"
      borderRadius="md"
      flexDirection="row"
      alignItems="center"
      minHeight={36}
      paddingVertical="sm"
      marginHorizontal="md"
      marginVertical="sm"
      position="relative"
      style={containerStyle}>
      <TextInput
        ref={inputRef}
        style={[
          styles.inputBase,
          {
            color: theme.colors.textPrimary,
            paddingLeft: showIdlePlaceholder ? H_PAD : INPUT_PAD_LEFT,
            paddingRight: showClearButton ? 36 : H_PAD,
            paddingVertical: inputPaddingVertical,
          },
        ]}
        placeholder={focused ? placeholder : ''}
        placeholderTextColor={theme.colors.searchInputPlaceholder}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={placeholder}
        accessibilityElementsHidden={showIdlePlaceholder}
        importantForAccessibility={showIdlePlaceholder ? 'no-hide-descendants' : 'auto'}
        {...(Platform.OS === 'ios' ? { clearButtonMode: 'while-editing' as const } : {})}
      />

      {showIdlePlaceholder && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={placeholder}
          accessibilityHint="Opens search field"
          onPress={focusInput}
          style={styles.idleOverlay}>
          <Ionicons
            name="search"
            size={ICON_SIZE}
            color={theme.colors.searchInputIcon}
            style={styles.idleIcon}
          />
          <Text variant="searchIdleLabel" color="searchInputPlaceholder" numberOfLines={1}>
            {placeholder}
          </Text>
        </Pressable>
      )}

      {!showIdlePlaceholder && (
        <Box style={styles.leftIcon} pointerEvents="none">
          <Ionicons name="search" size={ICON_SIZE} color={theme.colors.searchInputIcon} />
        </Box>
      )}

      {showClearButton && (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          style={styles.clearBtn}>
          <Ionicons name="close-circle" size={18} color={theme.colors.searchInputIcon} />
        </Pressable>
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  inputBase: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    textAlign: 'left',
    includeFontPadding: false,
  },
  idleOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: H_PAD,
  },
  idleIcon: {
    marginRight: ICON_TEXT_GAP,
  },
  leftIcon: {
    position: 'absolute',
    left: H_PAD,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  clearBtn: {
    position: 'absolute',
    right: H_PAD - 2,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});
