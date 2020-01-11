import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import * as Styled from './StatsCard.css';

interface StatsCardInterface {
  elevation?: number;
}

const StatsCard: React.FC<StatsCardInterface> = observer(
  ({ children, elevation = 1 }) => {
    return (
      <Styled.StatsCard elevation={elevation}>{children}</Styled.StatsCard>
    );
  },
);

StatsCard.propTypes = {
  elevation: PropTypes.number,
};

export default StatsCard;
