import styled from 'styled-components';
import SnackbarContent from '@material-ui/core/SnackbarContent';

export const NotificationSuccess = styled(SnackbarContent)`
  background-color: hsl(161, 100%, 87%);
`;

export const NotificationError = styled(SnackbarContent)`
  background-color: hsl(357, 66%, 68%);
`;
