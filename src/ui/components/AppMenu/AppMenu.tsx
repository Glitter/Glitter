import React from 'react';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Tooltip from '@material-ui/core/Tooltip';
import { Store } from '@ui/store';
import * as Styled from './AppMenu.css';

interface IMenuItem {
  label: string;
  view: string;
  icon: string;
  onClick: ({ store }: { store: typeof Store.Type }) => void;
}

const MENU_ITEMS_TOP: IMenuItem[] = [
  {
    label: 'Dashboard',
    view: 'home',
    icon: 'shield-alt',
    onClick({ store }) {
      store.showHome();
    },
  },
  {
    label: 'Manage widgets',
    view: 'widgets',
    icon: 'window-restore',
    onClick({ store }) {
      store.showWidgets();
    },
  },
];
const MENU_ITEMS_BOTTOM: IMenuItem[] = [
  {
    label: 'For developers',
    view: 'developers',
    icon: 'code',
    onClick({ store }) {
      store.showDevelopers();
    },
  },
];

interface IProps {
  store: typeof Store.Type;
}

const AppMenu: React.FC<IProps> = observer(({ store }) => {
  return (
    <Styled.AppMenu>
      <Styled.AppMenuItems>
        {MENU_ITEMS_TOP.map(menuItem => (
          <Styled.AppMenuItem key={menuItem.view}>
            <Tooltip title={menuItem.label} placement="right">
              <Styled.AppMenuItemButton
                color={
                  store.currentView.name === menuItem.view
                    ? 'primary'
                    : 'default'
                }
                active={store.currentView.name === menuItem.view}
                onClick={() => {
                  menuItem.onClick({ store });
                }}
              >
                <FontAwesomeIcon icon={['fad', menuItem.icon] as IconProp} />
              </Styled.AppMenuItemButton>
            </Tooltip>
          </Styled.AppMenuItem>
        ))}
      </Styled.AppMenuItems>
      <Styled.AppMenuItems>
        {MENU_ITEMS_BOTTOM.map(menuItem => (
          <Styled.AppMenuItem key={menuItem.view}>
            <Tooltip title={menuItem.label} placement="right">
              <Styled.AppMenuItemButton
                color={
                  store.currentView.name === menuItem.view
                    ? 'primary'
                    : 'default'
                }
                active={store.currentView.name === menuItem.view}
                onClick={() => {
                  menuItem.onClick({ store });
                }}
              >
                <FontAwesomeIcon icon={['fad', menuItem.icon] as IconProp} />
              </Styled.AppMenuItemButton>
            </Tooltip>
          </Styled.AppMenuItem>
        ))}
      </Styled.AppMenuItems>
    </Styled.AppMenu>
  );
});

AppMenu.displayName = 'AppMenu';

export default AppMenu;
