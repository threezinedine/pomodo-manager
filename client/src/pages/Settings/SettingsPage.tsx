import React from 'react';
import styles from './SettingsPage.module.scss';

interface TimerPreset {
  label: string;
  work: number;
  shortBreak: number;
  longBreak: number;
}

const PRESETS: TimerPreset[] = [
  { label: 'Standard',    work: 25, shortBreak: 5,  longBreak: 15 },
  { label: 'Short',       work: 15, shortBreak: 3,  longBreak: 10 },
  { label: 'Extended',     work: 50, shortBreak: 10, longBreak: 30 },
];

export const SettingsPage = () => {
  return (
    <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Customize your experience</p>
        </header>

        <div className={styles.sections}>
          {/* Timer presets */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Timer Durations</h2>
            <p className={styles.sectionDesc}>
              Choose a preset or set your own intervals below.
            </p>
            <div className={styles.presetRow}>
              {PRESETS.map(({ label, work, shortBreak, longBreak }) => (
                <button key={label} type="button" className={styles.presetBtn}>
                  <span className={styles.presetLabel}>{label}</span>
                  <span className={styles.presetValues}>
                    {work}m / {shortBreak}m / {longBreak}m
                  </span>
                </button>
              ))}
            </div>

            <div className={styles.inputGrid}>
              {[
                { id: 'work',       label: 'Work (minutes)',       value: 25 },
                { id: 'shortBreak', label: 'Short break (minutes)', value: 5 },
                { id: 'longBreak',  label: 'Long break (minutes)',  value: 15 },
              ].map(({ id, label, value }) => (
                <div key={id} className={styles.field}>
                  <label htmlFor={id} className={styles.fieldLabel}>{label}</label>
                  <input
                    id={id}
                    type="number"
                    min={1}
                    max={120}
                    defaultValue={value}
                    className={styles.input}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Notifications */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Notifications</h2>
            <div className={styles.toggleRow}>
              {[
                { id: 'sound',   label: 'Sound',          desc: 'Play audio when a timer ends' },
                { id: 'desktop', label: 'Desktop alerts',  desc: 'Show system notifications' },
                { id: 'vibrate', label: 'Vibration',      desc: 'Vibrate on mobile devices' },
              ].map(({ id, label, desc }) => (
                <div key={id} className={styles.toggleItem}>
                  <div className={styles.toggleInfo}>
                    <span className={styles.toggleLabel}>{label}</span>
                    <span className={styles.toggleDesc}>{desc}</span>
                  </div>
                  <label className={styles.switch} aria-label={`Toggle ${label}`}>
                    <input type="checkbox" defaultChecked={id === 'sound'} />
                    <span className={styles.slider} />
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Theme */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Appearance</h2>
            <div className={styles.themeRow}>
              {[
                { id: 'light', label: 'Light',  bg: '#ffffff', border: '#e2e8f0' },
                { id: 'dark',  label: 'Dark',   bg: '#1e293b', border: '#334155' },
                { id: 'system',label: 'System', bg: 'linear-gradient(90deg,#fff 50%,#1e293b 50%)', border: '#e2e8f0' },
              ].map(({ id, label, bg, border }) => (
                <label key={id} className={styles.themeOption}>
                  <input type="radio" name="theme" value={id} defaultChecked={id === 'light'} className={styles.themeRadio} />
                  <span className={styles.themeSwatch} style={{ background: bg, borderColor: border }} />
                  <span className={styles.themeLabel}>{label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Account */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Account</h2>
            <div className={styles.accountRow}>
              <div className={styles.avatar} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
              <div className={styles.accountInfo}>
                <span className={styles.accountName}>Jane Doe</span>
                <span className={styles.accountEmail}>jane@example.com</span>
              </div>
              <button type="button" className={styles.logoutBtn}>Log out</button>
            </div>
          </section>
        </div>
      </div>
  );
};
