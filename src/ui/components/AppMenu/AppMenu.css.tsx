/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { RefObject } from 'react';
import styled, { css } from 'styled-components';
import rem from 'remcalc';
import IconButton from '@material-ui/core/IconButton';
import { getSpacing } from '@ui/css/utilities/spacing';
import theme from '@ui/css/theme';

interface AppMenuItemButtonInterface {
  active: boolean;
}

export const AppMenu = styled.nav`
  display: flex;
  flex-flow: column nowrap;
  height: 100vh;
  justify-content: space-between;
`;

export const AppMenuItems = styled.ul`
  align-content: start;
  align-items: start;
  display: grid;
  grid-gap: ${getSpacing(16)};
  list-style: none;
  margin-bottom: 0;
  margin-top: 0;
  padding-bottom: ${getSpacing(16)};
  padding-left: 0;
  padding-top: ${getSpacing(16)};
`;

export const AppMenuItem = styled.li`
  display: flex;
  justify-content: center;
`;

export const AppMenuItemButton = styled(
  // eslint-disable-next-line react/display-name, @typescript-eslint/no-unused-vars
  React.forwardRef(({ active, ...rest }: AppMenuItemButtonInterface, ref) => (
    <IconButton {...rest} ref={ref as RefObject<HTMLButtonElement>} />
  )),
)`
  background-color: hsla(0, 0%, 0%, 0.4);
  border-radius: 50%;
  border: 2px solid hsl(0, 0%, 15%);
  width: ${rem(52)};

  ${(props) =>
    props.active &&
    css`
      border-color: ${theme.palette.primary.light};
      color: ${theme.palette.primary.light};
    `}
` as any; // eslint-disable-line @typescript-eslint/no-explicit-any
