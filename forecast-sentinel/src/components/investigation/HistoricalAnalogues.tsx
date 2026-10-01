'use client';

import { motion } from 'framer-motion';
import { X, GitCompareArrows } from 'lucide-react';
import type { HistoricalAnalogue } from '@/types';

interface HistoricalAnaloguesProps {
  analogues: HistoricalAnalogue[];
  onClose: () => void;
}

export default function HistoricalAnalogues({
  analogues,
  onClose,
}: HistoricalAnaloguesProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '640px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 24px 64px rgba(0,0,0,0.16)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GitCompareArrows size={18} style={{ color: '#3b82f6' }} />
              <h2
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  margin: 0,
                }}
              >
                Historical Analogues
              </h2>
            </div>
            <p
              style={{
                fontSize: '0.75rem',
                color: '#94a3b8',
                margin: '0.25rem 0 0',
              }}
            >
              Past situations with similar forecast patterns
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid #e5e8ed',
              background: '#f8f9fb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            marginBottom: '1.5rem',
            padding: '1rem',
            background: '#f8f9fb',
            borderRadius: '10px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '0.625rem',
                fontWeight: 600,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Current Pattern
            </div>
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#0f172a',
                marginTop: '0.25rem',
              }}
            >
              ◎
            </div>
          </div>
          <div style={{ fontSize: '1.25rem', color: '#94a3b8' }}>↔</div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '0.625rem',
                fontWeight: 600,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Past High-Error Cases
            </div>
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#ef4444',
                marginTop: '0.25rem',
              }}
            >
              ◉
            </div>
          </div>
        </div>

        {analogues.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid #e5e8ed',
              marginBottom: '0.75rem',
              background: a.bustOccurred ? '#fef2f2' : '#ffffff',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a' }}>
                  {a.date}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '0.5rem' }}>
                  {a.season}
                </span>
              </div>
              <span
                className="badge"
                style={{
                  fontSize: '0.5625rem',
                  padding: '0.125rem 0.5rem',
                  ...(a.bustOccurred
                    ? { background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }
                    : { background: '#ecfdf5', color: '#10b981', border: '1px solid #a7f3d0' }),
                }}
              >
                {a.bustOccurred ? 'BUST OCCURRED' : 'NO BUST'}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                fontSize: '0.75rem',
                marginBottom: '0.5rem',
              }}
            >
              <div>
                <div style={{ color: '#94a3b8', fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase' }}>Region</div>
                <div style={{ color: '#0f172a', fontWeight: 500 }}>{a.region}</div>
              </div>
              <div>
                <div style={{ color: '#94a3b8', fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase' }}>Lead</div>
                <div style={{ color: '#0f172a', fontWeight: 500 }}>Day {a.leadDay}</div>
              </div>
              <div>
                <div style={{ color: '#94a3b8', fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase' }}>Similarity</div>
                <div style={{ color: '#3b82f6', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  {(a.patternSimilarity * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize: '0.75rem',
                color: '#475569',
                padding: '0.5rem',
                background: a.bustOccurred ? '#fff5f5' : '#f8f9fb',
                borderRadius: '6px',
              }}
            >
              {a.actualOutcome}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
