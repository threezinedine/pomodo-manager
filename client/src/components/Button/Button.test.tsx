import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

// ── Helpers ───────────────────────────────────────────────

const renderButton = (props = {}) => {
  return render(<Button {...props} />);
};

// ── Default ───────────────────────────────────────────────

describe('Button — Default', () => {
  it('renders with children as label', () => {
    renderButton({ children: 'Click me' });
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('renders as a <button> element', () => {
    const { container } = renderButton({ children: 'Test' });
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('applies the "primary" variant class by default', () => {
    const { container } = renderButton({ children: 'Test' });
    expect(container.firstChild).toHaveClass('primary');
  });

  it('applies the "md" size class by default', () => {
    const { container } = renderButton({ children: 'Test' });
    expect(container.firstChild).toHaveClass('md');
  });
});

// ── Variants ──────────────────────────────────────────────

describe('Button — Variants', () => {
  it('applies "secondary" variant class', () => {
    const { container } = renderButton({ variant: 'secondary', children: 'Secondary' });
    expect(container.firstChild).toHaveClass('secondary');
  });

  it('applies "ghost" variant class', () => {
    const { container } = renderButton({ variant: 'ghost', children: 'Ghost' });
    expect(container.firstChild).toHaveClass('ghost');
  });

  it('applies "danger" variant class', () => {
    const { container } = renderButton({ variant: 'danger', children: 'Danger' });
    expect(container.firstChild).toHaveClass('danger');
  });
});

// ── Sizes ─────────────────────────────────────────────────

describe('Button — Sizes', () => {
  it('applies "sm" size class', () => {
    const { container } = renderButton({ size: 'sm', children: 'Small' });
    expect(container.firstChild).toHaveClass('sm');
  });

  it('applies "lg" size class', () => {
    const { container } = renderButton({ size: 'lg', children: 'Large' });
    expect(container.firstChild).toHaveClass('lg');
  });
});

// ── Disabled & Loading ────────────────────────────────────

describe('Button — Disabled & Loading', () => {
  it('is disabled when disabled={true}', () => {
    renderButton({ disabled: true, children: 'Disabled' });
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when loading={true}', () => {
    renderButton({ loading: true, children: 'Loading' });
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('sets aria-busy when loading', () => {
    renderButton({ loading: true, children: 'Loading' });
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('does not set aria-busy when not loading', () => {
    renderButton({ loading: false, children: 'Not Loading' });
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'false');
  });

  it('shows spinner when loading', () => {
    renderButton({ loading: true, children: 'Loading' });
    expect(screen.getByLabelText(/loading/i, { selector: '[aria-hidden]' })).toBeInTheDocument();
  });

  it('hides label visually via class when loading', () => {
    const { container } = renderButton({ loading: true, children: 'Loading' });
    expect(container.firstChild).toHaveClass('loading');
  });
});

// ── Icons ─────────────────────────────────────────────────

describe('Button — Icons', () => {
  it('renders leftIcon when provided', () => {
    renderButton({ leftIcon: <span data-testid="left">←</span>, children: 'With Left Icon' });
    expect(screen.getByTestId('left')).toBeInTheDocument();
  });

  it('renders rightIcon when provided', () => {
    renderButton({ rightIcon: <span data-testid="right">→</span>, children: 'With Right Icon' });
    expect(screen.getByTestId('right')).toBeInTheDocument();
  });

  it('does not render spinner when not loading', () => {
    renderButton({ loading: false, children: 'Not Loading' });
    expect(screen.queryByLabelText(/loading/i, { selector: '[aria-hidden]' })).not.toBeInTheDocument();
  });
});

// ── Full Width ────────────────────────────────────────────

describe('Button — Full Width', () => {
  it('applies fullWidth class', () => {
    const { container } = renderButton({ fullWidth: true, children: 'Full Width' });
    expect(container.firstChild).toHaveClass('fullWidth');
  });
});

// ── Click Handling ─────────────────────────────────────────

describe('Button — Click Handling', () => {
  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderButton({ onClick, children: 'Click Me' });
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderButton({ onClick, disabled: true, children: 'Disabled' });
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderButton({ onClick, loading: true, children: 'Loading' });
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});

// ── Type & Extra Props ────────────────────────────────────

describe('Button — Type & Extra Props', () => {
  it('forwards ref to the underlying <button>', () => {
    const ref = { current: null } as React.RefObject<HTMLButtonElement>;
    render(<Button ref={ref} children="Ref Test" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('forwards className to the underlying <button>', () => {
    const { container } = renderButton({ className: 'my-custom-class', children: 'Custom' });
    expect(container.firstChild).toHaveClass('my-custom-class');
  });

  it('forwards style to the underlying <button>', () => {
    renderButton({ style: { color: 'red' }, children: 'Styled' });
    expect(screen.getByRole('button')).toHaveStyle({ color: 'red' });
  });
});
