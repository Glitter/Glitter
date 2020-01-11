import React from 'react';
import { observer } from 'mobx-react-lite';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import * as Styled from './Widget.css';

interface IProps {
  title: string;
  subtitle?: string;
  type: 'vue' | 'react';
  description?: string;
  id: string;
  actions?: any;
  cardProps?: {
    elevation?: number;
  };
}

const Widget: React.FC<IProps> = observer(
  ({ title, subtitle, type, description, actions, cardProps = {} }) => {
    const recognizedTypes = ['vue', 'react'];
    const iconsMap = {
      vue: 'vuejs',
      react: 'react',
    };

    return (
      <Styled.Widget>
        <Styled.WidgetCard {...cardProps}>
          <CardHeader
            avatar={
              recognizedTypes.includes(type) && (
                <Styled.WidgetIcon type={type}>
                  <FontAwesomeIcon icon={['fab', iconsMap[type]] as IconProp} />
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

export default Widget;
