import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Form } from './Form';

// ── Meta ───────────────────────────────────────────────────

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A managed form component with built-in validation. Pass field definitions via the `fields` prop — the form handles all state, errors, and submission internally.',
      },
    },
  },
  argTypes: {
    layout: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Direction of form fields',
      table: {
        defaultValue: { summary: 'vertical' },
        type: { summary: 'vertical | horizontal' },
      },
    },
    gap: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Gap between form fields',
      table: {
        defaultValue: { summary: 'md' },
        type: { summary: 'sm | md | lg' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Makes the form and its fields span full container width',
      table: { defaultValue: { summary: 'false' } },
    },
    submitLabel: {
      control: 'text',
      description: 'Label for the submit button',
      table: { defaultValue: { summary: 'Submit' } },
    },
    onSubmit: { action: 'submitted' },
  },
  args: {
    onSubmit: fn(),
    submitLabel: 'Submit',
  },
};

export default meta;
type Story = StoryObj<typeof Form>;

// ── Helpers ────────────────────────────────────────────────

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

// ── Stories ───────────────────────────────────────────────

/** Basic login form — two fields with required validation and a submit button. */
export const Login: Story = {
  args: {
    fields: [
      { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
      { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
    ],
    submitLabel: 'Sign in',
  },
};

/** Registration form with multiple fields and required + email validation. */
export const Register: Story = {
  args: {
    fields: [
      { name: 'name', label: 'Full name', placeholder: 'Jane Doe' },
      {
        name: 'email',
        label: 'Email address',
        type: 'email',
        placeholder: 'you@example.com',
        rules: [{ type: 'required' }, { type: 'email' }],
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Min. 8 characters',
        rules: [{ type: 'required' }, { type: 'minLength', value: 8 }],
      },
      {
        name: 'confirm',
        label: 'Confirm password',
        type: 'password',
        placeholder: 'Repeat password',
        rules: [{ type: 'required' }],
      },
    ],
    submitLabel: 'Create account',
  },
};

// ── Layout ────────────────────────────────────────────────

/** Horizontal layout — fields and button align in a row. Good for search bars or compact forms. */
export const HorizontalLayout: Story = {
  args: {
    layout: 'horizontal',
    gap: 'sm',
    fields: [{ name: 'search', label: 'Search', placeholder: 'Search tasks...', leftIcon: <SearchIcon /> }],
    submitLabel: 'Search',
  },
};

// ── Gap Variants ───────────────────────────────────────────

/** Small gap — tight spacing between fields. */
export const SmallGap: Story = {
  args: {
    gap: 'sm',
    fields: [
      { name: 'username', label: 'Username', placeholder: 'jane_doe', rules: [{ type: 'required' }] },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', rules: [{ type: 'required' }, { type: 'email' }] },
      { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••', rules: [{ type: 'required' }] },
    ],
    submitLabel: 'Sign up',
  },
};

/** Large gap — generous spacing between fields. */
export const LargeGap: Story = {
  args: {
    gap: 'lg',
    fields: [
      { name: 'task', label: 'Task name', placeholder: 'Design new landing page' },
      { name: 'description', label: 'Description', placeholder: 'Describe the task...' },
    ],
    submitLabel: 'Create task',
  },
};

// ── Full Width ─────────────────────────────────────────────

/** Full-width form — all fields and the button stretch to 100% of the container. */
export const FullWidth: Story = {
  args: {
    fullWidth: true,
    fields: [
      { name: 'email', label: 'Full name', placeholder: 'Jane Doe' },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
    ],
    submitLabel: 'Sign up',
  },
};

// ── With Validation Errors ────────────────────────────────

/** Form displaying field-level validation errors after submission. */
export const WithErrors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Errors only appear after the user attempts to submit. They clear automatically as the user corrects each field.',
      },
    },
  },
  args: {
    fields: [
      {
        name: 'email',
        label: 'Email address',
        type: 'email',
        placeholder: 'you@example.com',
        defaultValue: 'not-an-email',
        rules: [{ type: 'required' }, { type: 'email', message: 'Please enter a valid email address.' }],
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: '••••••••',
        defaultValue: '123',
        rules: [{ type: 'required' }, { type: 'minLength', value: 8, message: 'Password must be at least 8 characters.' }],
      },
    ],
    submitLabel: 'Sign in',
  },
};

// ── Loading Field ─────────────────────────────────────────

/** Form with a field in loading state (e.g., email availability check). */
export const WithLoadingField: Story = {
  args: {
    fields: [
      {
        name: 'email',
        label: 'Email address',
        type: 'email',
        placeholder: 'you@example.com',
        loading: true,
        helperText: 'Checking email availability...',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: '••••••••',
        rules: [{ type: 'required' }],
      },
    ],
    submitLabel: 'Sign up',
  },
};

// ── Disabled Fields ───────────────────────────────────────

/** Form with some fields disabled. */
export const WithDisabledFields: Story = {
  args: {
    fields: [
      { name: 'username', label: 'Username', placeholder: 'jane_doe', defaultValue: 'jane_doe', disabled: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', rules: [{ type: 'required' }] },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: '••••••••',
        rules: [{ type: 'required' }, { type: 'minLength', value: 8 }],
      },
    ],
    submitLabel: 'Update profile',
  },
};

// ── All Variants ───────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '400px' }}>
      <Form
        fields={[
          { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
          { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
        ]}
        submitLabel="Sign in"
      />

      <Form
        gap="lg"
        fields={[
          { name: 'task', label: 'Task name', placeholder: 'Design new landing page' },
          { name: 'description', label: 'Description', placeholder: 'Describe the task...' },
        ]}
        submitLabel="Create task"
      />

      <div style={{ width: '400px' }}>
        <Form
          fullWidth
          fields={[
            { name: 'fullname', label: 'Full name', placeholder: 'Jane Doe' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
          ]}
          submitLabel="Sign up"
        />
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'Vertical, large gap, and full-width variants side-by-side.' },
    },
  },
};
