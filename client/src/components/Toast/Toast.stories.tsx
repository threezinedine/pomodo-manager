import { useCallback } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';
import { ToastContainer } from './ToastContainer';
import { useToast } from './useToast';
import { Button } from '../Button';

// ── Meta ───────────────────────────────────────────────────

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Inline notification component. Used by `ToastContainer` — prefer `useToast()` in application code.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
      description: 'Controls icon and colour theme.',
      table: { defaultValue: { summary: 'info' } },
    },
    message: {
      control: 'text',
      description: 'Body text of the notification.',
    },
    title: {
      control: 'text',
      description: 'Optional bold heading above the message.',
    },
    id: { control: false },
    startTime: { control: false },
    duration: { control: false },
    onDismiss: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem', background: '#f8fafc' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toast>;

// ── Stories ─────────────────────────────────────────────────

export const Success: Story = {
  args: {
    id: 'story-success',
    variant: 'success',
    message: 'Your changes have been saved.',
    startTime: Date.now(),
    duration: 4000,
    onDismiss: () => {},
  },
};

export const Error: Story = {
  args: {
    id: 'story-error',
    variant: 'error',
    message: 'Failed to connect to the server.',
    startTime: Date.now(),
    duration: 4000,
    onDismiss: () => {},
  },
};

export const Warning: Story = {
  args: {
    id: 'story-warning',
    variant: 'warning',
    message: 'Your session will expire in 5 minutes.',
    startTime: Date.now(),
    duration: 4000,
    onDismiss: () => {},
  },
};

export const Info: Story = {
  args: {
    id: 'story-info',
    variant: 'info',
    message: 'A new update is available.',
    startTime: Date.now(),
    duration: 4000,
    onDismiss: () => {},
  },
};

export const WithTitle: Story = {
  args: {
    id: 'story-with-title',
    variant: 'success',
    title: 'Task created',
    message: 'Your new pomodoro session is ready to start.',
    startTime: Date.now(),
    duration: 4000,
    onDismiss: () => {},
  },
};

export const LongMessage: Story = {
  args: {
    id: 'story-long',
    variant: 'info',
    title: 'Network Warning',
    message:
      'Your internet connection appears to be offline. Some features may not work until you reconnect. Please check your Wi-Fi or ethernet cable and try again.',
    startTime: Date.now(),
    duration: 4000,
    onDismiss: () => {},
  },
};

// ── All Variants Gallery ────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Toast id="v-success" variant="success" message="Changes saved." startTime={Date.now()} duration={4000} onDismiss={() => {}} />
      <Toast id="v-error" variant="error" message="Something went wrong." startTime={Date.now()} duration={4000} onDismiss={() => {}} />
      <Toast id="v-warning" variant="warning" message="Low disk space." startTime={Date.now()} duration={4000} onDismiss={() => {}} />
      <Toast id="v-info" variant="info" message="New version available." startTime={Date.now()} duration={4000} onDismiss={() => {}} />
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'All four variants side by side for comparison.' } },
  },
};

// ── Interactive ──────────────────────────────────────────────

/** Interactive demo — click any button to fire the matching toast variant. */
export const InteractiveExample: Story = {
  render: () => <InteractiveDemo />,
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'Live demo: press each button to trigger its toast variant.' } },
  },
};

const InteractiveDemo = () => {
  const toast = useToast();

  const fire = useCallback(
    (variant: 'success' | 'error' | 'warning' | 'info') =>
      toast[variant](`This is a ${variant} toast — it auto-dismisses in 4 seconds.`, {
        title: variant.charAt(0).toUpperCase() + variant.slice(1),
        duration: 4000,
      }),
    [toast],
  );

  return (
    <div style={{ padding: '2rem', background: '#f8fafc' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '2rem',
        }}
      >
        <Button variant="primary" onClick={() => fire('success')}>
          Trigger Success
        </Button>
        <Button variant="danger" onClick={() => fire('error')}>
          Trigger Error
        </Button>
        <Button variant="secondary" onClick={() => fire('warning')}>
          Trigger Warning
        </Button>
        <Button variant="ghost" onClick={() => fire('info')}>
          Trigger Info
        </Button>
      </div>
      {/* ToastContainer must be rendered inside the story so useToast() connects to it */}
      <ToastContainer />
    </div>
  );
};
