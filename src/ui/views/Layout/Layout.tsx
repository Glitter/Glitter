import React from 'react';
import { observer } from 'mobx-react-lite';
import AppMenu from '@ui/components/AppMenu/AppMenu';
import Notifications from '@ui/notifications/Notifications';
import Logo from '@ui/static/branding/logo.svg';
import * as Types from './LayoutTypes';
import * as Styled from './Layout.css';

const Layout: React.FC<Types.Props> = observer(({ store, children }) => {
  return (
    <Styled.Layout>
      <Styled.MenuContainer>
        <AppMenu store={store} />
      </Styled.MenuContainer>
      <Styled.ContentContainer>
        <Styled.ContentContainerTop>
          <Styled.PageTitle variant="h6">
            {store.currentView.title || ''}
          </Styled.PageTitle>
          <Styled.Branding dangerouslySetInnerHTML={{ __html: Logo }} />
        </Styled.ContentContainerTop>
        <Styled.ContentContainerInner>{children}</Styled.ContentContainerInner>
      </Styled.ContentContainer>
      <Notifications />
    </Styled.Layout>
  );
});

export default Layout;
