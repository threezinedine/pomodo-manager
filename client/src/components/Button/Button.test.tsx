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
    // CSS Modules hashes class names — check the base name appears in the class string
    const classes = (container.firstChild as Element)?.getAttribute('class') ?? '';
    expect(classes).toContain('primary');
  });

  it('applies the "md" size class by default', () => {
    const { container } = renderButton({ children: 'Test' });
    const classes = (container.firstChild as Element)?.getAttribute('class') ?? '';
    expect(classes).toContain('md');
  });
});

// ── Variants ──────────────────────────────────────────────

describe('Button — Variants', () => {
  it('applies "secondary" variant class', () => {
    const { container } = renderButton({ variant: 'secondary', children: 'Secondary' });
    const classes = (container.firstChild as Element)?.getAttribute('class') ?? '';
    expect(classes).toContain('secondary');
  });

  it('applies "ghost" variant class', () => {
    const { container } = renderButton({ variant: 'ghost', children: 'Ghost' });
    const classes = (container.firstChild as Element)?.getAttribute('class') ?? '';
    expect(classes).toContain('ghost');
  });

  it('applies "danger" variant class', () => {
    const { container } = renderButton({ variant: 'danger', children: 'Danger' });
    const classes = (container.firstChild as Element)?.getAttribute('class') ?? '';
    expect(classes).toContain('danger');
  });
});

// ── Sizes ─────────────────────────────────────────────────

describe('Button — Sizes', () => {
  it('applies "sm" size class', () => {
    const { container } = renderButton({ size: 'sm', children: 'Small' });
    const classes = (container.firstChild as Element)?.getAttribute('class') ?? '';
    expect(classes).toContain('sm');
  });

  it('applies "lg" size class', () => {
    const { container } = renderButton({ size: 'lg', children: 'Large' });
    const classes = (container.firstChild as Element)?.getAttribute('class') ?? '';
    expect(classes).toContain('lg');
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
    // Spinner has aria-hidden and contains an SVG circle
    expect(screen.getByRole('button').querySelector('[aria-hidden] svg')).toBeInTheDocument();
  });

  it('hides label visually via class when loading', () => {
    const { container } = renderButton({ loading: true, children: 'Loading' });
    const classes = (container.firstChild as Element)?.getAttribute('class') ?? '';
    expect(classes).toContain('loading');
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
    expect(screen.getByRole('button').querySelector('[aria-hidden] svg')).not.toBeInTheDocument();
  });
});

// ── Full Width ────────────────────────────────────────────

describe('Button — Full Width', () => {
  it('applies fullWidth class', () => {
    const { container } = renderButton({ fullWidth: true, children: 'Full Width' });
    const classes = (container.firstChild as Element)?.getAttribute('class') ?? '';
    expect(classes).toContain('fullWidth');
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
    // CSS serialises 'red' as rgb()
    expect(screen.getByRole('button')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });
});
