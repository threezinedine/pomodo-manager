import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './Button';

// ── Meta ───────────────────────────────────────────────────

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A flexible button component supporting multiple variants, sizes, icons, and a loading state.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      description: 'Visual style variant',
      table: {
        defaultValue: { summary: 'primary' },
        type: { summary: 'primary | secondary | ghost | danger' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
      table: {
        defaultValue: { summary: 'md' },
        type: { summary: 'sm | md | lg' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Shows spinner and disables button',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
      table: { defaultValue: { summary: 'false' } },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Makes the button span full container width',
      table: { defaultValue: { summary: 'false' } },
    },
    onClick: { action: 'clicked' },
  },
  args: {
    onClick: fn(),
    children: 'Button',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ── Stories ───────────────────────────────────────────────

/** Primary buttons are used for the main call-to-action. */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary',
  },
};

/** Secondary buttons are used for less prominent actions. */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

/** Ghost buttons are minimal — no background, just text and icon. */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

/** Danger buttons are used for destructive actions like delete. */
export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Delete',
  },
};

// ── Sizes ─────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
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

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading...',
  },
  parameters: {
    docs: {
      description: { story: 'Shows a spinner and disables interaction while `loading={true}`.' },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
  parameters: {
    docs: {
      description: { story: 'Button is non-interactive and visually dimmed when `disabled={true}`.' },
    },
  },
};

// ── With Icons ────────────────────────────────────────────

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5.14v13.72a1 1 0 001.5.86l11-6.86a1 1 0 000-1.72l-11-6.86a1 1 0 00-1.5.86z" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export const WithLeftIcon: Story = {
  args: {
    variant: 'primary',
    leftIcon: <PlayIcon />,
    children: 'Start Timer',
  },
};

export const WithRightIcon: Story = {
  args: {
    variant: 'primary',
    rightIcon: <ArrowIcon />,
    children: 'Continue',
  },
};

export const WithBothIcons: Story = {
  args: {
    variant: 'secondary',
    leftIcon: <PlayIcon />,
    rightIcon: <ArrowIcon />,
    children: 'Start',
  },
  parameters: {
    docs: {
      description: {
        story: 'Both `leftIcon` and `rightIcon` can be used simultaneously.',
      },
    },
  },
};

// ── Full Width ────────────────────────────────────────────

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
  render: (args) => (
    <div style={{ width: '320px' }}>
      <Button {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Button expands to fill its container width with `fullWidth={true}`.',
      },
    },
  },
};

// ── All Variants ──────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'All four variants rendered side-by-side.' },
    },
  },
};
