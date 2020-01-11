import styled from 'styled-components';
import Avatar from '@material-ui/core/Avatar';
import { getSpacing } from '@ui/css/utilities/spacing';

export const Developers = styled.div`
  padding: ${getSpacing(16)};
`;

export const NewWidgetSection = styled.section`
  margin-bottom: ${getSpacing(32)};
`;

export const ReactAvatar = styled(Avatar)`
  background-color: hsl(193, 95%, 68%);
`;

export const VueAvatar = styled(Avatar)`
  background-color: hsl(153, 48%, 49%);
`;

export const WidgetsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${getSpacing(32)};
`;
