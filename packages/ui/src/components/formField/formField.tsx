import { Field, FieldLabel, FieldError } from '@repo/ui';
import { FormFieldProps } from './formField.helpers';

export const FormField = ({
  label,
  required,
  htmlFor,
  error,
  children,
}: FormFieldProps) => {
  return (
    <Field>
      <FieldLabel className="text-primary" htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="text-destructive" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </FieldLabel>
      {children}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
};

FormField.displayName = 'FormField';
