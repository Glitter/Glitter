import React from 'react';
import { observer } from 'mobx-react-lite';
import * as Styled from './StatsCard.css';

interface IProps {
  elevation?: number;
}

const StatsCard: React.FC<IProps> = observer(({ children, elevation = 1 }) => {
  return <Styled.StatsCard elevation={elevation}>{children}</Styled.StatsCard>;
});

export default StatsCard;
