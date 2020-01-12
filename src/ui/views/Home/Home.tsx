import React from 'react';
import { observer } from 'mobx-react-lite';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import StatsGrid from '@ui/components/StatsGrid/StatsGrid';
import StatsCard from '@ui/components/StatsCard/StatsCard';
import { useStore } from '@ui/store/hooks';
import * as Styled from './Home.css';

const Home: React.FC = observer(() => {
  const store = useStore();

  return (
    <Styled.Home>
      <Styled.HomeIntro>
        <Typography variant="h1">Welcome to Glitter</Typography>
        <Typography variant="h5">Your stats at a glance</Typography>
      </Styled.HomeIntro>
      <StatsGrid>
        <StatsCard>
          <CardContent>
            {store.developmentWidgets.value.length === 0 && (
              <Typography variant="h5">
                You don&apos;t have any widgets yet
              </Typography>
            )}

            {store.developmentWidgets.value.length > 0 && (
              <>
                <Typography variant="h5">
                  You have{' '}
                  <Styled.HomeStatsNumber
                    variant="h5"
                    color="primary"
                    variantMapping={{ h5: 'span' }}
                  >
                    {store.developmentWidgets.value.length}
                  </Styled.HomeStatsNumber>{' '}
                  {store.developmentWidgets.value.length === 1
                    ? 'widget'
                    : 'widgets'}{' '}
                  in development.
                </Typography>
              </>
            )}
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color="primary"
              onClick={(): void => {
                store.showDevelopers();
              }}
            >
              Create a widget
            </Button>
          </CardActions>
        </StatsCard>
        <StatsCard>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Useful resources
            </Typography>
            <List component="nav">
              <ListItem
                button
                component="a"
                href="https://tryglitter.com"
                target="_blank"
                rel="noreferrer noopener"
              >
                <ListItemText primary="Official website" />
              </ListItem>
              <ListItem
                button
                component="a"
                href="https://discord.gg/CdefJmp"
                target="_blank"
                rel="noreferrer noopener"
              >
                <ListItemText primary="Official community chat" />
              </ListItem>
            </List>
          </CardContent>
        </StatsCard>
      </StatsGrid>
    </Styled.Home>
  );
});

export default Home;
