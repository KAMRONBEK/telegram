import type { Theme } from '@/shared/ui/restyle';

const BUBBLE_SHADOW_OPACITY: Record<'light' | 'dark', number> = {
  light: 0.12,
  dark: 0.2,
};

export type BubbleContentPadding = {
  paddingLeft?: number;
  paddingRight?: number;
};

/**
 * Content width and text/quote line caps for the bubble interior.
 * Defaults to symmetric `md` horizontal padding. For image-attachment rows, pass
 * `paddingLeft: spacing.sm` so the thumb alignment matches the shell; pair with
 * the same `paddingLeft` on the bubble container.
 * Formulas stay aligned with `QuotedBlock` (`messageQuoteBarWidth` + `sm`) and the time column reserve.
 */
export function getBubbleContentMetrics(
  maxBubbleWidth: number,
  spacing: Theme['spacing'],
  padding: BubbleContentPadding = {}
) {
  const left = padding.paddingLeft ?? spacing.md;
  const right = padding.paddingRight ?? spacing.md;
  const contentWidth = Math.max(0, maxBubbleWidth - left - right);
  const maxQuoteTextWidth = Math.max(0, contentWidth - spacing.messageQuoteBarWidth - spacing.sm);
  const mainTextMaxWidth = Math.max(0, contentWidth - spacing.messageBubbleTimeColumnReserve);
  return {
    contentWidth,
    mainTextMaxWidth,
    maxQuoteTextWidth,
    paddingLeft: left,
    paddingRight: right,
  };
}

export function getBubbleShadowOpacity(scheme: 'light' | 'dark'): number {
  return BUBBLE_SHADOW_OPACITY[scheme];
}

type BubbleCornerStyle = {
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
};

/**
 * Cluster corners (not “reply” specific): a run is same `outgoing` in list order.
 * - Solo: tail on **bottom-outer** (like Telegram’s bubble toward the input).
 * - First of many: top-outer “anchor” on the start of the run.
 * - Last of many (e.g. reply after prior incoming): **bottom-outer** anchor so it matches m3/m1, not a plain pill.
 * - Middle: all corners use `messageBubble` (no tail).
 * A true curved tail still needs SVG; the anchor radius reads as the “tail” base.
 */
export function getMessageBubbleCornerRadii(
  isFirstInGroup: boolean,
  isLastInGroup: boolean,
  outgoing: boolean,
  r: Pick<Theme['borderRadii'], 'messageBubble' | 'messageBubbleGroupAnchor'>
): BubbleCornerStyle {
  const big = r.messageBubble;
  const t = r.messageBubbleGroupAnchor;

  if (!isFirstInGroup && !isLastInGroup) {
    return { borderRadius: big };
  }

  if (isFirstInGroup && isLastInGroup) {
    if (outgoing) {
      return {
        borderTopLeftRadius: big,
        borderTopRightRadius: big,
        borderBottomLeftRadius: big,
        borderBottomRightRadius: t,
      };
    }
    return {
      borderTopLeftRadius: big,
      borderTopRightRadius: big,
      borderBottomLeftRadius: t,
      borderBottomRightRadius: big,
    };
  }

  if (isFirstInGroup) {
    if (outgoing) {
      return {
        borderTopLeftRadius: big,
        borderTopRightRadius: big,
        borderBottomLeftRadius: big,
        borderBottomRightRadius: t,
      };
    }
    return {
      borderTopLeftRadius: big,
      borderTopRightRadius: big,
      borderBottomLeftRadius: t,
      borderBottomRightRadius: big,
    };
  }

  if (outgoing) {
    return {
      borderTopLeftRadius: big,
      borderTopRightRadius: big,
      borderBottomLeftRadius: big,
      borderBottomRightRadius: t,
    };
  }
  return {
    borderTopLeftRadius: big,
    borderTopRightRadius: big,
    borderBottomLeftRadius: t,
    borderBottomRightRadius: big,
  };
}
