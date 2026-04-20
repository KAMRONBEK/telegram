import { AntDesign, Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import { Box, Text } from '@/shared/ui/restyle';

export type SwipeActionStripIconName = ComponentProps<typeof Ionicons>['name'];

type SwipeActionStripItemIonicons<TAction> = {
  action: TAction;
  label: string;
  backgroundColor: string;
  icon: SwipeActionStripIconName;
};

type SwipeActionStripItemAntDesign<TAction> = {
  action: TAction;
  label: string;
  backgroundColor: string;
  icon: ComponentProps<typeof AntDesign>['name'];
  iconSet: 'antdesign';
};

export type SwipeActionStripItem<TAction> =
  | SwipeActionStripItemIonicons<TAction>
  | SwipeActionStripItemAntDesign<TAction>;

function SwipeActionStripIcon<TAction>({
  item,
  size,
  color,
}: {
  item: SwipeActionStripItem<TAction>;
  size: number;
  color: string;
}) {
  if ('iconSet' in item && item.iconSet === 'antdesign') {
    return <AntDesign name={item.icon} size={size} color={color} />;
  }
  const ionItem = item as SwipeActionStripItemIonicons<TAction>;
  return <Ionicons name={ionItem.icon} size={size} color={color} />;
}

/** Which edge of the row the actions attach to (drives side of the strip with Swipeable `transX`). */
export type SwipeActionStripSide = 'left' | 'right';

export type SwipeActionStripProps<TAction> = {
  actions: SwipeActionStripItem<TAction>[];
  labelColor: string;
  onSelect: (action: TAction) => void;
  /**
   * First argument from `Swipeable` render callbacks (`showLeftAction` / `showRightAction`).
   * Drives opacity so actions stay hidden until the row is actually opened.
   */
  revealProgress: Animated.AnimatedInterpolation<number> | Animated.Value;
  /** Row translation from `Swipeable` (second argument). Required when `primaryAction` is set (drives stretch + armed detection). */
  transX?: Animated.AnimatedInterpolation<number>;
  side: SwipeActionStripSide;
  /** Width of each action as a fraction of the basis width (e.g. 0.2 ≈ 20%). @default 0.2 */
  itemWidthFraction?: number;
  /**
   * Width used with `itemWidthFraction` (typically the list row). When unset, uses the window.
   * Pass the measured row width on web so actions match mobile proportions inside narrow lists.
   */
  basisWidth?: number;
  /** @default 22 */
  iconSize?: number;
  /** @default 72 */
  minCellHeight?: number;
  /**
   * When set, this action becomes a Telegram-style "commit on overswipe" action: as the user drags
   * past `commitThreshold` of the row, this cell stretches to fill the swipe area and the other
   * cells fade out. Pair with `onArmedChange` + parent's `onSwipeableWillOpen` to fire on release.
   */
  primaryAction?: TAction;
  /** Fraction of `basisWidth` past which the primary action is "armed" for commit. @default 0.6 */
  commitThreshold?: number;
  /** Called whenever armed state flips (use to trigger haptics or stash for release-time commit). */
  onArmedChange?: (armed: boolean) => void;
  testID?: string;
};

const DEFAULT_ICON_SIZE = 22;
const DEFAULT_MIN_CELL_HEIGHT = 72;
const DEFAULT_ITEM_WIDTH_FRACTION = 0.2;
const DEFAULT_COMMIT_THRESHOLD = 0.6;
/** Drag window (px) over which the armed overlay crossfades in/out of the normal cells. */
const ARM_TRANSITION_PX = 28;
/** Keeps swipe cells phone-like on large monitors (matches ~390pt row at 0.2 fraction). */
const MAX_ACTION_CELL_WIDTH = 92;
const MIN_ACTION_CELL_WIDTH = 48;

function actionCellBase(basisWidth: number, itemWidthFraction: number): number {
  const raw = Math.round(basisWidth * itemWidthFraction);
  return Math.min(MAX_ACTION_CELL_WIDTH, Math.max(MIN_ACTION_CELL_WIDTH, raw));
}

/** Solid fill behind `RectButton` — native button views often fail to paint `backgroundColor` here (Fabric / opacity parent). */
function ActionCellChrome({
  backgroundColor,
  width,
  minHeight,
  children,
}: {
  backgroundColor: string;
  width: number;
  minHeight: number;
  children: ReactNode;
}) {
  return (
    <View style={[styles.cellShell, { width, minHeight }]}>
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor }]} />
      {children}
    </View>
  );
}

