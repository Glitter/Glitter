import React, { useState, useEffect } from 'react';
import { onAction } from 'mobx-state-tree';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useStore as useNotificationsStore } from '@ui/notifications/hooks';
import * as Styled from './Notifications.css';

const Notifications = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [notificationId, setNotificationId] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const onSnackbarClose = (
    _event: React.SyntheticEvent<any, Event>,
    reason: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  const notificationsStore = useNotificationsStore();

  const processQueue = () => {
    if (notificationsStore.notifications.length === 0) {
      return;
    }

    const notification = notificationsStore.notifications[0];

    setNotificationId(notification.id);
    setSnackbarText(notification.text);
    setNotificationType(notification.type);
    setSnackbarOpen(true);
  };

  const onExited = () => {
    notificationsStore.removeNotification(notificationId);
    processQueue();
  };

  useEffect(() => {
    const stopWatchingNotifications = onAction(
      notificationsStore,
      ({ name }) => {
        if (name !== 'addNotification') {
          return;
        }

        window.requestIdleCallback(processQueue);
      },
    );

    return stopWatchingNotifications;
  }, []);

  const notificationContentTag = () => {
    const message = ({ icon }: { icon: React.ReactElement<any> }) => (
      <span id="notifications-text">
        {icon}&nbsp;&nbsp;{snackbarText}
      </span>
    );
    switch (notificationType) {
      case 'success':
        return (
          <Styled.NotificationSuccess
            message={message({
              icon: (
                <FontAwesomeIcon icon={['fad', 'check-circle'] as IconProp} />
              ),
            })}
          />
        );
      case 'error':
        return (
          <Styled.NotificationError
            message={message({
              icon: (
                <FontAwesomeIcon
                  icon={['fad', 'exclamation-circle'] as IconProp}
                />
              ),
            })}
          />
        );
      default:
        return (
          <SnackbarContent
            message={message({
              icon: (
                <FontAwesomeIcon icon={['fad', 'info-circle'] as IconProp} />
              ),
            })}
          />
        );
    }
  };

  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={notificationType === 'error' ? 8000 : 3000}
      onClose={onSnackbarClose}
      onExited={onExited}
      ContentProps={{
        'aria-describedby': 'notifications-text',
      }}
    >
      {notificationContentTag()}
    </Snackbar>
  );
};

Notifications.displayName = 'Notifications';

export default Notifications;
