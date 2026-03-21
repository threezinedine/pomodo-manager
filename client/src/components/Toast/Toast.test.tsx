import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toast } from './Toast';
import { useToastStore } from './toastStore';

// ── Toast unit tests ────────────────────────────────────────

describe('Toast — unit', () => {
  const defaultProps = { id: 'toast-1', message: 'Test message', startTime: Date.now(), duration: 4000, onDismiss: vi.fn() };

  beforeEach(() => defaultProps.onDismiss.mockClear());

  // ── Rendering ─────────────────────────────────────────────

  it('renders the message text', () => {
    render(<Toast {...defaultProps} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders an accessible alert role', () => {
    render(<Toast {...defaultProps} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders the optional title', () => {
    render(<Toast {...defaultProps} title="Heads up!" />);
    expect(screen.getByText('Heads up!')).toBeInTheDocument();
  });

  it('does not render a title element when title is omitted', () => {
    render(<Toast {...defaultProps} />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  // ── Variants ──────────────────────────────────────────────

  it('applies "success" class for success variant', () => {
    const { container } = render(<Toast {...defaultProps} variant="success" />);
    const classes = (container.firstChild as Element)?.getAttribute('class') ?? '';
    expect(classes).toContain('success');
  });

  it('applies "error" class for error variant', () => {
    const { container } = render(<Toast {...defaultProps} variant="error" />);
    const classes = (container.firstChild as Element)?.getAttribute('class') ?? '';
    expect(classes).toContain('error');
  });

  it('applies "warning" class for warning variant', () => {
    const { container } = render(<Toast {...defaultProps} variant="warning" />);
    const classes = (container.firstChild as Element)?.getAttribute('class') ?? '';
    expect(classes).toContain('warning');
  });

  it('applies "info" class for info variant (default)', () => {
    const { container } = render(<Toast {...defaultProps} />);
    const classes = (container.firstChild as Element)?.getAttribute('class') ?? '';
    expect(classes).toContain('info');
  });

  // ── Dismiss button ────────────────────────────────────────

  it('has a dismiss button with an accessible label', () => {
    render(<Toast {...defaultProps} />);
    expect(screen.getByRole('button', { name: /dismiss notification/i })).toBeInTheDocument();
  });

  it('calls onDismiss with the toast id when dismiss button is clicked', () => {
    render(<Toast {...defaultProps} id="my-id" startTime={Date.now()} duration={4000} />);
    fireEvent.click(screen.getByRole('button', { name: /dismiss notification/i }));
    expect(defaultProps.onDismiss).toHaveBeenCalledWith('my-id');
  });

  // ── Progress Bar ─────────────────────────────────────────

  it('renders the progress bar when duration > 0', () => {
    const { container } = render(<Toast {...defaultProps} duration={4000} startTime={Date.now()} />);
    const bar = container.querySelector('[class*="progressBar"]');
    expect(bar).toBeInTheDocument();
  });

  it('does not render the progress bar when duration is 0', () => {
    const { container } = render(<Toast {...defaultProps} duration={0} startTime={Date.now()} />);
    const bar = container.querySelector('[class*="progressBar"]');
    expect(bar).not.toBeInTheDocument();
  });
});

// ── ToastContainer + Store integration ─────────────────────

import { ToastContainer } from './ToastContainer';

const renderWithContainer = () => render(<ToastContainer />);

// Helper to trigger a store add directly (bypasses useToast for unit clarity)
const addToast = (options: { message: string; variant?: 'success' | 'error' | 'warning' | 'info'; title?: string }) =>
  useToastStore.getState().add(options);

const clearToasts = () => useToastStore.getState().clear();

describe('ToastContainer — integration', () => {
  beforeEach(() => clearToasts());
  afterEach(() => clearToasts());

  it('renders nothing when store is empty', () => {
    const { container } = renderWithContainer();
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a toast when one is added to the store', () => {
    addToast({ message: 'Hello world' });
    renderWithContainer();
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders multiple toasts', () => {
    addToast({ message: 'First' });
    addToast({ message: 'Second' });
    addToast({ message: 'Third' });
    renderWithContainer();
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });

  it('renders success, error, and warning toasts with their messages', () => {
    addToast({ message: 'Saved!', variant: 'success' });
    addToast({ message: 'Failed.', variant: 'error' });
    addToast({ message: 'Check your input.', variant: 'warning' });
    renderWithContainer();
    expect(screen.getByText('Saved!')).toBeInTheDocument();
    expect(screen.getByText('Failed.')).toBeInTheDocument();
    expect(screen.getByText('Check your input.')).toBeInTheDocument();
  });

  it('removes a toast when dismissed', () => {
    const { id } = useToastStore.getState().add({ message: 'To be removed' });
    renderWithContainer();
    expect(screen.getByText('To be removed')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /dismiss notification/i }));
    expect(screen.queryByText('To be removed')).not.toBeInTheDocument();
  });

  it('clears all toasts from the store', () => {
    addToast({ message: 'One' });
    addToast({ message: 'Two' });
    clearToasts();
    const { container } = renderWithContainer();
    expect(container).toBeEmptyDOMElement();
  });
});