export function SwipeActionStrip<TAction>({
  actions,
  labelColor,
  onSelect,
  revealProgress,
  transX,
  side,
  itemWidthFraction = DEFAULT_ITEM_WIDTH_FRACTION,
  basisWidth: basisWidthProp,
  iconSize = DEFAULT_ICON_SIZE,
  minCellHeight = DEFAULT_MIN_CELL_HEIGHT,
  primaryAction,
  commitThreshold = DEFAULT_COMMIT_THRESHOLD,
  onArmedChange,
  testID,
}: SwipeActionStripProps<TAction>) {
  const { width: windowWidth } = useWindowDimensions();
  const basis = basisWidthProp !== undefined && basisWidthProp > 0 ? basisWidthProp : windowWidth;
  const cellBase = actionCellBase(basis, itemWidthFraction);
  const panelWidth = cellBase * actions.length;

  const primaryItem = useMemo(
    () =>
      primaryAction !== undefined
        ? (actions.find((a) => a.action === primaryAction) ?? null)
        : null,
    [actions, primaryAction]
  );

  /** Commit drag (px from closed). Past this, the primary overlay fills the row (stretch) and release can commit. */
  const commitDrag = useMemo(
    () => Math.max(panelWidth + ARM_TRANSITION_PX + 8, Math.round(basis * commitThreshold)),
    [panelWidth, basis, commitThreshold]
  );

  const revealOpacity = useMemo(
    () =>
      revealProgress.interpolate({
        inputRange: [0, 0.02, 1],
        outputRange: [0, 1, 1],
        extrapolate: 'clamp',
      }),
    [revealProgress]
  );

  const armedRef = useRef(false);
  const onArmedChangeRef = useRef(onArmedChange);
  useEffect(() => {
    onArmedChangeRef.current = onArmedChange;
  }, [onArmedChange]);

  const hasPrimary = primaryItem !== null && transX !== undefined;

  useEffect(() => {
    if (!hasPrimary || !transX) return undefined;
    const node = transX as unknown as Animated.Value;
    const id = node.addListener(({ value }) => {
      const drag = side === 'right' ? -value : value;
      const nextArmed = drag >= commitDrag;
      if (nextArmed !== armedRef.current) {
        armedRef.current = nextArmed;
        onArmedChangeRef.current?.(nextArmed);
      }
    });
    return () => {
      node.removeListener(id);
      if (armedRef.current) {
        armedRef.current = false;
        onArmedChangeRef.current?.(false);
      }
    };
  }, [transX, hasPrimary, side, commitDrag]);

  /** Crossfade between the normal N-cell panel and the stretched primary overlay as drag crosses `commitDrag`. */
  const { normalOpacity, overlayOpacity, overlayWidth } = useMemo(() => {
    if (!hasPrimary || !transX) {
      return {
        normalOpacity: new Animated.Value(1),
        overlayOpacity: new Animated.Value(0),
        overlayWidth: new Animated.Value(0),
      };
    }
    const armEdge = commitDrag;
    const preArm = commitDrag - ARM_TRANSITION_PX;

    if (side === 'right') {
      // transX goes 0 → −basis as user drags right-to-left.
      const inRange = [-basis, -armEdge, -preArm, 0];
      return {
        normalOpacity: transX.interpolate({
          inputRange: inRange,
          outputRange: [0, 0, 1, 1],
          extrapolate: 'clamp',
        }),
        overlayOpacity: transX.interpolate({
          inputRange: inRange,
          outputRange: [1, 1, 0, 0],
          extrapolate: 'clamp',
        }),
        overlayWidth: transX.interpolate({
          inputRange: inRange,
          outputRange: [basis, armEdge, 0, 0],
          extrapolate: 'clamp',
        }),
      };
    }
    const inRange = [0, preArm, armEdge, basis];
    return {
      normalOpacity: transX.interpolate({
        inputRange: inRange,
        outputRange: [1, 1, 0, 0],
        extrapolate: 'clamp',
      }),
      overlayOpacity: transX.interpolate({
        inputRange: inRange,
        outputRange: [0, 0, 1, 1],
        extrapolate: 'clamp',
      }),
      overlayWidth: transX.interpolate({
        inputRange: inRange,
        outputRange: [0, 0, armEdge, basis],
        extrapolate: 'clamp',
      }),
    };
  }, [hasPrimary, transX, side, commitDrag, basis]);

  const inner = (item: SwipeActionStripItem<TAction>) => (
    <Box
      flex={1}
      minHeight={minCellHeight}
      alignItems="center"
      justifyContent="center"
      paddingHorizontal="xs"
    >
      <SwipeActionStripIcon item={item} size={iconSize} color={labelColor} />
      <Text
        variant="swipeActionStripLabel"
        style={{ color: labelColor }}
        numberOfLines={1}
        marginTop="xs"
      >
        {item.label}
      </Text>
    </Box>
  );

  return (
    <Animated.View collapsable={false} style={{ opacity: revealOpacity }} testID={testID}>
      <View style={[styles.row, { width: panelWidth }]}>
        <Animated.View
          style={[
            styles.normalRow,
            { width: panelWidth, opacity: normalOpacity, minHeight: minCellHeight },
          ]}
        >
          {actions.map((item) => (
            <ActionCellChrome
              key={String(item.action)}
              backgroundColor={item.backgroundColor}
              width={cellBase}
              minHeight={minCellHeight}
            >
              <RectButton
                style={styles.cellHit}
                underlayColor="rgba(0,0,0,0.15)"
                onPress={() => onSelect(item.action)}
              >
                {inner(item)}
              </RectButton>
            </ActionCellChrome>
          ))}
        </Animated.View>

        {primaryItem ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.armedOverlay,
              side === 'right' ? styles.armedOverlayRight : styles.armedOverlayLeft,
              {
                width: overlayWidth,
                opacity: overlayOpacity,
                minHeight: minCellHeight,
                backgroundColor: primaryItem.backgroundColor,
              },
            ]}
          >
            <View style={styles.armedInner}>
              <SwipeActionStripIcon item={primaryItem} size={iconSize} color={labelColor} />
              <Text
                variant="swipeActionStripLabel"
                style={{ color: labelColor, marginTop: 4 }}
                numberOfLines={1}
              >
                {primaryItem.label}
              </Text>
            </View>
          </Animated.View>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    overflow: 'visible',
  },
  normalRow: {
    flexDirection: 'row',
  },
  cellShell: {
    overflow: 'hidden',
  },
  cellHit: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  armedOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  armedOverlayRight: {
    right: 0,
  },
  armedOverlayLeft: {
    left: 0,
  },
  armedInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
});
