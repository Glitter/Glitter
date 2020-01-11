import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import * as Styled from './DynamicFieldText.css';

export interface DynamicFieldTextInterface {
  name: string;
  type: string;
  value?: string;
  label: string;
  description?: string;
  error?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  multiline?: boolean;
  inputType?:
    | 'text'
    | 'number'
    | 'email'
    | 'tel'
    | 'color'
    | 'date'
    | 'password'
    | 'time'
    | 'url';
  onShouldValidate?: (name: string) => void;
}

const DynamicFieldText: React.FC<DynamicFieldTextInterface> = ({
  name,
  label,
  description,
  value = '',
  onChange,
  error,
  multiline = false,
  inputType = 'text',
  onShouldValidate,
}) => {
  return (
    <Styled.DynamicField>
      <TextField
        label={label}
        helperText={error ? error : description}
        name={name}
        variant="outlined"
        value={value}
        onChange={onChange}
        error={error ? true : false}
        multiline={multiline}
        type={inputType}
        size="small"
        fullWidth
        inputProps={{
          onBlur: (): void => {
            onShouldValidate && onShouldValidate(name);
          },
        }}
      />
    </Styled.DynamicField>
  );
};

DynamicFieldText.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func,
  multiline: PropTypes.bool,
  inputType: PropTypes.oneOf([
    'text',
    'number',
    'email',
    'tel',
    'color',
    'date',
    'password',
    'time',
    'url',
  ]),
  onShouldValidate: PropTypes.func,
};

export default DynamicFieldText;
