import styled from 'styled-components';
import rem from 'remcalc';
import color from 'color';
import { getSpacing } from '@ui/css/utilities/spacing';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import theme from '@ui/css/theme';

export const Widgets = styled.div`
  padding: ${getSpacing(16)};
`;

export const ScreenContainer = styled.section`
  align-items: flex-start;
  display: flex;
  height: 70vh;
  justify-content: center;
  max-height: 700px;
  max-width: calc(100% - ${rem(48)});
`;

export const Screen = styled.div`
  background-color: ${color(theme.palette.primary.light)
    .fade(0.8)
    .string()};
  border-radius: ${rem(4)};
  max-height: 100%;
  position: relative;
`;

export const ScreenEmpty = styled.div`
  align-content: center;
  display: grid;
  grid-gap: ${getSpacing(16)};
  height: 100%;
  justify-content: center;
  justify-items: center;
  padding: ${getSpacing(16)};
  text-align: center;
`;

export const ScreenWidgetInstanceTooltip = styled.div`
  display: none;
  height: 100%;
  left: 100%;
  padding-left: ${getSpacing(16)};
  position: absolute;
`;

export const ScreenWidgetInstanceTooltipButtons = styled.div`
  background-color: hsla(0, 0%, 0%, 0.5);
  border-radius: ${rem(4)};
  display: grid;
  grid-gap: ${getSpacing(4)};
  padding: ${getSpacing(4)};
`;

export const ScreenWidgetInstanceTooltipIcon = styled(IconButton)``;

export const ScreenWidgetInstance = styled.div`
  background-color: ${color(theme.palette.primary.light)
    .fade(0.8)
    .string()};
  border: 1px solid ${theme.palette.primary.main};
  border-radius: ${rem(4)};
  position: absolute;
  top: 0;
  left: 0;

  &:hover ${ScreenWidgetInstanceTooltip} {
    display: block;
  }
`;

export const ScreenWidgetInstanceContent = styled.div`
  cursor: move;
  height: 100%;
  left: 0;
  overflow: hidden;
  padding: ${getSpacing(4)};
  position: absolute;
  top: 0;
  width: 100%;
`;

export const ScreenWidgetInstanceTitle = styled(Typography)``;

export const Actions = styled.section`
  align-items: center;
  display: grid;
  grid-gap: ${getSpacing(16)};
  grid-template-columns: auto auto;
  justify-content: center;
  margin-top: ${getSpacing(32)};
`;

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
