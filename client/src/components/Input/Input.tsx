import React from 'react';
import styles from './Input.module.scss';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visual size variant */
  size?: InputSize;
  /** Label text rendered above the input */
  label?: string;
  /** Optional helper text rendered below the input */
  helperText?: string;
  /** Error message — applies error styling and renders helperText in red */
  error?: string;
  /** Left icon rendered inside the input */
  leftIcon?: React.ReactNode;
  /** Right icon rendered inside the input */
  rightIcon?: React.ReactNode;
  /** Shows a spinner and disables the input */
  loading?: boolean;
  /** Full-width input */
  fullWidth?: boolean;
  /** Adds a top margin (24px) to separate from previous form fields */
  withMargin?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      loading = false,
      fullWidth = false,
      withMargin = false,
      disabled,
      className = '',
      id,
      style,
      ...rest
    },
    ref,
  ) => {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`;
    const helperId = `${inputId}-helper`;
    const isError = Boolean(error);
    const isDisabled = disabled || loading;

    return (
      <div
        className={[
          styles.wrapper,
          fullWidth ? styles.fullWidth : '',
          withMargin ? styles.withMargin : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={style}
      >
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <div
          className={[
            styles.inputWrap,
            styles[size],
            isError ? styles.error : '',
            isDisabled ? styles.disabled : '',
            loading ? styles.loading : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {leftIcon && !loading && (
            <span className={styles.leftIcon} aria-hidden="true">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={styles.input}
            disabled={isDisabled}
            aria-invalid={isError}
            aria-busy={loading}
            aria-describedby={helperText || error ? helperId : undefined}
            {...rest}
          />
          {loading ? (
            <span
              className={styles.spinner}
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="31.4 31.4"
                />
              </svg>
            </span>
          ) : (
            rightIcon && (
              <span className={styles.rightIcon} aria-hidden="true">
                {rightIcon}
              </span>
            )
          )}
        </div>
        {(helperText || error) && (
          <span
            id={helperId}
            className={isError ? styles.errorText : styles.helperText}
            role={isError ? 'alert' : undefined}
          >
            {error ?? helperText}
          </span>
        )}
        {loading && (
          <span className={styles.loadingText} role="status" aria-live="polite">
            {helperText ?? 'Loading...'}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
