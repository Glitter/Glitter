import styled from 'styled-components';
import { getSpacing } from '@ui/css/utilities/spacing';

export const DynamicForm = styled.form``;

export const Field = styled.div`
  :not(:first-child) {
    margin-top: ${getSpacing(32)};
  }
`;
