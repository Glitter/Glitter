/* eslint-disable no-param-reassign */
import { types } from 'mobx-state-tree';
import uuid from 'uuid/v4';

export const Notification = types.model({
  text: types.string,
  type: types.union(types.literal('error'), types.literal('success')),
  id: types.optional(types.string, uuid),
});
const Notifications = types.array(Notification);

export const Store = types
  .model('Store', {
    notifications: Notifications,
  })
  .actions(self => {
    const addNotification = (notification: typeof Notification.Type) => {
      self.notifications.push(notification);
    };
    const removeNotification = (id: string) => {
      const notificationIndex = self.notifications.findIndex(
        notification => notification.id === id,
      );

      if (notificationIndex === -1) {
        return;
      }

      self.notifications.splice(notificationIndex, 1);
    };

    return {
      addNotification,
      removeNotification,
    };
  });

const store = Store.create({
  notifications: [],
});

export default store;
