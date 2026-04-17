import { ThemeProvider } from '@shopify/restyle';
import { type PropsWithChildren } from 'react';

import { useColorScheme } from '@/shared/lib/hooks';

import { darkTheme, lightTheme } from './theme';

export function RestyleProvider({ children }: PropsWithChildren) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
