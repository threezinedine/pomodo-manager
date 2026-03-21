import React from 'react';
import styles from './ReportsPage.module.scss';

export const ReportsPage = () => {
  return (
    <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Reports</h1>
          <p className={styles.subtitle}>Track your productivity over time</p>
        </header>

        {/* Summary stats */}
        <div className={styles.statsRow}>
          {[
            { label: 'Pomodoros',    value: '24',   unit: 'this week' },
            { label: 'Focus time',   value: '10h',  unit: 'this week' },
            { label: 'Tasks done',   value: '8',    unit: 'this week' },
            { label: 'Streak',       value: '5',    unit: 'days' },
          ].map(({ label, value, unit }) => (
            <div key={label} className={styles.statCard}>
              <span className={styles.statValue}>{value}</span>
              <span className={styles.statLabel}>{label}</span>
              <span className={styles.statUnit}>{unit}</span>
            </div>
          ))}
        </div>

        {/* Charts placeholder */}
        <div className={styles.chartsRow}>
          <section className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Daily Focus (minutes)</h2>
            <div className={styles.barChart}>
              {[
                { day: 'Mon', height: 60 },
                { day: 'Tue', height: 90 },
                { day: 'Wed', height: 45 },
                { day: 'Thu', height: 80 },
                { day: 'Fri', height: 70 },
              ].map(({ day, height }) => (
                <div key={day} className={styles.barGroup}>
                  <div className={styles.bar} style={{ height: `${height}%` }} />
                  <span className={styles.barLabel}>{day}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Category Breakdown</h2>
            <div className={styles.donutLegend}>
              {[
                { label: 'Development', color: 'var(--color-primary)',   pct: 55 },
                { label: 'Meetings',    color: 'var(--color-info)',     pct: 25 },
                { label: 'Admin',       color: 'var(--color-warning)',  pct: 20 },
              ].map(({ label, color, pct }) => (
                <div key={label} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ backgroundColor: color }} />
                  <span className={styles.legendLabel}>{label}</span>
                  <span className={styles.legendPct}>{pct}%</span>
                </div>
              ))}
              {/* Simple donut visual */}
              <div className={styles.donutVisual} aria-hidden="true">
                <svg viewBox="0 0 36 36" className={styles.donutSvg}>
                  <circle cx="16" cy="16" r="13" className={styles.donutBg} />
                  <circle cx="16" cy="16" r="13"
                    className={styles.donutSeg}
                    stroke="var(--color-primary)"
                    strokeDasharray="55 45" />
                  <circle cx="16" cy="16" r="13"
                    className={styles.donutSeg}
                    stroke="var(--color-info)"
                    strokeDasharray="25 75"
                    strokeDashoffset="-15" />
                  <circle cx="16" cy="16" r="13"
                    className={styles.donutSeg}
                    stroke="var(--color-warning)"
                    strokeDasharray="20 80"
                    strokeDashoffset="-40" />
                </svg>
              </div>
            </div>
          </section>
        </div>
      </div>
  );
};
