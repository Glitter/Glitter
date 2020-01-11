import { createGlobalStyle } from 'styled-components';
import font100 from '@ui/fonts/IBMPlexSans-Thin.woff2';
import font200 from '@ui/fonts/IBMPlexSans-ExtraLight.woff2';
import font300 from '@ui/fonts/IBMPlexSans-Light.woff2';
import font400 from '@ui/fonts/IBMPlexSans.woff2';
import font500 from '@ui/fonts/IBMPlexSans-Medium.woff2';
import font600 from '@ui/fonts/IBMPlexSans-SemiBold.woff2';
import font700 from '@ui/fonts/IBMPlexSans-Bold.woff2';
import fontItalic100 from '@ui/fonts/IBMPlexSans-ThinItalic.woff2';
import fontItalic200 from '@ui/fonts/IBMPlexSans-ExtraLightItalic.woff2';
import fontItalic300 from '@ui/fonts/IBMPlexSans-LightItalic.woff2';
import fontItalic400 from '@ui/fonts/IBMPlexSans-Italic.woff2';
import fontItalic500 from '@ui/fonts/IBMPlexSans-MediumItalic.woff2';
import fontItalic600 from '@ui/fonts/IBMPlexSans-SemiBoldItalic.woff2';
import fontItalic700 from '@ui/fonts/IBMPlexSans-BoldItalic.woff2';

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'IBM Plex Sans';
    src: url(${fontItalic600}) format('woff2');
    font-weight: 600;
    font-style: italic;
  }

  @font-face {
    font-family: 'IBM Plex Sans';
    src: url(${fontItalic200}) format('woff2');
    font-weight: 200;
    font-style: italic;
  }

  @font-face {
    font-family: 'IBM Plex Sans';
    src: url(${font700}) format('woff2');
    font-weight: bold;
    font-style: normal;
  }

  @font-face {
    font-family: 'IBM Plex Sans';
    src: url(${font500}) format('woff2');
    font-weight: 500;
    font-style: normal;
  }

  @font-face {
    font-family: 'IBM Plex Sans';
    src: url(${font300}) format('woff2');
    font-weight: 300;
    font-style: normal;
  }

  @font-face {
    font-family: 'IBM Plex Sans';
    src: url(${fontItalic100}) format('woff2');
    font-weight: 100;
    font-style: italic;
  }

  @font-face {
    font-family: 'IBM Plex Sans';
    src: url(${font100}) format('woff2');
    font-weight: 100;
    font-style: normal;
  }

  @font-face {
    font-family: 'IBM Plex Sans';
    src: url(${fontItalic700}) format('woff2');
    font-weight: bold;
    font-style: italic;
  }

  @font-face {
    font-family: 'IBM Plex Sans';
    src: url(${font600}) format('woff2');
    font-weight: 600;
    font-style: normal;
  }

  @font-face {
    font-family: 'IBM Plex Sans';
    src: url(${font200}) format('woff2');
    font-weight: 200;
    font-style: normal;
  }

  @font-face {
    font-family: 'IBM Plex Sans';
    src: url(${fontItalic400}) format('woff2');
    font-weight: normal;
    font-style: italic;
  }

  @font-face {
    font-family: 'IBM Plex Sans';
    src: url(${fontItalic500}) format('woff2');
    font-weight: 500;
    font-style: italic;
  }

  @font-face {
    font-family: 'IBM Plex Sans';
    src: url(${fontItalic300}) format('woff2');
    font-weight: 300;
    font-style: italic;
  }

  @font-face {
    font-family: 'IBM Plex Sans';
    src: url(${font400}) format('woff2');
    font-weight: normal;
    font-style: normal;
  }

  html {
    box-sizing: border-box;
    height: 100%;
  }

  body {
    background-image: linear-gradient(
      90deg,
      hsl(215, 46%, 11%) 0%,
      hsl(206, 44%, 13%) 100%
    );
    color: hsl(0, 0%, 100%);
    font-family: proxima-nova, sans-serif;
    font-size: 1rem;
    font-style: normal;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }
`;
