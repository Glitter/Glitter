import styled from 'styled-components';
import { getSpacing } from '@ui/css/utilities/spacing';

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${getSpacing(32)};
`;
