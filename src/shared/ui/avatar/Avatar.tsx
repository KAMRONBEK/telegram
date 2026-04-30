import { useTheme } from '@shopify/restyle';
import { useState } from 'react';
import { Image } from 'react-native';

import { Box, Text, type Theme } from '@/shared/ui/restyle';

export const AVATAR_PX = {
  twentySix: 26,
  thirtySix: 36,
  forty: 40,
  sixty: 60,
  sixtySix: 66,
} as const;

export type AvatarSize = keyof typeof AVATAR_PX;

const FONT_SIZES: Record<AvatarSize, number> = {
  twentySix: 13,
  thirtySix: 15,
  forty: 17,
  sixty: 23,
  sixtySix: 26,
};

type AvatarProps = {
  size: AvatarSize;
  uri?: string | null;
  name?: string;
  backgroundColor?: string;
  bordered?: boolean;
  focused?: boolean;
};

export function Avatar({
  size,
  uri,
  name,
  backgroundColor,
  bordered = false,
  focused = false,
}: AvatarProps) {
  const { colors } = useTheme<Theme>();
  const px = AVATAR_PX[size];
  const [imgFailed, setImgFailed] = useState(false);

  const showImage = !!uri && !imgFailed;
  const letter = name?.slice(0, 1).toUpperCase() ?? '?';

  return (
    <Box
      width={px}
      height={px}
      borderRadius="full"
      overflow="hidden"
      alignItems="center"
      justifyContent="center"
      style={[
        !showImage && { backgroundColor: backgroundColor ?? colors.textSecondary },
        bordered && {
          borderWidth: 1.5,
          borderColor: focused ? colors.tint : 'transparent',
        },
      ]}
    >
      {showImage ? (
        <Image
          source={{ uri }}
          onError={() => setImgFailed(true)}
          style={{ width: px, height: px, borderRadius: px / 2 }}
        />
      ) : (
        <Text variant="avatarLetter" style={{ fontSize: FONT_SIZES[size] }}>
          {letter}
        </Text>
      )}
    </Box>
  );
}
