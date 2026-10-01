'use client';

import { motion } from 'framer-motion';
import { CloudRain, Thermometer, Wind, ArrowDown } from 'lucide-react';
import type { ForecastRun } from '@/types';

interface ForecastEvolutionProps {
  runs: ForecastRun[];
}

export default function ForecastEvolution({ runs }: ForecastEvolutionProps) {
  const maxRainfall = Math.max(...runs.map((r) => r.rainfall));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="card"
      style={{ padding: '1.5rem' }}
    >
      <h3
        style={{
          fontSize: '0.9375rem',
          fontWeight: 700,
          color: '#0f172a',
          margin: '0 0 0.25rem',
        }}
      >
        Forecast Evolution
      </h3>
      <p
        style={{
          fontSize: '0.6875rem',
          color: '#94a3b8',
          margin: '0 0 1.25rem',
        }}
      >
        Forecast evolution for the same valid period
      </p>

      {/* Timeline */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          position: 'relative',
        }}
      >
        {/* Vertical line */}
        <div
          style={{
            position: 'absolute',
            left: '15px',
            top: '16px',
            bottom: '16px',
            width: '2px',
            background: '#e5e8ed',
          }}
        />

        {runs.map((run, i) => {
          const isCurrent = run.runId === 'current';
          const rainfallPercent = (run.rainfall / maxRainfall) * 100;

          return (
            <motion.div
              key={run.runId}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.12 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 0',
                position: 'relative',
              }}
            >
              {/* Dot */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isCurrent ? '#0f172a' : '#f1f3f6',
                  border: isCurrent ? 'none' : '2px solid #e5e8ed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  zIndex: 1,
                }}
              >
                {isCurrent ? (
                  <span style={{ color: '#ffffff', fontSize: '0.625rem', fontWeight: 700 }}>
                    NOW
                  </span>
                ) : (
                  <span style={{ color: '#94a3b8', fontSize: '0.625rem', fontWeight: 600 }}>
                    {run.label.replace('Run ', '')}
                  </span>
                )}
              </div>

              {/* Data */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.375rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: isCurrent ? 700 : 500,
                      color: '#0f172a',
                    }}
                  >
                    {run.label}
                  </span>
                  <span
                    style={{
                      fontSize: '0.625rem',
                      color: '#94a3b8',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {run.timestamp}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '1.25rem',
                    fontSize: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <CloudRain size={13} style={{ color: '#3b82f6' }} />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        color: '#0f172a',
                      }}
                    >
                      {run.rainfall} mm
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Thermometer size={13} style={{ color: '#f59e0b' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#475569' }}>
                      {run.temperature}°C
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Wind size={13} style={{ color: '#64748b' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#475569' }}>
                      {run.windSpeed} km/h
                    </span>
                  </div>
                </div>

                {/* Rainfall bar */}
                <div
                  style={{
                    marginTop: '0.5rem',
                    height: '4px',
                    background: '#f1f3f6',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rainfallPercent}%` }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
                    style={{
                      height: '100%',
                      borderRadius: '2px',
                      background:
                        rainfallPercent >= 80
                          ? '#ef4444'
                          : rainfallPercent >= 50
                          ? '#f59e0b'
                          : '#3b82f6',
                    }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Change summary */}
      {runs.length >= 2 && (
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.75rem',
            borderRadius: '8px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            fontSize: '0.75rem',
            color: '#991b1b',
          }}
        >
          <span style={{ fontWeight: 600 }}>Rainfall change: </span>
          {runs[0].rainfall} mm → {runs[runs.length - 1].rainfall} mm
          <span style={{ fontWeight: 600 }}>
            {' '}
            (+{Math.round(((runs[runs.length - 1].rainfall - runs[0].rainfall) / runs[0].rainfall) * 100)}%)
          </span>
        </div>
      )}
    </motion.div>
  );
}
