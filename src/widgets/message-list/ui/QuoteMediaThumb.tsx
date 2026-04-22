import { useTheme } from '@shopify/restyle';
import { useState } from 'react';
import { Image, StyleSheet } from 'react-native';

import { Box, type Theme } from '@/shared/ui/restyle';

export type QuoteMediaThumbProps = {
  uri: string;
  size: number;
};

export function QuoteMediaThumb({ uri, size }: QuoteMediaThumbProps) {
  const { colors } = useTheme<Theme>();
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <Box
        width={size}
        height={size}
        borderRadius="xs"
        style={{ backgroundColor: colors.bubbleBorder }}
      />
    );
  }
  return (
    <Box
      width={size}
      height={size}
      position="relative"
      borderRadius="xs"
      overflow="hidden"
      flexShrink={0}
    >
      <Image
        source={{ uri }}
        onError={() => setFailed(true)}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
    </Box>
  );
}
