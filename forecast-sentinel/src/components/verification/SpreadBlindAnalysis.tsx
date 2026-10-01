'use client';

import { motion } from 'framer-motion';
import { ShieldAlert, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import type { SpreadBlindCase } from '@/types';

interface SpreadBlindAnalysisProps {
  cases: SpreadBlindCase[];
}

export default function SpreadBlindAnalysis({ cases }: SpreadBlindAnalysisProps) {
  const bustCases = cases.filter((c) => c.actualOutcome === 'bust');
  const totalCases = cases.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.16 }}
      className="card"
      style={{ padding: '1.5rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
        <ShieldAlert size={16} style={{ color: '#8b5cf6' }} />
        <h3
          style={{
            fontSize: '0.9375rem',
            fontWeight: 700,
            color: '#0f172a',
            margin: 0,
          }}
        >
          Does Sentinel Detect What Spread Misses?
        </h3>
        <span className="badge badge-prototype" style={{ fontSize: '0.5625rem' }}>
          PROTOTYPE DATA
        </span>
      </div>
      <p
        style={{
          fontSize: '0.6875rem',
          color: '#94a3b8',
          margin: '0 0 1.25rem',
        }}
      >
        Evaluation target: additional bust detection beyond spread-based signals
      </p>

      {/* Comparison visualization */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '2rem',
          alignItems: 'center',
          marginBottom: '1.5rem',
          padding: '1.5rem',
          background: '#f8f9fb',
          borderRadius: '12px',
        }}
      >
        {/* Ensemble Spread */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
            }}
          >
            <EyeOff size={18} style={{ color: '#f59e0b' }} />
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#0f172a',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}
            >
              Ensemble Spread
            </span>
          </div>
          <div
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#f59e0b',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1,
            }}
          >
            LOW
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.375rem' }}>
            Signals low uncertainty
          </div>
        </div>

        {/* VS */}
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          vs
        </div>

        {/* Forecast Sentinel */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
            }}
          >
            <Eye size={18} style={{ color: '#8b5cf6' }} />
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#0f172a',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}
            >
              Forecast Sentinel
            </span>
          </div>
          <div
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#ef4444',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1,
            }}
          >
            HIGH
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.375rem' }}>
            Detects elevated bust risk
          </div>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <button
          onClick={() => {
            const el = document.getElementById('spread-explanation');
            if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
          }}
          style={{
            background: 'none',
            border: '1px solid #e5e8ed',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#64748b',
            cursor: 'pointer'
          }}
        >
          Compare Signals
        </button>
        <div id="spread-explanation" style={{ display: 'none', marginTop: '1rem', padding: '1rem', background: '#fffbeb', borderRadius: '8px', color: '#b45309', fontSize: '0.875rem', border: '1px solid #fde68a' }}>
          <strong>Potential hidden bust:</strong> Sentinel flags this as a candidate spread-blind risk, warning forecasters of a potential bust despite low conventional spread.
        </div>
      </div>

      {/* Cases table */}
      <div
        style={{
          fontSize: '0.625rem',
          fontWeight: 600,
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '0.5rem',
        }}
      >
        Spread-Blind Bust Cases ({bustCases.length} of {totalCases})
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        {cases.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.04 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.625rem 0.75rem',
              borderRadius: '8px',
              background: c.actualOutcome === 'bust' ? '#fef2f2' : '#f8f9fb',
              border: `1px solid ${c.actualOutcome === 'bust' ? '#fecaca' : '#eef0f4'}`,
              fontSize: '0.75rem',
            }}
          >
            {c.actualOutcome === 'bust' ? (
              <XCircle size={14} style={{ color: '#ef4444' }} />
            ) : (
              <CheckCircle size={14} style={{ color: '#10b981' }} />
            )}
            <span style={{ fontWeight: 600, color: '#0f172a', minWidth: '100px' }}>
              {c.region}
            </span>
            <span style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem' }}>
              {c.date}
            </span>
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.625rem', color: '#94a3b8', marginRight: '0.375rem' }}>Spread:</span>
                <span
                  style={{
                    fontWeight: 600,
                    color: c.spreadSignal === 'low' ? '#10b981' : '#f59e0b',
                    textTransform: 'capitalize',
                  }}
                >
                  {c.spreadSignal}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.625rem', color: '#94a3b8', marginRight: '0.375rem' }}>Sentinel:</span>
                <span
                  style={{
                    fontWeight: 600,
                    color: c.sentinelSignal === 'high' ? '#ef4444' : '#f59e0b',
                    textTransform: 'capitalize',
                  }}
                >
                  {c.sentinelSignal}
                </span>
              </div>
              <span
                className="badge"
                style={{
                  fontSize: '0.5625rem',
                  padding: '0.125rem 0.5rem',
                  ...(c.actualOutcome === 'bust'
                    ? { background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }
                    : { background: '#ecfdf5', color: '#10b981', border: '1px solid #a7f3d0' }),
                }}
              >
                {c.actualOutcome === 'bust' ? 'BUST' : 'NO BUST'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
