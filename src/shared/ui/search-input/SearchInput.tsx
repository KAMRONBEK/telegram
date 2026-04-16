import { Ionicons } from '@expo/vector-icons';
import { useCallback, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInput as TextInputType,
  View,
} from 'react-native';

import { appTheme } from '@/shared/config/theme';
import { useColorScheme } from '@/shared/lib/hooks';

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
};

export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Search for messages or users',
  onSubmit,
}: SearchInputProps) {
  const scheme = useColorScheme();
  const t = appTheme[scheme];
  const inputRef = useRef<TextInputType>(null);
  const [focused, setFocused] = useState(false);

  const showIdlePlaceholder = value.length === 0 && !focused;
  const showClearButton = Platform.OS !== 'ios' && value.length > 0;

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: t.searchInputBg }]}>
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          {
            color: t.textPrimary,
            paddingLeft: showIdlePlaceholder ? H_PAD : INPUT_PAD_LEFT,
            paddingRight: showClearButton ? 36 : H_PAD,
          },
        ]}
        placeholder=""
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={placeholder}
        {...(Platform.OS === 'ios' ? { clearButtonMode: 'while-editing' as const } : {})}
      />

      {showIdlePlaceholder && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={placeholder}
          accessibilityHint="Opens search field"
          onPress={focusInput}
          style={styles.idleOverlay}
        >
          <Ionicons
            name="search"
            size={ICON_SIZE}
            color={t.searchInputIcon}
            style={styles.idleIcon}
          />
          <Text style={[styles.idleLabel, { color: t.searchInputPlaceholder }]} numberOfLines={1}>
            {placeholder}
          </Text>
        </Pressable>
      )}

      {!showIdlePlaceholder && (
        <View style={styles.leftIcon} pointerEvents="none">
          <Ionicons name="search" size={ICON_SIZE} color={t.searchInputIcon} />
        </View>
      )}

      {showClearButton && (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          style={styles.clearBtn}
        >
          <Ionicons name="close-circle" size={18} color={t.searchInputIcon} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 36,
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 12,
    marginVertical: 8,
  },
  input: {
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
  idleLabel: {
    fontSize: 16,
    flexShrink: 1,
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
