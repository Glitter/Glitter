import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import DevelopmentWidget from '@ui/components/DevelopmentWidget/DevelopmentWidget';
import DynamicForm from '@ui/components/DynamicForm/DynamicForm';
import * as StyledAppPaper from '@ui/components/AppPaper/AppPaper.css';
import { useStore } from '@ui/store/hooks';
import {
  showSelectDevelopmentWidgetFsDialog as apiShowSelectDevelopmentWidgetFsDialog,
  loadDevelopmentWidget as apiLoadDevelopmentWidget,
} from '@ui/api/widgetLoader';
import {
  showCreateDevelopmentWidgetFsDialog as apiShowCreateDevelopmentWidgetFsDialog,
  createDevelopmentWidget as apiCreateDevelopmentWidget,
} from '@ui/api/widgetCreator';
import { Notification } from '@ui/notifications/store';
import { useStore as useNotificationsStore } from '@ui/notifications/hooks';
import omit from '@utils/omit';
import * as Styled from './Developers.css';

const Developers: React.FC = observer(() => {
  const [addWidgetDialogOpen, setAddWidgetDialogOpen] = useState(false);

  const openAddWidgetDialog = (): void => {
    setAddWidgetDialogOpen(true);
  };
  const closeAddWidgetDialog = (): void => {
    setAddWidgetDialogOpen(false);
  };

  const store = useStore();
  const notificationsStore = useNotificationsStore();

  // Widget configuration
  const [widgetType, setWidgetType] = useState('');
  const [widgetConfiguration, setWidgetConfiguration] = useState<any>({}); // eslint-disable-line @typescript-eslint/no-explicit-any
  const widgetConfigurationFields = [
    {
      name: 'title',
      type: 'text' as 'text',
      label: 'Widget title',
      description: 'Title of your widget. Make it relevant and memorable :)',
    },
    {
      name: 'subtitle',
      type: 'text' as 'text',
      label: 'Widget subtitle',
      description: 'Optional subtitle for your widget',
    },
    {
      name: 'description',
      type: 'text' as 'text',
      label: 'Widget description',
      description: 'Optional, longer description of your widget',
      multiline: true,
    },
    {
      name: 'width',
      type: 'text' as 'text',
      label: 'Widget width',
      description: 'This is the width of your widget window',
      inputType: 'number' as 'number',
      size: 'medium' as 'medium',
    },
    {
      name: 'height',
      type: 'text' as 'text',
      label: 'Widget height',
      description: 'This is the height of your widget window',
      inputType: 'number' as 'number',
      size: 'medium' as 'medium',
    },
  ];
  const [validation, setValidation] = useState<{ [key: string]: string }>({});
  const validateField = (name: string): boolean => {
    switch (name) {
      case 'title':
        if (
          !widgetConfiguration.title ||
          (typeof widgetConfiguration.title === 'string' &&
            widgetConfiguration.title.trim().length === 0)
        ) {
          setValidation(currentValidation => ({
            ...currentValidation,
            [name]: 'Your widget needs a title',
          }));
          return false;
        }

        break;
      case 'width':
        if (
          widgetConfiguration.width === undefined ||
          widgetConfiguration.width === ''
        ) {
          setValidation(currentValidation => ({
            ...currentValidation,
            [name]: 'Your widget needs a width',
          }));
          return false;
        }

        try {
          const parsedWidth = parseInt(widgetConfiguration.width, 10);

          if (parsedWidth <= 0) {
            setValidation(currentValidation => ({
              ...currentValidation,
              [name]:
                'It will be hard to see this widget, please increase width to at least 1',
            }));
            return false;
          }
        } catch (error) {
          setValidation(currentValidation => ({
            ...currentValidation,
            [name]: 'Width should ideally be a number :)',
          }));
          return false;
        }
        break;
      case 'height':
        if (
          widgetConfiguration.height === undefined ||
          widgetConfiguration.height === ''
        ) {
          setValidation(currentValidation => ({
            ...currentValidation,
            [name]: 'Your widget needs a height',
          }));
          return false;
        }

        try {
          const parsedHeight = parseInt(widgetConfiguration.height, 10);

          if (parsedHeight <= 0) {
            setValidation(currentValidation => ({
              ...currentValidation,
              [name]:
                'It will be hard to see this widget, please increase height to at least 1',
            }));
            return false;
          }
        } catch (error) {
          setValidation(currentValidation => ({
            ...currentValidation,
            [name]: 'Height should ideally be a number :)',
          }));
          return false;
        }
        break;
      default:
        break;
    }

    return true;
  };
  const validateConfiguration = (): boolean => {
    let configurationIsValid = true;

    widgetConfigurationFields.forEach(widgetConfigurationField => {
      const fieldIsValid = validateField(widgetConfigurationField.name);

      if (fieldIsValid === false) {
        configurationIsValid = false;
      }
    });

    return configurationIsValid;
  };
  const clearValidation = (name: string): void => {
    if (typeof validation[name] === undefined) {
      return;
    }

    setValidation(omit(validation, name));
  };

  // Creating widgets
  const showSelectDevelopmentWidgetFsDialog = (): void => {
    apiShowSelectDevelopmentWidgetFsDialog().then(
      ({
        filePaths,
        bookmarks,
      }: {
        filePaths: string[];
        bookmarks?: string[];
      }) => {
        if (filePaths.length === 0) {
          return;
        }

        Promise.all(
          filePaths.map((filePath, i) =>
            apiLoadDevelopmentWidget({
              path: filePath,
              securityScopedBookmark:
                bookmarks !== undefined && bookmarks.length > 0
                  ? bookmarks[i]
                  : undefined,
            }),
          ), // eslint-disable-line function-paren-newline
        )
          .then(widgetsLoaded => {
            const successes = widgetsLoaded.filter(
              ({ success }) => success === true,
            );
            const failures = widgetsLoaded.filter(
              ({ success }) => success === false,
            );

            failures.forEach(({ message }) => {
              notificationsStore.addNotification(
                Notification.create({
                  text: message as string,
                  type: 'error',
                }),
              );
            });

            if (successes.length > 0) {
              notificationsStore.addNotification(
                Notification.create({
                  text: `${successes.length} ${
                    successes.length === 1 ? 'widget' : 'widgets'
                  } added`,
                  type: 'success',
                }),
              );
            }
          })
          .finally(() => {
            store.listDevelopmentWidgets({ silent: true });
          });

        closeAddWidgetDialog();
      },
    );
  };

  const showCreateDevelopmentWidgetFsDialog = (): void => {
    apiShowCreateDevelopmentWidgetFsDialog().then(
      ({
        filePaths,
        bookmarks,
      }: {
        filePaths: string[];
        bookmarks?: string[];
      }) => {
        if (filePaths.length === 0) {
          return;
        }

        Promise.all(
          filePaths.map(filePath =>
            apiCreateDevelopmentWidget({
              title: widgetConfiguration.title,
              subtitle: widgetConfiguration.subtitle,
              description: widgetConfiguration.description,
              path: filePath,
              type: widgetType,
              active: true,
              width: parseInt(widgetConfiguration.width, 10),
              height: parseInt(widgetConfiguration.height, 10),
            }),
          ), // eslint-disable-line function-paren-newline
        )
          .then(widgetsCreated => {
            const successes = widgetsCreated.filter(
              ({ success }) => success === true,
            );
            const failures = widgetsCreated.filter(
              ({ success }) => success === false,
            );

            failures.forEach(({ message }) => {
              notificationsStore.addNotification(
                Notification.create({
                  text: message as string,
                  type: 'error',
                }),
              );
            });

            if (successes.length > 0) {
              return Promise.all(
                successes.map((success, i) =>
                  apiLoadDevelopmentWidget({
                    path: success.path as string,
                    securityScopedBookmark:
                      bookmarks !== undefined && bookmarks.length > 0
                        ? bookmarks[i]
                        : undefined,
                  }),
                ), // eslint-disable-line function-paren-newline
              );
            }

            return [];
          })
          .then(widgetsLoaded => {
            const successes = widgetsLoaded.filter(
              ({ success }) => success === true,
            );
            const failures = widgetsLoaded.filter(
              ({ success }) => success === false,
            );

            failures.forEach(({ message }) => {
              notificationsStore.addNotification(
                Notification.create({
                  text: message as string,
                  type: 'error',
                }),
              );
            });

            if (successes.length > 0) {
              notificationsStore.addNotification(
                Notification.create({
                  text: `${successes.length} ${
                    successes.length === 1 ? 'widget' : 'widgets'
                  } added`,
                  type: 'success',
                }),
              );
            }
          })
          .finally(() => {
            store.listDevelopmentWidgets({ silent: true });
          });

        closeAddWidgetDialog();
      },
    );
  };
  const createWidget = (): void => {
    const configurationIsValid = validateConfiguration();

    if (configurationIsValid === false) {
      // There were some validation errors, stop here
      return;
    }

    showCreateDevelopmentWidgetFsDialog();
  };

  const getWidgetLogs = (id: string): string[] => {
    return store.developmentWidgetsLogs.get(id) || [];
  };

  return (
    <Styled.Developers>
      <Styled.NewWidgetSection>
        <Typography variant="body1" gutterBottom>
          You can kick-start the development of a Glitter widget here.
        </Typography>

        <Button
          size="small"
          color="primary"
          variant="contained"
          onClick={openAddWidgetDialog}
        >
          Add new widget
        </Button>

        <Dialog
          open={addWidgetDialogOpen}
          onExited={(): void => {
            setWidgetType('');
            setWidgetConfiguration({});
            setValidation({});
          }}
          PaperComponent={StyledAppPaper.AppPaper}
          disableBackdropClick
          disableEscapeKeyDown
          fullWidth
        >
          <DialogTitle>
            {widgetType === ''
              ? 'What type of widget are you creating?'
              : 'Configure your widget'}
          </DialogTitle>
          {widgetType === '' && (
            <>
              <List>
                <ListItem
                  button
                  onClick={(): void => {
                    setWidgetType('vue');
                  }}
                >
                  <ListItemAvatar>
                    <Styled.VueAvatar>
                      <FontAwesomeIcon icon={['fab', 'vuejs'] as IconProp} />
                    </Styled.VueAvatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Vue.js"
                    secondary="Recommended for those starting out"
                  />
                </ListItem>
                <ListItem
                  button
                  onClick={(): void => {
                    setWidgetType('react');
                  }}
                >
                  <ListItemAvatar>
                    <Styled.ReactAvatar>
                      <FontAwesomeIcon icon={['fab', 'react'] as IconProp} />
                    </Styled.ReactAvatar>
                  </ListItemAvatar>
                  <ListItemText primary="React" />
                </ListItem>
              </List>
              <Divider />
              <List>
                <ListItem button onClick={showSelectDevelopmentWidgetFsDialog}>
                  <ListItemText
                    primary="Load from the filesystem"
                    secondary="If you already have a widget in development but don't see it in the In-development list"
                  />
                </ListItem>
              </List>
            </>
          )}
          {widgetType !== '' && (
            <>
              <DialogContent>
                <DynamicForm
                  fields={widgetConfigurationFields.map(
                    widgetConfigurationField => ({
                      ...widgetConfigurationField,
                      error:
                        typeof validation[widgetConfigurationField.name] ===
                        undefined
                          ? undefined
                          : validation[widgetConfigurationField.name],
                    }),
                  )}
                  state={widgetConfiguration}
                  onChange={({
                    state: newWidgetConfiguration,
                    name: fieldName,
                  }): void => {
                    setWidgetConfiguration(newWidgetConfiguration);
                    clearValidation(fieldName);
                  }}
                  onShouldValidate={(fieldName): void => {
                    validateField(fieldName);
                  }}
                />
              </DialogContent>
            </>
          )}
          <DialogActions>
            <Button
              variant="text"
              color="default"
              size="small"
              onClick={closeAddWidgetDialog}
            >
              Cancel
            </Button>
            {widgetType !== '' && (
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={createWidget}
              >
                Create the widget
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Styled.NewWidgetSection>

      <Typography variant="h6" gutterBottom>
        Widgets in development
      </Typography>
      {store.developmentWidgets.value.length === 0 && (
        <Typography variant="body1" gutterBottom>
          No widgets in development right now. Luckily, it&apos;s simple to get
          started by clicking the button above
        </Typography>
      )}
      {store.developmentWidgets.value.length > 0 && (
        <Styled.WidgetsGrid>
          {store.developmentWidgets.value.map(developmentWidget => (
            <DevelopmentWidget
              key={developmentWidget.id}
              path={developmentWidget.path}
              title={developmentWidget.config.title}
              subtitle={developmentWidget.config.subtitle}
              type={developmentWidget.config.type}
              description={developmentWidget.config.description}
              id={developmentWidget.id}
              logs={getWidgetLogs(developmentWidget.id)}
              active={developmentWidget.config.active}
            />
          ))}
        </Styled.WidgetsGrid>
      )}
    </Styled.Developers>
  );
});

export default Developers;
