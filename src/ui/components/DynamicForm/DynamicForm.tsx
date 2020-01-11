import React from 'react';
import PropTypes from 'prop-types';
import * as Styled from './DynamicForm.css';
import DynamicFieldText, {
  DynamicFieldTextInterface,
} from '@ui/components/DynamicFieldText/DynamicFieldText';

type StateType = any; // eslint-disable-line @typescript-eslint/no-explicit-any

interface DynamicFormInterface {
  fields: DynamicFieldTextInterface[];
  state: StateType;
  onChange: ({ state, name }: { state: StateType; name: string }) => void;
  onSubmit?: (state: StateType) => void;
  onShouldValidate?: (name: string) => void;
}

interface RenderFieldInterface {
  field: DynamicFieldTextInterface;
  state: StateType;
}

const getValue = ({
  state,
  name,
}: {
  state: StateType;
  name: string;
}): Partial<StateType> | undefined => {
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
}: RenderFieldInterface & {
  onChange: (value: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  onShouldValidate: (name: string) => void;
}): JSX.Element | null => {
  switch (field.type) {
    case 'text':
      let value = getValue({ state, name: field.name });

      if (typeof value !== 'string') {
        value = new String(value);
      }

      return (
        <DynamicFieldText
          {...field}
          value={(value as unknown) as string}
          onChange={(event): void => {
            onChange(event.target.value);
          }}
          onShouldValidate={onShouldValidate}
        />
      );
    default:
      return null;
  }
};

const DynamicForm: React.FC<DynamicFormInterface> = ({
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

DynamicForm.propTypes = {
  fields: PropTypes.array.isRequired,
  state: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  onShouldValidate: PropTypes.func,
};

export default DynamicForm;
