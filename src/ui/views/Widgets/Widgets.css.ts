import styled from 'styled-components';
import rem from 'remcalc';
import color from 'color';
import { getSpacing } from '@ui/css/utilities/spacing';
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
  max-width: 100%;
  overflow: hidden;
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

export const ScreenWidgetInstance = styled.div`
  background-color: ${color(theme.palette.primary.light)
    .fade(0.8)
    .string()};
  border: 1px solid ${theme.palette.primary.main};
  border-radius: ${rem(4)};
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
`;

export const ScreenWidgetInstanceContent = styled.div`
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
`;

export const ManageWidgetInstanceDialogTitle = styled.span`
  color: ${theme.palette.primary.light};
`;

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
