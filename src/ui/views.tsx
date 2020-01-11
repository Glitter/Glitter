import React, { useEffect } from 'react';
import Home from '@ui/views/Home/Home';
import Widgets from '@ui/views/Widgets/Widgets';
import Developers from '@ui/views/Developers/Developers';
import NotFound from '@ui/views/404';
import { Store } from '@ui/store';

interface IProps {
  store: typeof Store.Type;
}

const renderCurrentView = ({ store }: IProps) => {
  const view = store.currentView;

  switch (view.name) {
    case 'home':
      return <Home />;
    case 'widgets':
      return <Widgets />;
    case 'developers':
      return <Developers />;
    default:
      return <NotFound store={store} />;
  }
};

export default renderCurrentView;
