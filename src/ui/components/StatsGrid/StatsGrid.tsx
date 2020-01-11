import React from 'react';
import { observer } from 'mobx-react-lite';
import * as Styled from './StatsGrid.css';

const StatsGrid = observer(({ children }) => {
  return <Styled.StatsGrid>{children}</Styled.StatsGrid>;
});

export default StatsGrid;
