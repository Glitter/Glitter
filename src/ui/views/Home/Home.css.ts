import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { getSpacing } from '@ui/css/utilities/spacing';

export const Home = styled.div`
  padding: ${getSpacing(16)};
`;

export const HomeIntro = styled.div`
  margin-bottom: ${getSpacing(32)};
`;

export const HomeStatsNumber = styled(Typography)`
  font-variant-numeric: tabular-nums;
`;
