'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  History,
  Cloud,
  GitBranch,
  AlertTriangle,
  GitCompareArrows,
  ShieldAlert,
} from 'lucide-react';
import type { EvidenceFactor } from '@/types';

interface EvidencePanelProps {
  evidence: EvidenceFactor[];
  spreadBlindDetected: boolean;
  spreadBlindExplanation: string;
}

const iconMap: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp size={16} />,
  History: <History size={16} />,
  Cloud: <Cloud size={16} />,
  GitBranch: <GitBranch size={16} />,
  AlertTriangle: <AlertTriangle size={16} />,
  GitCompare: <GitCompareArrows size={16} />,
};

function getLevelColor(level: string): string {
  switch (level) {
    case 'high': return '#ef4444';
    case 'moderate': return '#f59e0b';
    default: return '#10b981';
  }
}

function getLevelBg(level: string): string {
  switch (level) {
    case 'high': return '#fef2f2';
    case 'moderate': return '#fffbeb';
    default: return '#ecfdf5';
  }
}

export default function EvidencePanel({
  evidence,
  spreadBlindDetected,
  spreadBlindExplanation,
}: EvidencePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
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
        Why is the Forecast at Risk?
      </h3>
      <p
        style={{
          fontSize: '0.6875rem',
          color: '#94a3b8',
          margin: '0 0 1rem',
        }}
      >
        Forecast Sentinel Evidence
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {evidence.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '0.75rem',
              borderRadius: '8px',
              background: '#f8f9fb',
              border: '1px solid #eef0f4',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: getLevelBg(e.level),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: getLevelColor(e.level),
                flexShrink: 0,
              }}
            >
              {iconMap[e.icon] || <AlertTriangle size={16} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#0f172a',
                  }}
                >
                  {e.name}
                </span>
                <span
                  className="badge"
                  style={{
                    fontSize: '0.5625rem',
                    padding: '0.125rem 0.5rem',
                    background: getLevelBg(e.level),
                    color: getLevelColor(e.level),
                    border: `1px solid ${getLevelColor(e.level)}20`,
                    textTransform: 'capitalize',
                  }}
                >
                  {e.level}
                </span>
              </div>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {e.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Spread-blind alert */}
      {spreadBlindDetected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '10px',
            background: '#f5f3ff',
            border: '1px solid #ddd6fe',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            <ShieldAlert size={16} style={{ color: '#8b5cf6' }} />
            <span
              className="badge badge-analytical"
              style={{
                fontSize: '0.625rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              SPREAD-BLIND RISK
            </span>
          </div>
          <p
            style={{
              fontSize: '0.75rem',
              color: '#6d28d9',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {spreadBlindExplanation}
          </p>
        </motion.div>
      )}

      <p
        style={{
          fontSize: '0.625rem',
          color: '#94a3b8',
          fontStyle: 'italic',
          marginTop: '0.75rem',
          marginBottom: 0,
        }}
      >
        Explanations are generated from structured model evidence.
      </p>
    </motion.div>
  );
}
