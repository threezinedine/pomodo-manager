import React from 'react';
import styles from './CalendarPage.module.scss';

export const CalendarPage = () => {
  return (
    <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Calendar</h1>
          <p className={styles.subtitle}>Manage your tasks and events</p>
        </header>

        <div className={styles.grid}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Today</h2>
            <p className={styles.cardMeta}>Saturday, 21 March 2026</p>
            <ul className={styles.taskList}>
              <li className={styles.taskItem}>
                <span className={`${styles.taskDot} ${styles.taskDotWork}`} />
                <span>Deep work session</span>
              </li>
              <li className={styles.taskItem}>
                <span className={`${styles.taskDot} ${styles.taskDotBreak}`} />
                <span>Short break</span>
              </li>
              <li className={styles.taskItem}>
                <span className={`${styles.taskDot} ${styles.taskDotWork}`} />
                <span>Code review</span>
              </li>
            </ul>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Week at a Glance</h2>
            <div className={styles.weekGrid}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                <div key={day} className={styles.weekDay}>
                  <span className={styles.weekDayLabel}>{day}</span>
                  <div className={styles.weekDayBar} />
                </div>
              ))}
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Upcoming</h2>
            <div className={styles.upcomingList}>
              <div className={styles.upcomingItem}>
                <span className={styles.upcomingDate}>22 Mar</span>
                <span>Sprint planning</span>
              </div>
              <div className={styles.upcomingItem}>
                <span className={styles.upcomingDate}>25 Mar</span>
                <span>1:1 with manager</span>
              </div>
              <div className={styles.upcomingItem}>
                <span className={styles.upcomingDate}>28 Mar</span>
                <span>Team retrospective</span>
              </div>
            </div>
          </section>
        </div>
      </div>
  );
};
