'use client';

import { motion } from 'framer-motion';
import type { HistoricalErrorCell } from '@/types';

interface ErrorAtlasProps {
  data: HistoricalErrorCell[];
}

function getHeatColor(value: number): string {
  if (value >= 0.7) return 'rgba(239, 68, 68, 0.8)';
  if (value >= 0.5) return 'rgba(239, 68, 68, 0.5)';
  if (value >= 0.35) return 'rgba(245, 158, 11, 0.45)';
  if (value >= 0.2) return 'rgba(245, 158, 11, 0.25)';
  if (value >= 0.1) return 'rgba(16, 185, 129, 0.2)';
  return 'rgba(16, 185, 129, 0.08)';
}

export default function ErrorAtlas({ data }: ErrorAtlasProps) {
  const regions = [...new Set(data.map((d) => d.region))];
  const days = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card"
      style={{ padding: '1.5rem' }}
    >
      <div style={{ marginBottom: '1.25rem' }}>
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#0f172a',
            margin: 0,
          }}
        >
          Historical Error Atlas
        </h3>
        <p
          style={{
            fontSize: '0.75rem',
            color: '#94a3b8',
            margin: '0.375rem 0 0',
          }}
        >
          Where has this forecast system historically been harder to trust?
        </p>
      </div>

      {/* Heatmap */}
      <div style={{ overflowX: 'auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '140px repeat(10, 1fr)',
            gap: '2px',
            minWidth: '600px',
          }}
        >
          {/* Header */}
          <div />
          {days.map((d) => (
            <div
              key={d}
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#94a3b8',
                textAlign: 'center',
                padding: '0.375rem 0',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Day {d}
            </div>
          ))}

          {/* Rows */}
          {regions.map((region, ri) => (
            <motion.div
              key={region}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: ri * 0.03 }}
              style={{
                display: 'contents',
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#475569',
                  padding: '0.25rem 0.5rem 0.25rem 0',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {region}
              </div>
              {days.map((day) => {
                const cell = data.find(
                  (d) => d.region === region && d.day === day
                );
                const value = cell?.errorFrequency || 0;
                return (
                  <div
                    key={day}
                    title={`${region} Day ${day}: ${(value * 100).toFixed(0)}% historical error frequency`}
                    style={{
                      background: getHeatColor(value),
                      borderRadius: '3px',
                      minHeight: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.5625rem',
                      fontWeight: 500,
                      color: value >= 0.5 ? '#ffffff' : '#64748b',
                      fontFamily: 'var(--font-mono)',
                      transition: 'background 200ms ease',
                      cursor: 'default',
                    }}
                  >
                    {(value * 100).toFixed(0)}
                  </div>
                );
              })}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend and note */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid #f1f3f6',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.625rem', color: '#94a3b8' }}>Low</span>
          {[0.05, 0.15, 0.3, 0.45, 0.6, 0.8].map((v) => (
            <div
              key={v}
              style={{
                width: '16px',
                height: '10px',
                borderRadius: '2px',
                background: getHeatColor(v),
              }}
            />
          ))}
          <span style={{ fontSize: '0.625rem', color: '#94a3b8' }}>High</span>
        </div>

        <p
          style={{
            fontSize: '0.6875rem',
            color: '#94a3b8',
            fontStyle: 'italic',
            margin: 0,
            maxWidth: '380px',
          }}
        >
          Historical vulnerability is not a prediction. It provides context for
          current forecast reliability.
        </p>
      </div>
    </motion.div>
  );
}
