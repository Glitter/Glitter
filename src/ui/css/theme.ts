import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

const theme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        light: 'hsl(47, 98%, 81%)',
        main: 'hsl(48, 97%, 73%)',
        dark: 'hsl(45, 90%, 63%)',
        contrastText: 'hsl(0, 0%, 0%)',
      },
      secondary: {
        light: 'hsl(202, 98%, 56%)',
        main: 'hsl(204, 94%, 45%)',
        dark: 'hsl(200, 86%, 37%)',
        contrastText: 'hsl(0, 0%, 100%)',
      },
    },
    typography: {
      fontFamily: ['IBM Plex Sans', 'Helvetica', 'Arial'].join(','),
      h1: {
        fontSize: '3.25rem',
        fontWeight: 700,
      },
      h2: {
        fontSize: '3rem',
        fontWeight: 700,
      },
      h3: {
        fontSize: '2.75rem',
        fontWeight: 700,
      },
    },
  }),
);

export default theme;
