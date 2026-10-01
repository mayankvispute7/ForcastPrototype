'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { AttentionBudgetPoint } from '@/types';

interface AttentionBudgetChartProps {
  data: AttentionBudgetPoint[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e5e8ed',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        fontSize: '0.75rem',
      }}
    >
      <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
        Top {(label * 100).toFixed(0)}% reviewed
      </div>
      {payload.map((p: any) => (
        <div
          key={p.dataKey}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '0.125rem',
          }}
        >
          <span style={{ color: p.color, fontWeight: 500 }}>{p.name}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            {(p.value * 100).toFixed(0)}%
          </span>
        </div>
      ))}
    </div>
  );
}

function CustomLegend({ payload }: any) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '0.5rem' }}>
      {payload.map((entry: any) => (
        <div key={entry.value} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <div
            style={{
              width: '12px',
              height: '3px',
              borderRadius: '2px',
              background: entry.color,
            }}
          />
          <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 500 }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AttentionBudgetChart({ data }: AttentionBudgetChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart
        data={data}
        margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f1f3f6"
          vertical={false}
        />
        <XAxis
          dataKey="fraction"
          axisLine={false}
          tickLine={false}
          tick={{
            fill: '#94a3b8',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
          }}
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          label={{
            value: 'Fraction of cases reviewed',
            position: 'insideBottom',
            offset: -2,
            fill: '#94a3b8',
            fontSize: 10,
          }}
        />
        <YAxis
          domain={[0, 1]}
          axisLine={false}
          tickLine={false}
          tick={{
            fill: '#94a3b8',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
          }}
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          width={48}
          label={{
            value: 'Busts captured',
            angle: -90,
            position: 'insideLeft',
            offset: 16,
            fill: '#94a3b8',
            fontSize: 10,
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
        <Line
          type="monotone"
          dataKey="random"
          name="Random"
          stroke="#94a3b8"
          strokeWidth={1.5}
          strokeDasharray="6 4"
          dot={false}
          animationDuration={1200}
        />
        <Line
          type="monotone"
          dataKey="spread"
          name="Ensemble Spread"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={false}
          animationDuration={1200}
          animationBegin={200}
        />
        <Line
          type="monotone"
          dataKey="sentinel"
          name="Forecast Sentinel"
          stroke="#3b82f6"
          strokeWidth={2.5}
          dot={false}
          animationDuration={1200}
          animationBegin={400}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
