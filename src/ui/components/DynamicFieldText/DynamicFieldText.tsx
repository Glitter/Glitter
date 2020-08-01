import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import * as Styled from './DynamicFieldText.css';

export interface DynamicFieldTextInterface {
  name: string;
  type: string;
  label: string;
  description?: string;
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
  size?: 'small' | 'medium' | 'large';
  required?: boolean;

  // Not part of the field interface
  value?: string;
  error?: string;
  onShouldValidate?: (name: string) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
  size = 'large',
}) => {
  const sizeToWidthMap = {
    small: '100px',
    medium: '200px',
    large: '100%',
  };

  return (
    <Styled.DynamicField>
      <TextField
        color="secondary"
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
        inputProps={{
          onBlur: (): void => {
            onShouldValidate && onShouldValidate(name);
          },
        }}
        fullWidth
        style={{
          maxWidth: sizeToWidthMap[size],
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
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default DynamicFieldText;
