/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { RefObject } from 'react';
import styled, { css } from 'styled-components';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import { getSpacing } from '@ui/css/utilities/spacing';

export const Widget = styled.article`
  min-width: 0;
`;

export const WidgetCard = styled(Card)`
  background-color: hsl(220, 40%, 27%);
`;

interface WidgetIconInterface {
  type: 'vue' | 'react';
}

export const WidgetIcon = styled(
  // eslint-disable-next-line react/display-name, @typescript-eslint/no-unused-vars
  React.forwardRef(({ type, ...rest }: WidgetIconInterface, ref) => (
    <Avatar {...rest} ref={ref as RefObject<HTMLDivElement>} />
  )),
)`
  ${props =>
    props.type === 'vue'
      ? css`
          background-color: hsl(153, 48%, 49%);
        `
      : css`
          background-color: hsl(193, 95%, 68%);
        `}
` as any; // eslint-disable-line @typescript-eslint/no-explicit-any

export const ReactAvatar = styled(Avatar)`
  background-color: hsl(193, 95%, 68%);
`;

export const VueAvatar = styled(Avatar)`
  background-color: hsl(153, 48%, 49%);
`;

export const WidgetDescription = styled.div``;

export const Actions = styled.div`
  margin-top: ${getSpacing(32)};
`;
