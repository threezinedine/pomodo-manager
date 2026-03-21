import React from 'react';
import { AuthNavbar } from '../AuthNavbar';
import styles from './Layout.module.scss';

export interface LayoutProps {
  children?: React.ReactNode;
  className?: string;
  /** Show the user avatar in the navbar. Pass from auth store. */
  isAuthenticated?: boolean;
}

export const Layout = ({ children, className, isAuthenticated = false }: LayoutProps) => {
  return (
    <div className={`${styles.root} ${className ?? ''}`} data-testid="layout">
      <AuthNavbar isAuthenticated={isAuthenticated} />
      <main className={styles.content} id="main-content" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
};
