import React, { useState, useCallback } from 'react';
import styles from './Form.module.scss';
import { Input } from '../Input';
import { Button } from '../Button';

// ── Field Types ────────────────────────────────────────────

export type ValidationRule =
  | { type: 'required'; message?: string }
  | { type: 'email'; message?: string }
  | { type: 'minLength'; value: number; message?: string }
  | { type: 'maxLength'; value: number; message?: string }
  | { type: 'min'; value: number; message?: string }
  | { type: 'max'; value: number; message?: string }
  | { type: 'pattern'; value: RegExp; message?: string }
  | { type: 'custom'; validate: (value: string) => string | null; message?: string };

export interface FormField {
  /** Unique name for the field — also used as the key in submitted data */
  name: string;
  /** Label shown above the input */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Input type (defaults to 'text') */
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  /** Validation rules applied on submit and on blur */
  rules?: ValidationRule[];
  /** Default value */
  defaultValue?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Show a loading spinner and disable the field */
  loading?: boolean;
  /** Left icon element */
  leftIcon?: React.ReactNode;
  /** Right icon element */
  rightIcon?: React.ReactNode;
  /** Helper text shown below the field */
  helperText?: string;
}

// ── Form Props ──────────────────────────────────────────────

export interface FormProps {
  /** Declarative list of form fields */
  fields: FormField[];
  /** Layout direction */
  layout?: 'vertical' | 'horizontal';
  /** Gap between fields */
  gap?: 'sm' | 'md' | 'lg';
  /** Full-width form */
  fullWidth?: boolean;
  /** Label for the submit button */
  submitLabel?: string;
  /** Called with the field values on valid submission: `onSubmit({ email: '...', password: '...' })` */
  onSubmit?: (values: Record<string, string>) => void;
  /** Additional class for the submit button */
  submitClassName?: string;
  /** Additional class for the form wrapper */
  className?: string;
}

// ── Internal Types ──────────────────────────────────────────

type Errors = Record<string, string>;
type Touched = Record<string, boolean>;

// ── Validation ──────────────────────────────────────────────

const defaultMessages: Record<ValidationRule['type'], string> = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minLength: 'Value is too short',
  maxLength: 'Value is too long',
  min: 'Value is too low',
  max: 'Value is too high',
  pattern: 'Invalid format',
  custom: 'Invalid value',
};

function validateField(value: string, rules: ValidationRule[]): string {
  for (const rule of rules) {
    let error: string | null = null;

    switch (rule.type) {
      case 'required':
        if (!value || value.trim() === '') {
          error = rule.message ?? defaultMessages.required;
        }
        break;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = rule.message ?? defaultMessages.email;
        }
        break;
      case 'minLength':
        if (value && value.length < rule.value) {
          error = rule.message ?? `${defaultMessages.minLength} (min ${rule.value})`;
        }
        break;
      case 'maxLength':
        if (value && value.length > rule.value) {
          error = rule.message ?? `${defaultMessages.maxLength} (max ${rule.value})`;
        }
        break;
      case 'min':
        if (value && Number(value) < rule.value) {
          error = rule.message ?? `${defaultMessages.min} (min ${rule.value})`;
        }
        break;
      case 'max':
        if (value && Number(value) > rule.value) {
          error = rule.message ?? `${defaultMessages.max} (max ${rule.value})`;
        }
        break;
      case 'pattern':
        if (value && !rule.value.test(value)) {
          error = rule.message ?? defaultMessages.pattern;
        }
        break;
      case 'custom':
        error = rule.validate(value);
        if (error && rule.message) error = rule.message;
        break;
    }

    if (error) return error;
  }

  return '';
}

// ── Component ───────────────────────────────────────────────

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  (
    {
      fields,
      layout = 'vertical',
      gap = 'md',
      fullWidth = false,
      submitLabel = 'Submit',
      onSubmit,
      submitClassName = '',
      className = '',
    },
    ref,
  ) => {
    const initialValues = fields.reduce<Record<string, string>>((acc, field) => {
      acc[field.name] = field.defaultValue ?? '';
      return acc;
    }, {});

    const [values, setValues] = useState<Record<string, string>>(initialValues);
    const [errors, setErrors] = useState<Errors>({});
    const [touched, setTouched] = useState<Touched>({});

    const validateAll = useCallback(
      (fieldNames?: string[]) => {
        const targets = fieldNames ?? fields.map((f) => f.name);
        const newErrors: Errors = {};

        for (const field of fields) {
          if (!targets.includes(field.name)) continue;
          const value = values[field.name] ?? '';
          if (field.rules && field.rules.length > 0) {
            newErrors[field.name] = validateField(value, field.rules);
          } else {
            newErrors[field.name] = '';
          }
        }

        setErrors((prev) => ({ ...prev, ...newErrors }));
        return Object.values(newErrors).every((e) => e === '');
      },
      [fields, values],
    );

    const handleChange = useCallback(
      (name: string, value: string) => {
        setValues((prev) => ({ ...prev, [name]: value }));
        // Live validation: if field was touched, re-validate it on change
        if (touched[name] && fields.find((f) => f.name === name)?.rules?.length) {
          const field = fields.find((f) => f.name === name)!;
          const error = validateField(value, field.rules);
          setErrors((prev) => ({ ...prev, [name]: error }));
        }
      },
      [touched, fields],
    );

    const handleBlur = useCallback(
      (name: string) => {
        setTouched((prev) => ({ ...prev, [name]: true }));
        const field = fields.find((f) => f.name === name);
        if (field?.rules && field.rules.length > 0) {
          const error = validateField(values[name] ?? '', field.rules);
          setErrors((prev) => ({ ...prev, [name]: error }));
        }
      },
      [fields, values],
    );

    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        // Mark all fields as touched
        const allTouched = fields.reduce<Touched>((acc, f) => {
          acc[f.name] = true;
          return acc;
        }, {});
        setTouched(allTouched);

        const isValid = validateAll();

        if (isValid && onSubmit) {
          onSubmit(values);
        }
      },
      [fields, validateAll, onSubmit, values],
    );

    return (
      <form
        ref={ref}
        className={[styles.form, styles[layout], styles[`gap-${gap}`], fullWidth ? styles.fullWidth : '', className]
          .filter(Boolean)
          .join(' ')}
        onSubmit={handleSubmit}
        noValidate
      >
        {fields.map((field) => (
          <Input
            key={field.name}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            type={field.type ?? 'text'}
            value={values[field.name] ?? ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onBlur={() => handleBlur(field.name)}
            error={touched[field.name] ? errors[field.name] : ''}
            disabled={field.disabled}
            loading={field.loading}
            leftIcon={field.leftIcon}
            rightIcon={field.rightIcon}
            helperText={field.helperText}
          />
        ))}
        <Button type="submit" className={submitClassName}>
          {submitLabel}
        </Button>
      </form>
    );
  },
);

Form.displayName = 'Form';

export default Form;
