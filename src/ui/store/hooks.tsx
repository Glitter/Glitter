import React from 'react';
import mainStore from '@ui/store';

// Main store
const storeContext = React.createContext(mainStore);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <storeContext.Provider value={mainStore}>{children}</storeContext.Provider>
  );
};

export const useStore = () => {
  const store = React.useContext(storeContext);

  if (!store) {
    throw new Error('You did not use the StoreProvider');
  }

  return store;
};
