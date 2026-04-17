import { type ReactElement } from 'react';
import { Pressable, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  pressable: {
    justifyContent: 'center',
  },
});

/**
 * Wraps `node` in a `Pressable` when `onPress` is defined; otherwise returns `node`.
 * Only accepts `ReactElement` (not raw string/number) because `Pressable` is a View and cannot host text nodes.
 * Empty slots stay unwrapped so non-interactive content is not exposed as a button.
 * Pass `accessibilityLabel` when the child is icon-only so the control is not unlabeled for assistive tech.
 */
export function wrapOptionalPressable(
  node: ReactElement | null | undefined,
  onPress: (() => void) | undefined,
  accessibilityLabel?: string,
): ReactElement | null | undefined {
  if (node == null) {
    return node;
  }
  if (onPress == null) {
    return node;
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={10}
      onPress={onPress}
      style={styles.pressable}
    >
      {node}
    </Pressable>
  );
}
