import styled from 'styled-components';
import { getSpacing } from '@ui/css/utilities/spacing';

export const WidgetsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: ${getSpacing(32)};
  margin-bottom: ${getSpacing(16)};
`;

export const NoWidgetsInstalled = styled.div`
  align-content: center;
  display: grid;
  grid-gap: ${getSpacing(16)};
  justify-content: center;
  justify-items: center;
  padding: ${getSpacing(16)};
  text-align: center;
`;

export const ConfigureWidgetInstanceDialogTitle = styled.span`
  text-decoration: underline;
`;
