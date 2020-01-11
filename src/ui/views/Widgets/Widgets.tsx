import React, { useMemo, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { remote, ipcRenderer } from 'electron';
import { useMeasure } from 'react-use';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Browser as KawaiiBrowser } from 'react-kawaii';
import theme from '@ui/css/theme';
import Widget from '@ui/components/Widget/Widget';
import {
  addDevelopmentWidgetInstance as apiAddDevelopmentWidgetInstance,
  removeDevelopmentWidgetInstance as apiRemoveDevelopmentWidgetInstance,
  setDevelopmentWidgetInstancePosition as apiSetDevelopmentWidgetInstancePosition,
} from '@ui/api/widgetInstantiator';
import { useStore } from '@ui/store/hooks';
import * as StyledAppPaper from '@ui/components/AppPaper/AppPaper.css';
import * as Styled from './Widgets.css';

const Widgets: React.FC = observer(() => {
  const store = useStore();

  // Displays
  const [displays, setDisplays] = useState(remote.screen.getAllDisplays());
  const [selectedDisplay, setSelectedDisplay] = useState(
    displays.length > 0 ? displays[0] : undefined,
  );
  const updateDisplays = (): void => {
    const newDisplays = remote.screen.getAllDisplays();

    setDisplays(newDisplays);

    if (
      selectedDisplay === undefined ||
      newDisplays.find(display => display.id === selectedDisplay.id) ===
        undefined
    ) {
      setSelectedDisplay(newDisplays.length > 0 ? newDisplays[0] : undefined);
    }
  };

  useEffect(() => {
    ipcRenderer.on('api/screen/displayAdded', updateDisplays);
    ipcRenderer.on('api/screen/displayRemoved', updateDisplays);

    return (): void => {
      ipcRenderer.off('api/screen/displayAdded', updateDisplays);
      ipcRenderer.off('api/screen/displayRemoved', updateDisplays);
    };
  }, []);

  // Screen size
  const displaySize = useMemo(() => {
    if (selectedDisplay === undefined) {
      return { width: 0, height: 0 };
    }

    return selectedDisplay.workAreaSize;
  }, [selectedDisplay]);
  const [
    screenContainerRef,
    { width: maxScreenWidth, height: maxScreenHeight },
  ] = useMeasure();

  const screenSize = useMemo(() => {
    if (maxScreenWidth === 0 || maxScreenHeight === 0) {
      return { width: 0, height: 0 };
    }

    if (
      displaySize.width < maxScreenWidth &&
      displaySize.height < maxScreenHeight
    ) {
      return {
        width: displaySize.width,
        height: displaySize.height,
      };
    }

    // First we try adjusting based on height
    let height = Math.min(displaySize.height, maxScreenHeight);
    let width = Math.round((displaySize.width / displaySize.height) * height);

    if (width < maxScreenWidth) {
      // It all fits, we are done
      return { width, height };
    }

    // Won't fit (based on width), let us further reduce it
    width = maxScreenWidth;
    height = Math.round(width / (displaySize.width / displaySize.height));

    return { width, height };
  }, [displaySize.width, displaySize.height, maxScreenWidth, maxScreenHeight]);

  // Add widget instance dialog
  const [
    addWidgetInstanceDialogOpen,
    setAddWidgetInstanceDialogOpen,
  ] = useState(false);

  const openAddWidgetInstanceDialog = (): void => {
    setAddWidgetInstanceDialogOpen(true);
  };
  const closeAddWidgetInstanceDialog = (): void => {
    setAddWidgetInstanceDialogOpen(false);
  };

  // Creating widget instance
  const createDevelopmentWidgetInstance = async ({
    widgetId,
    displayId,
  }: {
    widgetId: string;
    displayId: number;
  }): Promise<void> => {
    closeAddWidgetInstanceDialog();
    await apiAddDevelopmentWidgetInstance({ widgetId, displayId });
    await store.listDevelopmentWidgetsInstances({ silent: true });
  };

  // Displaying widget instances
  const getWidgetInstanceDisplayCoordinates = ({
    position,
    screenSize,
    renderedScreenSize,
  }: {
    position: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    screenSize: {
      width: number;
      height: number;
    };
    renderedScreenSize: {
      width: number;
      height: number;
    };
  }): { x: number; y: number } => {
    const realScreenX =
      position.left !== undefined
        ? position.left
        : position.right !== undefined
        ? screenSize.width - position.right
        : 0;
    const realScreenY =
      position.top !== undefined
        ? position.top
        : position.bottom !== undefined
        ? screenSize.height - position.bottom
        : 0;

    return {
      x: Math.round(
        (renderedScreenSize.width / screenSize.width) * realScreenX,
      ),
      y: Math.round(
        (renderedScreenSize.height / screenSize.height) * realScreenY,
      ),
    };
  };

  const getWidgetInstanceDisplaySize = ({
    widgetSize,
    screenSize,
    renderedScreenSize,
  }: {
    widgetSize: {
      width: number;
      height: number;
    };
    screenSize: {
      width: number;
      height: number;
    };
    renderedScreenSize: {
      width: number;
      height: number;
    };
  }): { width: number; height: number } => {
    return {
      width: Math.round(
        (renderedScreenSize.width / screenSize.width) * widgetSize.width,
      ),
      height: Math.round(
        (renderedScreenSize.height / screenSize.height) * widgetSize.height,
      ),
    };
  };

  // Manage widget instance dialog
  const [
    manageWidgetInstanceDialogOpen,
    setManageWidgetInstanceDialogOpen,
  ] = useState(false);
  const [selectedWidgetInstanceId, setSelectedWidgetInstanceId] = useState<
    string | undefined
  >(undefined);

  const openManageWidgetInstanceDialog = (): void => {
    setManageWidgetInstanceDialogOpen(true);
  };
  const closeManageWidgetInstanceDialog = (): void => {
    setManageWidgetInstanceDialogOpen(false);
  };

  const [
    deleteWidgetInstanceDialogOpen,
    setDeleteWidgetInstanceDialogOpen,
  ] = useState(false);
  const openDeleteWidgetInstanceDialog = (): void => {
    setDeleteWidgetInstanceDialogOpen(true);
  };
  const closeDeleteWidgetInstanceDialog = (): void => {
    setDeleteWidgetInstanceDialogOpen(false);
  };

  // Updating widget instances position
  const updateWidgetInstancePosition = ({
    widgetInstanceId,
    renderedScreenPosition,
    screenSize,
    renderedScreenSize,
    widgetSize,
  }: {
    widgetInstanceId: string;
    renderedScreenPosition: {
      x: number;
      y: number;
    };
    screenSize: {
      width: number;
      height: number;
    };
    renderedScreenSize: {
      width: number;
      height: number;
    };
    widgetSize: {
      width: number;
      height: number;
    };
  }): void => {
    const scaleFactor = renderedScreenSize.width / screenSize.width;
    const realScreenPosition = {
      x: Math.round(renderedScreenPosition.x / scaleFactor),
      y: Math.round(renderedScreenPosition.y / scaleFactor),
    };
    const widgetCenterCoordinates = {
      x: realScreenPosition.x + widgetSize.width / 2,
      y: realScreenPosition.y + widgetSize.height / 2,
    };

    const position = {
      top:
        widgetCenterCoordinates.y <= screenSize.height / 2
          ? // It's above the center, set top
            realScreenPosition.y
          : // It's below the center, don't set top
            undefined,
      bottom:
        widgetCenterCoordinates.y <= screenSize.height / 2
          ? // It's above the center, don't set bottom
            undefined
          : // It's below the center, set bottom
            screenSize.height - realScreenPosition.y,
      left:
        widgetCenterCoordinates.x <= screenSize.width / 2
          ? // It's to the left of the center, set left
            realScreenPosition.x
          : // It's to the right of the center, don't set left
            undefined,
      right:
        widgetCenterCoordinates.x <= screenSize.width / 2
          ? // It's to the left of the center, don't set right
            undefined
          : // It's to the right of the center, set right
            screenSize.width - realScreenPosition.x,
    };

    const widgetInstance = store.developmentWidgetsInstances.value.find(
      ({ id }) => id === widgetInstanceId,
    );

    if (widgetInstance === undefined) {
      return;
    }

    // Let's check if the widget moved at all
    const positionProps = ['top', 'right', 'bottom', 'left'] as [
      'top',
      'right',
      'bottom',
      'left',
    ];
    let allPositionPropsEqual = true;

    positionProps.forEach(positionProp => {
      if (widgetInstance.position[positionProp] !== position[positionProp]) {
        allPositionPropsEqual = false;
      }
    });

    if (allPositionPropsEqual === true) {
      // The widget did not move at all, we instead open the widget instance
      // management dialog
      setSelectedWidgetInstanceId(widgetInstance.id);
      openManageWidgetInstanceDialog();
      return;
    }

    apiSetDevelopmentWidgetInstancePosition({
      id: widgetInstanceId,
      position,
    }).then(() => {
      store.listDevelopmentWidgetsInstances({ silent: true });
    });
  };

  // Manage widget instances tooltips
  const [
    widgetsInstancesTooltipsOpen,
    setWidgetsInstancesTooltipsOpen,
  ] = useState(new Map<string, boolean>());
  const [
    preventWidgetsInstancesTooltipsOpen,
    setPreventWidgetsInstancesTooltipsOpen,
  ] = useState(false);

  // Empty screen
  const [emptyScreenKawaiiMood, setEmptyScreenKawaiiMood] = useState('happy');

  // Empty widgets dialog
  const [emptyWidgetsKawaiiMood, setEmptyWidgetsKawaiiMood] = useState('happy');

  return (
    <Styled.Widgets>
      <Styled.ScreenContainer ref={screenContainerRef}>
        {screenSize.width > 0 && (
          <Styled.Screen
            style={{
              width: `${screenSize.width}px`,
              height: `${screenSize.height}px`,
            }}
          >
            {store.screenDevelopmentWidgetInstances(selectedDisplay?.id)
              .length === 0 && (
              <Styled.ScreenEmpty>
                <KawaiiBrowser
                  mood={
                    emptyScreenKawaiiMood as
                      | 'happy'
                      | 'sad'
                      | 'shocked'
                      | 'blissful'
                      | 'lovestruck'
                      | 'excited'
                      | 'ko'
                      | undefined
                  }
                  size={80}
                  color={theme.palette.primary.main}
                />
                <div>
                  <Typography variant="h6">
                    You did not add any widgets to this screen.
                  </Typography>
                  <Typography variant="body1">
                    Not to worry, you can easily do it by pressing that friendly
                    yellow button below.
                  </Typography>
                </div>
              </Styled.ScreenEmpty>
            )}
            {store
              .screenDevelopmentWidgetInstances(selectedDisplay?.id)
              .map(widgetInstance => (
                <Draggable
                  key={widgetInstance.id}
                  bounds="parent"
                  onStart={(): void => {
                    setPreventWidgetsInstancesTooltipsOpen(true);
                    setWidgetsInstancesTooltipsOpen(
                      new Map(
                        widgetsInstancesTooltipsOpen.set(
                          widgetInstance.id,
                          false,
                        ),
                      ),
                    );
                  }}
                  onStop={(_e: DraggableEvent, data: DraggableData): void => {
                    setPreventWidgetsInstancesTooltipsOpen(false);
                    updateWidgetInstancePosition({
                      widgetInstanceId: widgetInstance.id,
                      renderedScreenPosition: {
                        x: data.x,
                        y: data.y,
                      },
                      screenSize: displaySize,
                      renderedScreenSize: screenSize,
                      widgetSize: {
                        width: widgetInstance.widget.config.width,
                        height: widgetInstance.widget.config.height,
                      },
                    });
                  }}
                  defaultPosition={getWidgetInstanceDisplayCoordinates({
                    position: widgetInstance.position,
                    screenSize: displaySize,
                    renderedScreenSize: screenSize,
                  })}
                >
                  <Styled.ScreenWidgetInstance
                    style={{
                      ...getWidgetInstanceDisplaySize({
                        widgetSize: {
                          width: widgetInstance.widget.config.width,
                          height: widgetInstance.widget.config.height,
                        },
                        screenSize: displaySize,
                        renderedScreenSize: screenSize,
                      }),
                    }}
                  >
                    <Tooltip
                      title={widgetInstance.widget.config.title}
                      placement="right"
                      open={
                        widgetsInstancesTooltipsOpen.get(widgetInstance.id) ||
                        false
                      }
                      onClose={(): void => {
                        setWidgetsInstancesTooltipsOpen(
                          new Map(
                            widgetsInstancesTooltipsOpen.set(
                              widgetInstance.id,
                              false,
                            ),
                          ),
                        );
                      }}
                      onOpen={(): void => {
                        if (preventWidgetsInstancesTooltipsOpen === true) {
                          return;
                        }

                        setWidgetsInstancesTooltipsOpen(
                          new Map(
                            widgetsInstancesTooltipsOpen.set(
                              widgetInstance.id,
                              true,
                            ),
                          ),
                        );
                      }}
                    >
                      <Styled.ScreenWidgetInstanceContent />
                    </Tooltip>
                  </Styled.ScreenWidgetInstance>
                </Draggable>
              ))}
          </Styled.Screen>
        )}
      </Styled.ScreenContainer>
      <Dialog
        open={
          selectedWidgetInstanceId !== undefined &&
          manageWidgetInstanceDialogOpen
        }
        onClose={closeManageWidgetInstanceDialog}
        PaperComponent={StyledAppPaper.AppPaper}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Manage{' '}
          <Styled.ManageWidgetInstanceDialogTitle>
            {
              store.developmentWidgetsInstances.value.find(
                widgetInstance =>
                  widgetInstance.id === selectedWidgetInstanceId,
              )?.widget?.config?.title
            }
          </Styled.ManageWidgetInstanceDialogTitle>{' '}
          instance
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2"></Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="default"
            size="small"
            onClick={openDeleteWidgetInstanceDialog}
          >
            Remove from screen
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteWidgetInstanceDialogOpen}
        onClose={closeDeleteWidgetInstanceDialog}
        PaperComponent={StyledAppPaper.AppPaper}
        maxWidth="sm"
      >
        <DialogTitle>
          Are you sure you want to remove this widget instance?
        </DialogTitle>
        <DialogContent>
          Don&apos;t worry, removing it does not remove the widget completely,
          only this specific instance of it.
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="default"
            size="small"
            onClick={async (): Promise<void> => {
              setSelectedWidgetInstanceId(undefined);
              closeDeleteWidgetInstanceDialog();
              closeManageWidgetInstanceDialog();
              await apiRemoveDevelopmentWidgetInstance(
                selectedWidgetInstanceId || '',
              );
              await store.listDevelopmentWidgetsInstances({ silent: true });
            }}
          >
            Remove
          </Button>
          <Button
            variant="outlined"
            color="default"
            size="small"
            onClick={(): void => {
              closeDeleteWidgetInstanceDialog();
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Styled.Actions>
        {displays.length > 1 && (
          <Select
            value={selectedDisplay?.id}
            onChange={(event): void => {
              setSelectedDisplay(
                displays.find(display => display.id === event.target.value),
              );
            }}
          >
            {displays.map(display => (
              <MenuItem key={display.id} value={display.id}>
                Screen {display.size.width}x{display.size.height}
              </MenuItem>
            ))}
          </Select>
        )}
        <Button
          color="primary"
          variant="contained"
          onClick={openAddWidgetInstanceDialog}
          onMouseEnter={(): void => {
            setEmptyScreenKawaiiMood('excited');
          }}
          onMouseLeave={(): void => {
            setEmptyScreenKawaiiMood('happy');
          }}
        >
          Add widget to screen
        </Button>
      </Styled.Actions>
      <Dialog
        open={addWidgetInstanceDialogOpen}
        onClose={closeAddWidgetInstanceDialog}
        PaperComponent={StyledAppPaper.AppPaper}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add widget to screen</DialogTitle>
        <DialogContent>
          {store.availableWidgets.length === 0 && (
            <Styled.NoWidgetsInstalled>
              <KawaiiBrowser
                mood={
                  emptyWidgetsKawaiiMood as
                    | 'happy'
                    | 'sad'
                    | 'shocked'
                    | 'blissful'
                    | 'lovestruck'
                    | 'excited'
                    | 'ko'
                    | undefined
                }
                size={80}
                color={theme.palette.secondary.main}
              />
              <div>
                <Typography variant="h6">
                  You don&apos;t have any widgets
                </Typography>
                <Typography variant="body1">
                  Do not despair, you can start the developement of a new widget
                  in the development area.
                </Typography>
              </div>
              <Button
                color="secondary"
                variant="outlined"
                size="small"
                onClick={(): void => {
                  store.showDevelopers();
                }}
                onMouseEnter={(): void => {
                  setEmptyWidgetsKawaiiMood('excited');
                }}
                onMouseLeave={(): void => {
                  setEmptyWidgetsKawaiiMood('sad');
                }}
              >
                Go to the development area
              </Button>
            </Styled.NoWidgetsInstalled>
          )}
          <Styled.WidgetsGrid>
            {store.availableWidgets.map(developmentWidget => (
              <Widget
                cardProps={{ elevation: 0 }}
                key={developmentWidget.id}
                title={developmentWidget.config.title}
                subtitle={developmentWidget.config.subtitle}
                type={developmentWidget.config.type}
                description={developmentWidget.config.description}
                actions={
                  <Button
                    color="default"
                    variant="outlined"
                    size="small"
                    onClick={(): void => {
                      createDevelopmentWidgetInstance({
                        widgetId: developmentWidget.id,
                        displayId: selectedDisplay?.id || 0,
                      });
                    }}
                  >
                    Add this widget
                  </Button>
                }
              />
            ))}
          </Styled.WidgetsGrid>
        </DialogContent>
      </Dialog>
    </Styled.Widgets>
  );
});

export default Widgets;
