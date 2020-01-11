import React from 'react';
import * as Styled from './DynamicForm.css';
import DynamicFieldText, {
  IDynamicFieldTextInput,
} from '@ui/components/DynamicFieldText/DynamicFieldText';

interface IProps {
  fields: IDynamicFieldTextInput[];
  state: any;
  onChange: ({ state, name }: { state: any; name: string }) => void;
  onSubmit?: (state: any) => void;
  onShouldValidate?: (name: string) => void;
}

interface IRenderFieldInput {
  field: IDynamicFieldTextInput;
  state: any;
}

const getValue = ({ state, name }: { state: any; name: string }) => {
  if (typeof state[name] !== undefined) {
    return state[name];
  }

  return undefined;
};

const renderField = ({
  field,
  state,
  onChange,
  onShouldValidate,
}: IRenderFieldInput & {
  onChange: (value: any) => void;
  onShouldValidate: (name: string) => void;
}) => {
  switch (field.type) {
    case 'text':
      return (
        <DynamicFieldText
          {...field}
          value={getValue({ state, name: field.name })}
          onChange={event => {
            onChange(event.target.value);
          }}
          onShouldValidate={onShouldValidate}
        />
      );
    default:
      return null;
  }
};

const DynamicForm: React.FC<IProps> = ({
  fields,
  state,
  onChange,
  onSubmit,
  onShouldValidate,
}) => {
  return (
    <Styled.DynamicForm
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit && onSubmit(state);
      }}
    >
      {fields.map(field => (
        <Styled.Field key={field.name}>
          {renderField({
            field,
            state,
            onChange: value => {
              onChange({
                state: {
                  ...state,
                  [field.name]: value,
                },
                name: field.name,
              });
            },
            onShouldValidate: name => {
              onShouldValidate && onShouldValidate(name);
            },
          })}
        </Styled.Field>
      ))}
    </Styled.DynamicForm>
  );
};

export default DynamicForm;
