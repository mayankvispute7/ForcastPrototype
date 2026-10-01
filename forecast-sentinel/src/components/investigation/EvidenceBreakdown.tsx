'use client';

import { motion } from 'framer-motion';
import type { EvidenceFactor } from '@/types';

interface EvidenceBreakdownProps {
  evidence: EvidenceFactor[];
}

function getLevelColor(level: string): string {
  switch (level) {
    case 'high': return '#ef4444';
    case 'moderate': return '#f59e0b';
    default: return '#10b981';
  }
}

function getLevelBg(level: string): string {
  switch (level) {
    case 'high': return 'rgba(239, 68, 68, 0.12)';
    case 'moderate': return 'rgba(245, 158, 11, 0.12)';
    default: return 'rgba(16, 185, 129, 0.10)';
  }
}

export default function EvidenceBreakdown({ evidence }: EvidenceBreakdownProps) {
  const maxValue = Math.max(...evidence.map((e) => e.value));

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <h3
        style={{
          fontSize: '0.9375rem',
          fontWeight: 700,
          color: '#0f172a',
          margin: '0 0 0.25rem',
        }}
      >
        Evidence Breakdown
      </h3>
      <p
        style={{
          fontSize: '0.6875rem',
          color: '#94a3b8',
          margin: '0 0 1.25rem',
        }}
      >
        Model evidence contribution to bust risk assessment
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {evidence
          .sort((a, b) => b.value - a.value)
          .map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.25rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: '#0f172a',
                }}
              >
                {e.name}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: getLevelColor(e.level),
                  textTransform: 'capitalize',
                }}
              >
                {e.level}
              </span>
            </div>
            <div
              style={{
                height: '8px',
                background: '#f1f3f6',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(e.value / maxValue) * 100}%` }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.05 }}
                style={{
                  height: '100%',
                  borderRadius: '4px',
                  background: getLevelColor(e.level),
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <p
        style={{
          fontSize: '0.625rem',
          color: '#94a3b8',
          fontStyle: 'italic',
          marginTop: '1rem',
          marginBottom: 0,
        }}
      >
        Explanations are generated from structured model evidence. Values
        represent normalized feature contribution.
      </p>
    </div>
  );
}
