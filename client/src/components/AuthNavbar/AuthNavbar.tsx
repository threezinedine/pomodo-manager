import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './AuthNavbar.module.scss';

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export interface AuthNavbarProps {
  /** Show user avatar — set when the user is authenticated (e.g. logged in) */
  isAuthenticated?: boolean;
  className?: string;
}

export const AuthNavbar = ({ isAuthenticated = false, className }: AuthNavbarProps) => {
  return (
    <header className={`${styles.navbar} ${className ?? ''}`} data-testid="auth-navbar">
      <NavLink to="/" className={styles.brand}>
        <span className={styles.brandIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </span>
        <span className={styles.brandName}>Pomodoro</span>
      </NavLink>

      <div className={styles.actions}>
        <NavLink
          to="/settings"
          className={styles.iconBtn}
          aria-label="Settings"
        >
          <SettingsIcon />
        </NavLink>

        {isAuthenticated && (
          <div className={styles.avatar} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
        )}
      </div>
    </header>
  );
};
