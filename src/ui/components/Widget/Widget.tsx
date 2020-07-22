import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import * as Styled from './Widget.css';

interface WidgetInterface {
  title: string;
  subtitle?: string;
  type: string;
  description?: string;
  actions?: JSX.Element;
  cardProps?: {
    elevation?: number;
  };
}

const Widget: React.FC<WidgetInterface> = observer(
  ({ title, subtitle, type, description, actions, cardProps = {} }) => {
    const recognizedTypes = ['vue', 'react'];
    const icon = type === 'vue' ? 'vuejs' : 'react';

    return (
      <Styled.Widget>
        <Styled.WidgetCard {...cardProps}>
          <CardHeader
            avatar={
              recognizedTypes.includes(type) && (
                <Styled.WidgetIcon type={type}>
                  <FontAwesomeIcon icon={['fab', icon] as IconProp} />
                </Styled.WidgetIcon>
              )
            }
            title={title}
            subheader={subtitle}
          />

          <CardContent>
            {description && (
              <Styled.WidgetDescription>
                <Typography variant="body2" component="p">
                  {description}
                </Typography>
              </Styled.WidgetDescription>
            )}
            {actions && <Styled.Actions>{actions}</Styled.Actions>}
          </CardContent>
        </Styled.WidgetCard>
      </Styled.Widget>
    );
  },
);

Widget.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  type: PropTypes.string.isRequired,
  description: PropTypes.string,
  actions: PropTypes.element,
  cardProps: PropTypes.shape({
    elevation: PropTypes.any,
  }),
};

export default Widget;
