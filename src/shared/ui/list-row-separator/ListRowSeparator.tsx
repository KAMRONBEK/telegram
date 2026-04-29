import { Box, type Theme } from '@/shared/ui/restyle';

export type ListRowSeparatorProps = {
  /** Left inset in pixels. Useful for aligning the line past an avatar. */
  insetLeft?: number;
  /** Background behind the hairline; defaults to chat list row. */
  backgroundColor?: keyof Theme['colors'];
};

export function ListRowSeparator({
  insetLeft = 0,
  backgroundColor = 'chatListRow',
}: ListRowSeparatorProps) {
  return (
    <Box backgroundColor={backgroundColor}>
      <Box
        height={1}
        backgroundColor="rowSeparator"
        style={insetLeft > 0 ? { marginLeft: insetLeft } : undefined}
      />
    </Box>
  );
}
