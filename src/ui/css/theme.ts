import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

const theme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      type: 'light',
      primary: {
        light: '#FFF1DD',
        main: '#FDC777',
        dark: '#987747',
        contrastText: '#4C3C24',
      },
      secondary: {
        light: '#D1CFCF',
        main: '#473F3E',
        dark: '#403938',
        contrastText: '#EDECEC',
      },
      text: {
        primary: '#201C1C',
        secondary: '#2B2625',
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
    overrides: {
      MuiPaper: {
        root: {
          backgroundColor: '#FFF1DD',
          border: '1px solid #403938',
        },
      },
      MuiButton: {
        containedPrimary: {
          backgroundColor: '#FED8A0',
          '&:hover': {
            backgroundColor: '#FDC777',
          },
          '&:focus': {
            backgroundColor: '#E4B36B',
          },
        },
      },
    },
  }),
);

export default theme;
