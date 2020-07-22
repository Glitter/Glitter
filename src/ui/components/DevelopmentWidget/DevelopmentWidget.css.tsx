/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { RefObject } from 'react';
import styled, { css } from 'styled-components';
import rem from 'remcalc';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getSpacing } from '@ui/css/utilities/spacing';

export const DevelopmentWidget = styled.article`
  min-width: 0;
`;

export const DevelopmentWidgetCard = styled(Card)`
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
  ${(props) =>
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

export const WidgetDescription = styled.div`
  margin-bottom: ${getSpacing(32)};
`;

export const Logs = styled.div`
  background-color: hsla(0, 0%, 0%, 0.9);
  border-radius: ${rem(4)};
  font-family: monospace;
  overflow: hidden;
  padding: ${getSpacing(16)};
  text-overflow: ellipsis;
  white-space: pre;
`;

export const LogsSeeAll = styled(Button)`
  margin-top: ${getSpacing(8)};
`;

export const LogsFullTitle = styled(DialogTitle)`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`;

export const LogsFull = styled.div`
  background-color: hsla(0, 0%, 0%, 0.9);
  border-radius: ${rem(4)};
  font-family: monospace;
  margin-bottom: ${getSpacing(16)};
  overflow: hidden;
  padding: ${getSpacing(16)};
  white-space: pre-wrap;
`;

export const LogsFullNote = styled(Typography)`
  margin-left: ${getSpacing(16)};
  font-style: italic;
`;

export const WidgetSettingsButton = styled(IconButton)`
  width: ${rem(42)};
  height: ${rem(42)};
  font-size: ${rem(16)};
`;
