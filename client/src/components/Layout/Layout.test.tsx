import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Layout } from './Layout';

// ── Helpers ─────────────────────────────────────────────────

const renderWithRouter = (ui: React.ReactElement) =>
  render(ui, { wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter> });

// ── Layout ──────────────────────────────────────────────────

describe('Layout', () => {
  it('renders the auth navbar', () => {
    renderWithRouter(
      <Layout>
        <p>Hello world</p>
      </Layout>,
    );
    expect(screen.getByTestId('auth-navbar')).toBeInTheDocument();
  });

  it('renders children in the main element', () => {
    renderWithRouter(
      <Layout>
        <p>Hello world</p>
      </Layout>,
    );
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders children inside the main element', () => {
    renderWithRouter(
      <Layout>
        <main>
          <h1>Custom heading</h1>
        </main>
      </Layout>,
    );
    expect(screen.getByRole('heading', { name: 'Custom heading' })).toBeInTheDocument();
  });

  it('applies data-testid to the root element', () => {
    const { container } = renderWithRouter(<Layout />);
    expect(container.firstChild).toHaveAttribute('data-testid', 'layout');
  });

  it('passes className to the root element', () => {
    const { container } = renderWithRouter(<Layout className="my-custom-class" />);
    expect(container.firstChild).toHaveClass('my-custom-class');
  });

  it('shows avatar when authenticated', () => {
    renderWithRouter(
      <Layout isAuthenticated>
        <p>Content</p>
      </Layout>,
    );
    // AuthNavbar renders avatar only when isAuthenticated is true
    const avatar = screen.getByTestId('auth-navbar').querySelector('[class*="avatar"]');
    expect(avatar).toBeInTheDocument();
  });

  it('does not show avatar when not authenticated', () => {
    renderWithRouter(
      <Layout isAuthenticated={false}>
        <p>Content</p>
      </Layout>,
    );
    const navbar = screen.getByTestId('auth-navbar');
    const avatars = navbar.querySelectorAll('[class*="avatar"]');
    expect(avatars).toHaveLength(0);
  });
});
