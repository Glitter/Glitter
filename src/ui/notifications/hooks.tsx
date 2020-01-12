import React from 'react';
import notificationsStore, { Store } from '@ui/notifications/store';

// Main store
const storeContext = React.createContext(notificationsStore);

export const StoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <storeContext.Provider value={notificationsStore}>
      {children}
    </storeContext.Provider>
  );
};

export const useStore = (): typeof Store.Type => {
  const store = React.useContext(storeContext);

  if (!store) {
    throw new Error('You did not use the StoreProvider');
  }

  return store;
};
