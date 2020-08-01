import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Browser as KawaiiBrowser } from 'react-kawaii';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DynamicForm from '@ui/components/DynamicForm/DynamicForm';
import Widget from '@ui/components/Widget/Widget';
import theme from '@ui/css/theme';
import { DevelopmentWidget } from '@ui/store';
import { useStore } from '@ui/store/hooks';
import omit from '@utils/omit';
import * as StyledAppPaper from '@ui/components/AppPaper/AppPaper.css';
import * as Styled from './AddWidgetInstanceDialog.css';

interface AddWidgetInstanceDialogInterface {
  open: boolean;
  onClose: () => void;
  onCreateDevelopmentWidgetInstance: ({
    developmentWidget,
    settings,
  }: {
    developmentWidget: typeof DevelopmentWidget.Type;
    settings: { [key: string]: string | number };
  }) => void;
}

const STEPS = {
  CHOOSE_WIDGET: 'chooseWidget',
  CONFIGURE_WIDGET: 'configureWidget',
};

const AddWidgetInstanceDialog: React.FC<AddWidgetInstanceDialogInterface> = observer(
  ({ open, onClose, onCreateDevelopmentWidgetInstance }) => {
    const store = useStore();

    // Empty widgets dialog
    const [emptyWidgetsKawaiiMood, setEmptyWidgetsKawaiiMood] = useState(
      'happy',
    );

    const [step, setStep] = useState(STEPS.CHOOSE_WIDGET);
    const [selectedWidgetId, setSelectedWidgetId] = useState<
      string | undefined
    >(undefined);
    const selectedWidget = useMemo(() => {
      return store.developmentWidgets.value.find(
        (widget) => widget.id === selectedWidgetId,
      );
    }, [selectedWidgetId]);

    const [validation, setValidation] = useState<{ [key: string]: string }>({});

    const [
      widgetInstanceConfiguration,
      setWidgetInstanceConfiguration,
    ] = useState<{ [key: string]: string | number }>({});
    const validateField = (fieldName: string): boolean => {
      const field = selectedWidget?.config.settings.find(
        (settingsField) => settingsField.name === fieldName,
      );

      if (field === undefined) {
        return true;
      }

      if (field.required === true) {
        if (
          widgetInstanceConfiguration[fieldName] === undefined ||
          widgetInstanceConfiguration[fieldName] === ''
        ) {
          setValidation((currentValidation) => ({
            ...currentValidation,
            [fieldName]: 'This field is required',
          }));
          return false;
        }
      }

      return true;
    };
    const validateConfiguration = (): boolean => {
      let configurationIsValid = true;

      selectedWidget?.config.settings.forEach((widgetConfigurationField) => {
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

    return (
      <Dialog
        open={open}
        onClose={onClose}
        onExited={(): void => {
          setStep(STEPS.CHOOSE_WIDGET);
          setSelectedWidgetId(undefined);
        }}
        PaperComponent={StyledAppPaper.AppPaper}
        maxWidth={step === STEPS.CHOOSE_WIDGET ? 'md' : 'sm'}
        fullWidth
      >
        {step === STEPS.CHOOSE_WIDGET && (
          <>
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
                      Do not despair, you can start the developement of a new
                      widget in the development area.
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
                {store.availableWidgets.map((developmentWidget) => (
                  <Widget
                    cardProps={{ elevation: 1 }}
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
                        onClick={async (): Promise<void> => {
                          if (developmentWidget.config.settings.length === 0) {
                            // This development widget has no settings, add an
                            // instance immediately
                            onCreateDevelopmentWidgetInstance({
                              developmentWidget,
                              settings: {},
                            });
                            return;
                          }

                          setSelectedWidgetId(developmentWidget.id);
                          setStep(STEPS.CONFIGURE_WIDGET);
                        }}
                      >
                        Add this widget
                      </Button>
                    }
                  />
                ))}
              </Styled.WidgetsGrid>
            </DialogContent>
          </>
        )}

        {step === STEPS.CONFIGURE_WIDGET && selectedWidget !== undefined && (
          <>
            <DialogTitle>
              Configure{' '}
              <Styled.ConfigureWidgetInstanceDialogTitle>
                {selectedWidget.config.title}
              </Styled.ConfigureWidgetInstanceDialogTitle>{' '}
              instance
            </DialogTitle>
            <DialogContent>
              <DynamicForm
                fields={selectedWidget.config.settings.map(
                  (widgetConfigurationField) => ({
                    ...widgetConfigurationField,
                    error:
                      typeof validation[widgetConfigurationField.name] ===
                      undefined
                        ? undefined
                        : validation[widgetConfigurationField.name],
                  }),
                )}
                state={widgetInstanceConfiguration}
                onChange={({
                  state: newWidgetInstanceConfiguration,
                  name: fieldName,
                }): void => {
                  setWidgetInstanceConfiguration(
                    newWidgetInstanceConfiguration,
                  );
                  clearValidation(fieldName);
                }}
                onShouldValidate={(fieldName): void => {
                  validateField(fieldName);
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                color="default"
                size="small"
                onClick={(): void => {
                  const isValid = validateConfiguration();

                  if (isValid === false) {
                    return;
                  }

                  onCreateDevelopmentWidgetInstance({
                    developmentWidget: selectedWidget,
                    settings: widgetInstanceConfiguration,
                  });
                }}
                startIcon={
                  <FontAwesomeIcon
                    icon={['fas', 'plus-square']}
                    style={{
                      fontSize: '1em',
                    }}
                  />
                }
              >
                Add to screen
              </Button>
              <Button
                variant="outlined"
                color="default"
                size="small"
                onClick={onClose}
              >
                Cancel
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    );
  },
);

AddWidgetInstanceDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateDevelopmentWidgetInstance: PropTypes.func.isRequired,
};

export default AddWidgetInstanceDialog;
