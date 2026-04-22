import type { Theme } from '@/shared/ui/restyle';

const BUBBLE_SHADOW_OPACITY: Record<'light' | 'dark', number> = {
  light: 0.12,
  dark: 0.2,
};

/**
 * Text + quote widths from the list line and bubble shell.
 * Spacing must stay aligned with the bubble’s Restyle `paddingHorizontal="md"`,
 * `QuotedBlock` (`messageQuoteBarWidth` + `sm`), and time column reserve.
 */
export function getBubbleLayoutMetrics(maxBubbleWidth: number, spacing: Theme['spacing']) {
  const paddingH = spacing.md * 2;
  const contentWidth = Math.max(0, maxBubbleWidth - paddingH);
  const maxQuoteTextWidth = Math.max(0, contentWidth - spacing.messageQuoteBarWidth - spacing.sm);
  const mainTextMaxWidth = Math.max(0, contentWidth - spacing.messageBubbleTimeColumnReserve);
  return { contentWidth, mainTextMaxWidth, maxQuoteTextWidth };
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
        borderTopRightRadius: t,
        borderBottomLeftRadius: big,
        borderBottomRightRadius: big,
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
