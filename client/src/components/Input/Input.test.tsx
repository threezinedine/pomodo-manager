import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

// ── Helpers ───────────────────────────────────────────────

const renderInput = (props = {}) => render(<Input {...props} />);

// ── Default ────────────────────────────────────────────────

describe('Input — Default', () => {
  it('renders a native <input> element', () => {
    renderInput();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('applies the "md" size class to the inputWrap element', () => {
    const { container } = renderInput();
    // size class lives on .inputWrap (the border/background wrapper), not the root .wrapper
    const inputWrap = container.firstChild?.querySelector('[class*="inputWrap"]') as Element;
    expect(inputWrap?.getAttribute('class') ?? '').toContain('md');
  });

  it('renders children as placeholder text', () => {
    renderInput({ placeholder: 'Enter your name' });
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
  });

  it('applies fullWidth class when fullWidth={true}', () => {
    const { container } = renderInput({ fullWidth: true });
    const classes = (container.firstChild as Element)?.getAttribute('class') ?? '';
    expect(classes).toContain('fullWidth');
  });

  it('applies withMargin class when withMargin={true}', () => {
    const { container } = renderInput({ withMargin: true });
    const classes = (container.firstChild as Element)?.getAttribute('class') ?? '';
    expect(classes).toContain('withMargin');
  });
});

// ── Label ─────────────────────────────────────────────────

describe('Input — Label', () => {
  it('renders a <label> when label text is provided', () => {
    renderInput({ label: 'Email address' });
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
  });

  it('connects label to input via htmlFor', () => {
    renderInput({ label: 'Username' });
    const label = screen.getByText('Username');
    const input = screen.getByRole('textbox');
    expect(label).toHaveAttribute('for', input.id);
  });

  it('does not render a <label> when label is omitted', () => {
    renderInput();
    expect(document.querySelector('label')).not.toBeInTheDocument();
  });
});

// ── Helper Text ────────────────────────────────────────────

describe('Input — Helper Text', () => {
  it('renders helperText below the input', () => {
    renderInput({ helperText: 'Enter your full name' });
    expect(screen.getByText('Enter your full name')).toBeInTheDocument();
  });

  it('does not render helper text when omitted', () => {
    renderInput();
    // Only the input should be present; no helper text spans
    const textboxes = screen.getAllByRole('textbox');
    expect(textboxes).toHaveLength(1);
  });
});

// ── Error ─────────────────────────────────────────────────

describe('Input — Error', () => {
  it('applies the error class to the inputWrap element', () => {
    const { container } = renderInput({ error: 'This field is required' });
    // error class lives on .inputWrap (the border/background wrapper), not the root .wrapper
    const inputWrap = container.firstChild?.querySelector('[class*="inputWrap"]') as Element;
    expect(inputWrap?.getAttribute('class') ?? '').toContain('error');
  });

  it('renders the error message as helper text', () => {
    renderInput({ error: 'This field is required' });
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('overrides helperText with error message', () => {
    renderInput({ helperText: 'Help text', error: 'Error text' });
    expect(screen.getByText('Error text')).toBeInTheDocument();
    expect(screen.queryByText('Help text')).not.toBeInTheDocument();
  });

  it('sets aria-invalid on the input when error is present', () => {
    renderInput({ error: 'Invalid input' });
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when no error', () => {
    renderInput();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
  });

  it('sets role="alert" on the error text for screen readers', () => {
    renderInput({ error: 'Required field' });
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

// ── Loading ─────────────────────────────────────────────

describe('Input — Loading', () => {
  it('disables the input when loading={true}', () => {
    renderInput({ loading: true });
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('sets aria-busy on the input when loading', () => {
    renderInput({ loading: true });
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-busy', 'true');
  });

  it('does not set aria-busy when not loading', () => {
    renderInput({ loading: false });
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-busy', 'false');
  });

  it('shows a spinner when loading', () => {
    renderInput({ loading: true });
    // spinner is aria-hidden with an SVG circle inside
    const spinner = screen.getByRole('textbox').parentElement?.querySelector('[aria-hidden] svg');
    expect(spinner).toBeInTheDocument();
  });

  it('applies the loading class to the inputWrap element', () => {
    const { container } = renderInput({ loading: true });
    const inputWrap = container.firstChild?.querySelector('[class*="inputWrap"]') as Element;
    expect(inputWrap?.getAttribute('class') ?? '').toContain('loading');
  });

  it('shows the default "Loading..." text when no helperText is provided', () => {
    renderInput({ loading: true });
    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
  });

  it('shows helperText content when provided while loading', () => {
    renderInput({ loading: true, helperText: 'Fetching data...' });
    expect(screen.getByRole('status')).toHaveTextContent('Fetching data...');
  });

  it('hides the leftIcon while loading', () => {
    renderInput({ loading: true, leftIcon: <span data-testid="left-icon">🔍</span> });
    expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
  });

  it('does not render rightIcon while loading (spinner takes its place)', () => {
    renderInput({ loading: true, rightIcon: <span data-testid="right-icon">✓</span> });
    expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument();
  });

  it('re-shows rightIcon once loading is false', () => {
    renderInput({ loading: false, rightIcon: <span data-testid="right-icon">✓</span> });
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('does not call onChange while loading', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderInput({ loading: true, onChange });
    await user.type(screen.getByRole('textbox'), 'x');
    expect(onChange).not.toHaveBeenCalled();
  });
});

// ── Icons ─────────────────────────────────────────────────

describe('Input — Icons', () => {
  it('renders leftIcon when provided', () => {
    renderInput({ leftIcon: <span data-testid="left-icon">🔍</span> });
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('renders rightIcon when provided', () => {
    renderInput({ rightIcon: <span data-testid="right-icon">✓</span> });
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('renders both icons when both are provided', () => {
    renderInput({
      leftIcon: <span data-testid="left-icon">←</span>,
      rightIcon: <span data-testid="right-icon">→</span>,
    });
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('does not render icon wrappers when icons are omitted', () => {
    renderInput();
    const { container } = renderInput();
    // wrapper div should not have icon-specific child elements beyond the input
    const iconSpans = (container.firstChild as Element)?.querySelectorAll('[aria-hidden="true"]');
    expect(iconSpans).toHaveLength(0);
  });
});

// ── Sizes ─────────────────────────────────────────────────

describe('Input — Sizes', () => {
  it('applies "sm" size class to the inputWrap element', () => {
    const { container } = renderInput({ size: 'sm' });
    const inputWrap = container.firstChild?.querySelector('[class*="inputWrap"]') as Element;
    expect(inputWrap?.getAttribute('class') ?? '').toContain('sm');
  });

  it('applies "lg" size class to the inputWrap element', () => {
    const { container } = renderInput({ size: 'lg' });
    const inputWrap = container.firstChild?.querySelector('[class*="inputWrap"]') as Element;
    expect(inputWrap?.getAttribute('class') ?? '').toContain('lg');
  });
});

// ── Disabled ─────────────────────────────────────────────

describe('Input — Disabled', () => {
  it('disables the native input', () => {
    renderInput({ disabled: true });
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies the disabled class to the inputWrap element', () => {
    const { container } = renderInput({ disabled: true });
    // disabled class lives on .inputWrap, not the root .wrapper
    const inputWrap = container.firstChild?.querySelector('[class*="inputWrap"]') as Element;
    expect(inputWrap?.getAttribute('class') ?? '').toContain('disabled');
  });

  it('connects aria-describedby to error message when disabled with error', () => {
    renderInput({ disabled: true, error: 'Cannot edit' });
    const input = screen.getByRole('textbox');
    const alert = screen.getByRole('alert');
    expect(input).toHaveAttribute('aria-describedby', alert.id);
  });
});

// ── Type & Extra Props ───────────────────────────────────

describe('Input — Type & Extra Props', () => {
  it('forwards ref to the native <input>', () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement>;
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('forwards className to the root wrapper', () => {
    const { container } = renderInput({ className: 'my-custom-class' });
    expect(container.firstChild).toHaveClass('my-custom-class');
  });

  it('accepts standard input props (type, min, max, etc.)', () => {
    renderInput({ type: 'number', min: 0, max: 100 });
    // type="number" inputs have role="spinbutton", not "textbox"
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });

  it('forwards style to the root wrapper', () => {
    const { container } = renderInput({ style: { backgroundColor: 'rgb(255, 0, 0)' } });
    expect(container.firstChild).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' });
  });
});

// ── User Interaction ──────────────────────────────────────

describe('Input — User Interaction', () => {
  it('accepts typed text', async () => {
    const user = userEvent.setup();
    renderInput({ placeholder: 'Type here' });
    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, 'Hello world');
    expect(input).toHaveValue('Hello world');
  });

  it('calls onChange when value changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderInput({ onChange });
    await user.type(screen.getByRole('textbox'), 'x');
    expect(onChange).toHaveBeenCalled();
  });

  it('calls onFocus and onBlur', async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    renderInput({ onFocus, onBlur });
    const input = screen.getByRole('textbox');
    await user.click(input);
    expect(onFocus).toHaveBeenCalledOnce();
    await user.tab();
    expect(onBlur).toHaveBeenCalledOnce();
  });
});
