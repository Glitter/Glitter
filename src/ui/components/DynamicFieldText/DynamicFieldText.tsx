import React from 'react';
import TextField from '@material-ui/core/TextField';
import * as Styled from './DynamicFieldText.css';

export interface IDynamicFieldTextInput {
  name: string;
  type: 'text';
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

const DynamicFieldText: React.FC<IDynamicFieldTextInput> = ({
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
          onBlur: () => {
            onShouldValidate && onShouldValidate(name);
          },
        }}
      />
    </Styled.DynamicField>
  );
};

export default DynamicFieldText;
