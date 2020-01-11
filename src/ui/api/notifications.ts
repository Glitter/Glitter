import { ipcRenderer } from 'electron';
import notificationsStore, { Notification } from '@ui/notifications/store';

export const listenForNotifications = () => {
  ipcRenderer.on(
    'api/notifications/addNotification',
    (_event, { text, type }: typeof Notification.Type) => {
      notificationsStore.addNotification(
        Notification.create({
          text,
          type,
        }),
      );
    },
  );
};
