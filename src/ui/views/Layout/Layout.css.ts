import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { getSpacing } from '@ui/css/utilities/spacing';

export const Layout = styled.main`
  display: grid;
  grid-template-columns: 80px auto;
  grid-template-areas: 'menu content';
`;

export const MenuContainer = styled.section`
  grid-area: menu;
`;

export const ContentContainer = styled.section`
  grid-area: content;
  min-width: 0;
`;

export const ContentContainerTop = styled.header`
  align-items: baseline;
  border-bottom: 1px solid hsla(0, 0%, 0%, 0.3);
  display: flex;
  justify-content: space-between;
  padding: ${getSpacing(8)} ${getSpacing(16)};
`;

export const PageTitle = styled(Typography)``;

export const ContentContainerInner = styled.div``;

export const Branding = styled.div`
  display: flex;
  justify-content: flex-end;

  svg {
    display: block;
    height: auto;
    width: 92px;
  }
`;
