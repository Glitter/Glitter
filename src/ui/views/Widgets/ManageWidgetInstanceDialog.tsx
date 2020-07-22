import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DynamicForm from '@ui/components/DynamicForm/DynamicForm';
import { useStore } from '@ui/store/hooks';
import omit from '@utils/omit';
import * as StyledAppPaper from '@ui/components/AppPaper/AppPaper.css';
import * as Styled from './ManageWidgetInstanceDialog.css';

interface ManageWidgetInstanceDialogInterface {
  open: boolean;
  onClose: () => void;
  onExited: () => void;
  onSave: (configuration: { [key: string]: string | number }) => void;
  selectedWidgetInstanceId?: string;
}

const ManageWidgetInstanceDialog: React.FC<ManageWidgetInstanceDialogInterface> = observer(
  ({ open, onClose, onSave, selectedWidgetInstanceId, onExited }) => {
    const store = useStore();
    const selectedWidgetInstance = useMemo(() => {
      return store.developmentWidgetsInstances.value.find(
        (widgetInstance) => widgetInstance.id === selectedWidgetInstanceId,
      );
    }, [selectedWidgetInstanceId]);

    const widgetHasSettings =
      selectedWidgetInstance?.widget?.config.settings.length !== 0;

    const [validation, setValidation] = useState<{ [key: string]: string }>({});
    const getNormalizedWidgetInstanceConfiguration = (): {
      [key: string]: string | number;
    } => {
      return (
        selectedWidgetInstance?.settings.reduce((acc, cur) => {
          return {
            ...acc,
            [cur.name]: cur.value,
          };
        }, {}) || {}
      );
    };

    const [
      widgetInstanceConfiguration,
      setWidgetInstanceConfiguration,
    ] = useState<{ [key: string]: string | number }>(
      getNormalizedWidgetInstanceConfiguration(),
    );
    const validateField = (fieldName: string): boolean => {
      const field = selectedWidgetInstance?.widget?.config.settings.find(
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

      selectedWidgetInstance?.widget?.config.settings.forEach(
        (widgetConfigurationField) => {
          const fieldIsValid = validateField(widgetConfigurationField.name);

          if (fieldIsValid === false) {
            configurationIsValid = false;
          }
        },
      );

      return configurationIsValid;
    };
    const clearValidation = (name: string): void => {
      if (typeof validation[name] === undefined) {
        return;
      }

      setValidation(omit(validation, name));
    };

    if (selectedWidgetInstance === undefined) {
      return null;
    }

    return (
      <Dialog
        open={open}
        onClose={onClose}
        onExited={(): void => {
          setValidation({});
          setWidgetInstanceConfiguration(
            getNormalizedWidgetInstanceConfiguration(),
          );
          onExited();
        }}
        PaperComponent={StyledAppPaper.AppPaper}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Manage{' '}
          <Styled.ManageWidgetInstanceDialogTitle>
            {selectedWidgetInstance.widget.config.title}
          </Styled.ManageWidgetInstanceDialogTitle>{' '}
          instance
        </DialogTitle>
        <DialogContent>
          {widgetHasSettings === false && (
            <Typography variant="body2">
              It looks like this widget does not have any configuration options.
            </Typography>
          )}

          {widgetHasSettings === true && (
            <DynamicForm
              fields={selectedWidgetInstance.widget.config.settings.map(
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
                setWidgetInstanceConfiguration(newWidgetInstanceConfiguration);
                clearValidation(fieldName);
              }}
              onShouldValidate={(fieldName): void => {
                validateField(fieldName);
              }}
            />
          )}
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

              onSave(widgetInstanceConfiguration);
            }}
            startIcon={
              <FontAwesomeIcon
                icon={['fad', 'save']}
                style={{
                  fontSize: '1em',
                }}
              />
            }
          >
            Save
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
      </Dialog>
    );
  },
);

ManageWidgetInstanceDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onExited: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  selectedWidgetInstanceId: PropTypes.string,
};

export default ManageWidgetInstanceDialog;
