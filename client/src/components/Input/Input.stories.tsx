import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Input } from './Input';

// ── Meta ───────────────────────────────────────────────────

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A flexible text input component with label, helper text, error state, icons, and multiple sizes.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Input size variant',
      table: {
        defaultValue: { summary: 'md' },
        type: { summary: 'sm | md | lg' },
      },
    },
    label: {
      control: 'text',
      description: 'Label text rendered above the input',
    },
    helperText: {
      control: 'text',
      description: 'Optional helper text below the input',
    },
    error: {
      control: 'text',
      description: 'Error message — applies error styling',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input',
      table: { defaultValue: { summary: 'false' } },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Makes the input span full container width',
      table: { defaultValue: { summary: 'false' } },
    },
    withMargin: {
      control: 'boolean',
      description: 'Adds a top margin to separate from previous form fields',
      table: { defaultValue: { summary: 'false' } },
    },
    loading: {
      control: 'boolean',
      description: 'Shows spinner and disables the input',
      table: { defaultValue: { summary: 'false' } },
    },
    onChange: { action: 'changed' },
    onFocus: { action: 'focused' },
    onBlur: { action: 'blurred' },
  },
  args: {
    onChange: fn(),
    onFocus: fn(),
    onBlur: fn(),
    placeholder: 'Type something...',
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// ── Stories ───────────────────────────────────────────────

/** Basic text input with a label and placeholder. */
export const Default: Story = {
  args: {
    label: 'Full name',
    placeholder: 'Jane Doe',
  },
};

// ── Sizes ─────────────────────────────────────────────────

/** Three sizes: `sm`, `md`, and `lg`. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '320px' }}>
      <Input size="sm" label="Small" placeholder="Small input" />
      <Input size="md" label="Medium" placeholder="Medium input" />
      <Input size="lg" label="Large" placeholder="Large input" />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'Three available sizes: `sm`, `md`, and `lg`.' },
    },
  },
};

// ── States ────────────────────────────────────────────────

export const WithHelperText: Story = {
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    helperText: "We'll never share your email with anyone.",
  },
};

export const WithError: Story = {
  args: {
    label: 'Password',
    type: 'password',
    defaultValue: 'short',
    error: 'Password must be at least 8 characters.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled field',
    defaultValue: 'Cannot edit this',
    disabled: true,
  },
};

// ── With Icons ────────────────────────────────────────────

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const AtIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="4" />
    <path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-4 8" />
  </svg>
);

export const WithLeftIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search tasks...',
    leftIcon: <SearchIcon />,
  },
};

export const WithRightIcon: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    rightIcon: <EyeIcon />,
  },
};

export const WithBothIcons: Story = {
  args: {
    label: 'Username',
    placeholder: 'jane_doe',
    leftIcon: <AtIcon />,
    rightIcon: <SearchIcon />,
  },
};

// ── Input Types ───────────────────────────────────────────

export const Email: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
    helperText: 'Required — must be a valid email address.',
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: '••••••••',
    helperText: 'Must be at least 8 characters.',
  },
};

export const Number: Story = {
  args: {
    label: 'Age',
    type: 'number',
    min: 1,
    max: 120,
    defaultValue: 25,
  },
};

export const Search: Story = {
  args: {
    label: 'Search',
    type: 'search',
    placeholder: 'Search...',
    leftIcon: <SearchIcon />,
  },
};

// ── Full Width ────────────────────────────────────────────

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    label: 'Full width input',
    placeholder: 'Takes the full container width',
  },
  render: (args) => (
    <div style={{ width: '400px' }}>
      <Input {...args} />
    </div>
  ),
};

// ── Loading ───────────────────────────────────────────────

export const Loading: Story = {
  args: {
    label: 'Loading field',
    defaultValue: 'Fetching data...',
    loading: true,
  },
};

/** Spinner renders across all sizes. */
export const LoadingAllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '320px' }}>
      <Input size="sm" label="Small" defaultValue="Small loading" loading />
      <Input size="md" label="Medium" defaultValue="Medium loading" loading />
      <Input size="lg" label="Large" defaultValue="Large loading" loading />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'Spinner scales correctly across `sm`, `md`, and `lg` sizes.' },
    },
  },
};

/** Loading with a custom helper text that replaces the default "Loading..." label. */
export const LoadingWithHelperText: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
    loading: true,
    helperText: 'Checking email availability...',
  },
};

/** All variants in loading state — spinner replaces icons, input is non-interactive. */
export const LoadingAllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Input label="With left icon" placeholder="Search..." loading leftIcon={<SearchIcon />} />
      <Input label="With right icon" placeholder="Search..." loading rightIcon={<EyeIcon />} />
      <Input label="With both icons" placeholder="Search..." loading leftIcon={<AtIcon />} rightIcon={<SearchIcon />} />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'When `loading={true}`, the spinner replaces the right icon slot. Left icon is hidden while loading.',
      },
    },
  },
};

// ── All States ────────────────────────────────────────────

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
      <Input label="Default" placeholder="Empty default" />
      <Input label="With value" defaultValue="Jane Doe" />
      <Input label="With helper text" placeholder="Type here" helperText="This is a helpful hint." />
      <Input label="With error" defaultValue="bad input" error="This value is invalid." />
      <Input label="Disabled" defaultValue="Cannot edit" disabled />
      <Input
        label="With icons"
        placeholder="Search..."
        leftIcon={<SearchIcon />}
        rightIcon={<EyeIcon />}
      />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'All input states rendered side-by-side.' },
    },
  },
};
