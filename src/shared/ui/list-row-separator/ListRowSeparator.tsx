import { Box } from '@/shared/ui/restyle';

export type ListRowSeparatorProps = {
  /** Left inset in pixels. Useful for aligning the line past an avatar. */
  insetLeft?: number;
};

export function ListRowSeparator({ insetLeft = 0 }: ListRowSeparatorProps) {
  return (
    <Box backgroundColor="chatListRow">
      <Box
        height={1}
        backgroundColor="rowSeparator"
        style={insetLeft > 0 ? { marginLeft: insetLeft } : undefined}
      />
    </Box>
  );
}
