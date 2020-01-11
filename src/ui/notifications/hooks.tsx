import React from 'react';
import notificationsStore from '@ui/notifications/store';

// Main store
const storeContext = React.createContext(notificationsStore);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <storeContext.Provider value={notificationsStore}>
      {children}
    </storeContext.Provider>
  );
};

export const useStore = () => {
  const store = React.useContext(storeContext);

  if (!store) {
    throw new Error('You did not use the StoreProvider');
  }

  return store;
};
