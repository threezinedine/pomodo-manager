import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from './Form';
import type { FormField } from './Form';

// ── Helpers ─────────────────────────────────────────────

const defaultFields: FormField[] = [
  { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
  { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
];

const renderForm = (props = {}) =>
  render(<Form fields={defaultFields} submitLabel="Sign in" {...props} />);

const getClassName = (props = {}) => {
  const { container } = renderForm(props);
  return (container.firstChild as Element)?.getAttribute('class') ?? '';
};

// ── Rendering ─────────────────────────────────────────────

describe('Form — Rendering', () => {
  it('renders an HTML form element', () => {
    renderForm();
    expect(document.querySelector('form')).toBeInTheDocument();
  });

  it('renders one Input per field', () => {
    renderForm();
    expect(document.querySelectorAll('form input')).toHaveLength(2);
  });

  it('renders a submit button with the given label', () => {
    renderForm({ submitLabel: 'Go!' });
    expect(screen.getByRole('button', { name: 'Go!' })).toBeInTheDocument();
  });

  it('applies the "vertical" layout class by default', () => {
    expect(getClassName()).toContain('vertical');
  });

  it('applies the "gap-md" gap class by default', () => {
    expect(getClassName()).toContain('gap-md');
  });

  it('applies fullWidth class when fullWidth={true}', () => {
    expect(getClassName({ fullWidth: true })).toContain('fullWidth');
  });
});

// ── Layout & Gap ─────────────────────────────────────────

describe('Form — Layout & Gap', () => {
  it('applies "horizontal" class when layout="horizontal"', () => {
    expect(getClassName({ layout: 'horizontal' })).toContain('horizontal');
  });

  it('applies "gap-sm" class when gap="sm"', () => {
    expect(getClassName({ gap: 'sm' })).toContain('gap-sm');
  });

  it('applies "gap-lg" class when gap="lg"', () => {
    expect(getClassName({ gap: 'lg' })).toContain('gap-lg');
  });
});

// ── Field Props ───────────────────────────────────────────

describe('Form — Field Props', () => {
  it('renders label above each field', () => {
    renderForm();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('sets input placeholder text', () => {
    renderForm();
    expect(document.querySelector('[placeholder="you@example.com"]')).toBeInTheDocument();
    expect(document.querySelector('[placeholder="••••••••"]')).toBeInTheDocument();
  });

  it('sets input type', () => {
    renderForm({ fields: [{ name: 'age', type: 'number', placeholder: '25' }] });
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('uses defaultValue when provided', () => {
    renderForm({
      fields: [
        { name: 'email', label: 'Email', placeholder: 'enter email', defaultValue: 'test@test.com' },
      ],
    });
    expect(document.querySelector<HTMLInputElement>('[placeholder="enter email"]')?.value).toBe('test@test.com');
  });

  it('disables input when disabled={true}', () => {
    renderForm({
      fields: [{ name: 'email', label: 'Email', disabled: true }],
    });
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});

// ── Validation — Required ────────────────────────────────

describe('Form — Validation: required', () => {
  it('shows error when required field is empty on submit', async () => {
    const user = userEvent.setup();
    renderForm({
      fields: [
        { name: 'email', label: 'Email', placeholder: 'you@example.com', rules: [{ type: 'required' }] },
        { name: 'password', label: 'Password', placeholder: '••••••••' },
      ],
    });
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Sign in' }));
    });
    const emailError = document.querySelector('[placeholder="you@example.com"]')?.closest('[class*="wrapper"]')?.querySelector('[class*="errorText"]');
    expect(emailError?.textContent).toBe('This field is required');
  });

  it('does not show error before submit', () => {
    renderForm({
      fields: [{ name: 'email', label: 'Email', placeholder: 'you@example.com', rules: [{ type: 'required' }] }],
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('clears error once user types in the field', async () => {
    const user = userEvent.setup();
    renderForm({
      fields: [
        { name: 'email', label: 'Email', placeholder: 'you@example.com', rules: [{ type: 'required' }] },
        { name: 'password', label: 'Password', placeholder: '••••••••', rules: [{ type: 'required' }] },
      ],
    });
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Sign in' }));
    });
    expect(screen.getAllByRole('alert')).toHaveLength(2);

    await act(async () => {
      await user.type(document.querySelector('[placeholder="you@example.com"]')!, 'a@b.com');
    });
    expect(screen.getAllByRole('alert')).toHaveLength(1);
  });

  it('accepts a custom error message for required rule', async () => {
    const user = userEvent.setup();
    renderForm({
      fields: [
        { name: 'email', label: 'Email', placeholder: 'you@example.com', rules: [{ type: 'required', message: 'Email is mandatory' }] },
        { name: 'password', label: 'Password', placeholder: '••••••••' },
      ],
    });
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Sign in' }));
    });
    const emailError = document.querySelector('[placeholder="you@example.com"]')?.closest('[class*="wrapper"]')?.querySelector('[class*="errorText"]');
    expect(emailError?.textContent).toBe('Email is mandatory');
  });
});

// ── Validation — Email ─────────────────────────────────

describe('Form — Validation: email', () => {
  it('shows error for invalid email format', async () => {
    const user = userEvent.setup();
    renderForm({
      fields: [
        { name: 'email', label: 'Email', placeholder: 'you@example.com', rules: [{ type: 'required' }, { type: 'email' }] },
        { name: 'password', label: 'Password', placeholder: '••••••••' },
      ],
    });
    await act(async () => {
      await user.type(document.querySelector('[placeholder="you@example.com"]')!, 'not-an-email');
      await user.click(screen.getByRole('button', { name: 'Sign in' }));
    });
    const emailError = document.querySelector('[placeholder="you@example.com"]')?.closest('[class*="wrapper"]')?.querySelector('[class*="errorText"]');
    expect(emailError?.textContent).toBe('Please enter a valid email address');
  });

  it('accepts a valid email', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderForm({
      fields: [
        { name: 'email', label: 'Email', placeholder: 'you@example.com', rules: [{ type: 'required' }, { type: 'email' }] },
        { name: 'password', label: 'Password', placeholder: '••••••••' },
      ],
      onSubmit,
    });
    await act(async () => {
      await user.type(document.querySelector('[placeholder="you@example.com"]')!, 'a@b.com');
      await user.type(document.querySelector('[placeholder="••••••••"]')!, 'password123');
      await user.click(screen.getByRole('button', { name: 'Sign in' }));
    });
    expect(onSubmit).toHaveBeenCalledWith({ email: 'a@b.com', password: 'password123' });
  });
});

// ── Validation — minLength / maxLength ─────────────────

describe('Form — Validation: minLength / maxLength', () => {
  it('shows error when value is shorter than minLength', async () => {
    const user = userEvent.setup();
    renderForm({
      fields: [
        { name: 'password', label: 'Password', placeholder: '••••••••', rules: [{ type: 'minLength', value: 8 }] },
        { name: 'email', label: 'Email', placeholder: 'you@example.com' },
      ],
    });
    await act(async () => {
      await user.type(document.querySelector('[placeholder="••••••••"]')!, 'abc');
      await user.click(screen.getByRole('button', { name: 'Sign in' }));
    });
    const pwError = document.querySelector('[placeholder="••••••••"]')?.closest('[class*="wrapper"]')?.querySelector('[class*="errorText"]');
    expect(pwError?.textContent).toBe('Value is too short (min 8)');
  });

  it('accepts value within maxLength', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderForm({
      fields: [{ name: 'username', label: 'Username', placeholder: 'janedoe', rules: [{ type: 'maxLength', value: 10 }] }],
      onSubmit,
    });
    await act(async () => {
      await user.type(screen.getByRole('textbox'), 'janedoe');
      await user.click(screen.getByRole('button', { name: 'Sign in' }));
    });
    expect(onSubmit).toHaveBeenCalledWith({ username: 'janedoe' });
  });
});

// ── Validation — min / max ─────────────────────────────

describe('Form — Validation: min / max', () => {
  it('shows error when number is below min', async () => {
    const user = userEvent.setup();
    renderForm({
      fields: [{ name: 'age', label: 'Age', type: 'number', placeholder: '18', rules: [{ type: 'min', value: 18 }] }],
    });
    await act(async () => {
      await user.type(screen.getByRole('spinbutton'), '10');
      await user.click(screen.getByRole('button', { name: 'Sign in' }));
    });
    expect(screen.getByText('Value is too low (min 18)')).toBeInTheDocument();
  });

  it('shows error when number exceeds max', async () => {
    const user = userEvent.setup();
    renderForm({
      fields: [{ name: 'quantity', label: 'Quantity', type: 'number', placeholder: '0', rules: [{ type: 'max', value: 100 }] }],
    });
    await act(async () => {
      await user.type(screen.getByRole('spinbutton'), '200');
      await user.click(screen.getByRole('button', { name: 'Sign in' }));
    });
    expect(screen.getByText('Value is too high (max 100)')).toBeInTheDocument();
  });
});

// ── Validation — pattern ───────────────────────────────

describe('Form — Validation: pattern', () => {
  it('shows error when value does not match pattern', async () => {
    const user = userEvent.setup();
    renderForm({
      fields: [{ name: 'username', label: 'Username', placeholder: 'username', rules: [{ type: 'pattern', value: /^[a-z_]+$/ }] }],
    });
    await act(async () => {
      await user.type(screen.getByRole('textbox'), 'User123');
      await user.click(screen.getByRole('button', { name: 'Sign in' }));
    });
    expect(screen.getByText('Invalid format')).toBeInTheDocument();
  });

  it('accepts value matching pattern', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderForm({
      fields: [{ name: 'username', label: 'Username', placeholder: 'username', rules: [{ type: 'pattern', value: /^[a-z_]+$/ }] }],
      onSubmit,
    });
    await act(async () => {
      await user.type(screen.getByRole('textbox'), 'jane_doe');
      await user.click(screen.getByRole('button', { name: 'Sign in' }));
    });
    expect(onSubmit).toHaveBeenCalledWith({ username: 'jane_doe' });
  });
});

// ── Validation — custom ────────────────────────────────

describe('Form — Validation: custom', () => {
  it('calls the custom validator function', async () => {
    const user = userEvent.setup();
    renderForm({
      fields: [
        {
          name: 'username',
          label: 'Username',
          placeholder: 'username',
          rules: [
            {
              type: 'custom',
              validate: (value) => (value === 'admin' ? 'Username is taken' : null),
            },
          ],
        },
      ],
    });
    await act(async () => {
      await user.type(screen.getByRole('textbox'), 'admin');
      await user.click(screen.getByRole('button', { name: 'Sign in' }));
    });
    expect(screen.getByText('Username is taken')).toBeInTheDocument();
  });
});

// ── Submission ─────────────────────────────────────────

describe('Form — Submission', () => {
  it('calls onSubmit with all field values on valid submission', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderForm({ onSubmit });
    await act(async () => {
      await user.type(document.querySelector('[placeholder="you@example.com"]')!, 'a@b.com');
      await user.type(document.querySelector('[placeholder="••••••••"]')!, 'password123');
      await user.click(screen.getByRole('button', { name: 'Sign in' }));
    });
    expect(onSubmit).toHaveBeenCalledWith({ email: 'a@b.com', password: 'password123' });
  });

  it('does not call onSubmit when there are validation errors', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderForm({
      fields: [{ name: 'email', label: 'Email', placeholder: 'you@example.com', rules: [{ type: 'required' }] }],
      onSubmit,
    });
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Sign in' }));
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('prevents browser default form submission', async () => {
    const user = userEvent.setup();
    renderForm({ fields: [{ name: 'test', label: 'Test', placeholder: 'test' }] });
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Sign in' }));
    });
    expect(document.querySelector('form')).toBeInTheDocument();
  });

  it('forwards ref to the native <form>', () => {
    const ref = { current: null } as React.RefObject<HTMLFormElement>;
    renderForm({ ref });
    expect(ref.current).toBeInstanceOf(HTMLFormElement);
  });
});

// ── Loading ─────────────────────────────────────────────

describe('Form — Loading', () => {
  it('disables and shows loading state on a specific field', () => {
    renderForm({
      fields: [
        { name: 'email', label: 'Email', loading: true },
        { name: 'password', label: 'Password' },
      ],
    });
    const inputs = document.querySelectorAll('form input');
    expect(inputs[0]).toBeDisabled();
    expect(inputs[1]).not.toBeDisabled();
  });
});
