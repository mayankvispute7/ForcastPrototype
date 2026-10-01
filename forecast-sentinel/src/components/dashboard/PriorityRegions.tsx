'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { RegionRisk } from '@/types';

interface PriorityRegionsProps {
  regions: RegionRisk[];
  onRegionClick: (regionId: string) => void;
}

function getRiskColor(level: string): string {
  switch (level) {
    case 'high': return '#ef4444';
    case 'moderate': return '#f59e0b';
    default: return '#10b981';
  }
}

function getRiskBg(level: string): string {
  switch (level) {
    case 'high': return '#fef2f2';
    case 'moderate': return '#fffbeb';
    default: return '#ecfdf5';
  }
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 60;
  const height = 24;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PriorityRegions({
  regions,
  onRegionClick,
}: PriorityRegionsProps) {
  const [prioritized, setPrioritized] = useState(false);
  const displayRegions = prioritized ? regions.filter(r => r.riskLevel === 'high' || r.bustProbability >= 60).sort((a,b) => b.bustProbability - a.bustProbability) : regions;

  return (
    <div className="card" style={{ padding: '1.25rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3
            style={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: '#0f172a',
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            Priority Regions
          </h3>
          <p style={{ fontSize: '0.6875rem', color: '#94a3b8', margin: '0.25rem 0 0' }}>
            Regions requiring attention
          </p>
        </div>
        <button
          onClick={() => setPrioritized(!prioritized)}
          style={{
            background: prioritized ? '#10b981' : '#f1f5f9',
            color: prioritized ? 'white' : '#64748b',
            border: 'none',
            padding: '0.375rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.6875rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {prioritized ? 'ATTENTION BUDGET ACTIVE' : 'PRIORITIZE HIGH-RISK'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
        {displayRegions.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem' }}>
            No high-risk regions detected within attention budget.
          </div>
        )}
        {displayRegions.map((region, i) => (
          <motion.button
            key={region.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => onRegionClick(region.id)}
            whileHover={{ x: 3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.625rem 0.75rem',
              borderRadius: '8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              width: '100%',
              fontFamily: 'inherit',
              transition: 'background 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f8f9fb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {/* Rank */}
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#94a3b8',
                fontFamily: 'var(--font-mono)',
                width: '20px',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* Risk indicator */}
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: getRiskColor(region.riskLevel),
                flexShrink: 0,
              }}
            />

            {/* Info */}
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  lineHeight: 1.2,
                }}
              >
                {region.name}
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>
                Day {region.peakLeadDay} · {region.primaryConcern.split('—')[0].trim()}
              </div>
            </div>

            {/* Sparkline */}
            <Sparkline data={region.trend} color={getRiskColor(region.riskLevel)} />

            {/* Risk value */}
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: getRiskColor(region.riskLevel),
                fontFamily: 'var(--font-mono)',
                minWidth: '40px',
                textAlign: 'right',
              }}
            >
              {region.bustProbability}%
            </span>

            <ChevronRight size={14} style={{ color: '#cbd5e1' }} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
