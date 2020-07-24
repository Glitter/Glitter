import React from 'react';
import ReactDOM from 'react-dom';
import App from '@ui/App';
import store from '@ui/store';
import notificationsStore from '@ui/notifications/store';
import { listenForNotifications } from '@ui/api/notifications';
import { listenForLogs } from '@ui/api/logs';
import '@ui/icons';

ReactDOM.render(
  <App store={store} notificationsStore={notificationsStore} />,
  document.querySelector('#app'),
);

listenForNotifications();
listenForLogs();

// Add TS support for requestIdleCallback
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = {
  timeout: number;
};
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: () => number;
};

declare global {
  interface Window {
    requestIdleCallback: (
      callback: (deadline: RequestIdleCallbackDeadline) => void,
      opts?: RequestIdleCallbackOptions,
    ) => RequestIdleCallbackHandle;
    cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void;
  }
}
