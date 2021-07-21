import { extendTheme } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

const fonts = { body: `Roboto`, heading: 'Roboto' };

const breakpoints = createBreakpoints({
  sm: '320px',
  md: '768px',
  lg: '960px',
  xl: '1200px',
});

const theme = extendTheme({
  colors: {
    black: '#16161D',
  },
  styles: {
    global: {
      '#__next': {
        height: '100%',
        width: '100%',
      },
      body: {
        height: '100%',
        width: '100%',
      },
      html: {
        height: '100%',
        width: '100%',
      },
    },
  },
  fonts,
  breakpoints,
});

export default theme;
