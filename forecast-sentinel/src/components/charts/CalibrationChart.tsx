'use client';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Line,
  ComposedChart,
} from 'recharts';
import type { CalibrationPoint } from '@/types';

interface CalibrationChartProps {
  data: CalibrationPoint[];
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
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
      <div style={{ marginBottom: '0.25rem' }}>
        <span style={{ color: '#94a3b8', fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase' }}>Predicted</span>
        <div style={{ fontWeight: 700, color: '#3b82f6', fontFamily: 'var(--font-mono)' }}>
          {(d.predicted * 100).toFixed(0)}%
        </div>
      </div>
      <div>
        <span style={{ color: '#94a3b8', fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase' }}>Observed</span>
        <div style={{ fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
          {(d.observed * 100).toFixed(0)}%
        </div>
      </div>
    </div>
  );
}

export default function CalibrationChart({ data }: CalibrationChartProps) {
  // Add diagonal reference data
  const diagonalData = [
    { predicted: 0, observed: 0 },
    { predicted: 1, observed: 1 },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart
        data={data}
        margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f1f3f6"
        />
        <XAxis
          dataKey="predicted"
          type="number"
          domain={[0, 1]}
          axisLine={false}
          tickLine={false}
          tick={{
            fill: '#94a3b8',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
          }}
          tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          label={{
            value: 'Predicted Probability',
            position: 'insideBottom',
            offset: -2,
            fill: '#94a3b8',
            fontSize: 10,
          }}
        />
        <YAxis
          dataKey="observed"
          type="number"
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
            value: 'Observed Frequency',
            angle: -90,
            position: 'insideLeft',
            offset: 16,
            fill: '#94a3b8',
            fontSize: 10,
          }}
        />
        <ReferenceLine
          segment={[
            { x: 0, y: 0 },
            { x: 1, y: 1 },
          ]}
          stroke="#94a3b8"
          strokeDasharray="6 4"
          strokeWidth={1}
          label={{
            value: 'Perfect calibration',
            position: 'insideTopRight',
            fill: '#94a3b8',
            fontSize: 9,
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="observed"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{
            fill: '#ffffff',
            stroke: '#3b82f6',
            strokeWidth: 2,
            r: 5,
          }}
          activeDot={{
            fill: '#3b82f6',
            stroke: '#ffffff',
            strokeWidth: 2,
            r: 7,
          }}
          animationDuration={1200}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
