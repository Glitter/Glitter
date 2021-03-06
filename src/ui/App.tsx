import React from 'react';
import { observer } from 'mobx-react-lite';
import 'mobx-react-lite/batchingForReactDom';
import { ThemeProvider, StylesProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Layout from '@ui/views/Layout/Layout';
import { GlobalStyle } from '@ui/css/global';
import theme from '@ui/css/theme';
import renderCurrentView from '@ui/views';
import { Store } from '@ui/store';
import { StoreProvider } from '@ui/store/hooks';
import { Store as NotificationStore } from '@ui/notifications/store';
import { StoreProvider as NotificationStoreProvider } from '@ui/notifications/hooks';

interface PropsInterface {
  store: typeof Store.Type;
  notificationsStore: typeof NotificationStore.Type;
}

const App: React.FC<PropsInterface> = observer(({ store }) => {
  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyle />
        <StoreProvider>
          <NotificationStoreProvider>
            <Layout store={store}>{renderCurrentView({ store })}</Layout>
          </NotificationStoreProvider>
        </StoreProvider>
      </ThemeProvider>
    </StylesProvider>
  );
});

export default App;
