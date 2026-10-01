'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from 'recharts';
import type { RiskTrajectoryPoint } from '@/types';

interface RiskTrajectoryChartProps {
  data: RiskTrajectoryPoint[];
}

function getColor(value: number): string {
  if (value >= 60) return '#ef4444';
  if (value >= 35) return '#f59e0b';
  return '#10b981';
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
      <div
        style={{
          fontWeight: 700,
          color: '#0f172a',
          marginBottom: '0.25rem',
        }}
      >
        Day {d.day}
      </div>
      <div
        style={{
          fontWeight: 600,
          color: getColor(d.probability),
          fontSize: '1rem',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {d.probability}%
      </div>
      <div style={{ color: '#94a3b8', fontSize: '0.625rem', marginTop: '0.125rem' }}>
        Bust probability
      </div>
    </div>
  );
}

function CustomDot(props: any) {
  const { cx, cy, payload } = props;
  const color = getColor(payload.probability);
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="#ffffff"
      stroke={color}
      strokeWidth={2}
    />
  );
}

export default function RiskTrajectoryChart({ data }: RiskTrajectoryChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart
        data={data}
        margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
      >
        <defs>
          <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.15} />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.08} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f1f3f6"
          vertical={false}
        />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{
            fill: '#94a3b8',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
          }}
          tickFormatter={(v) => `Day ${v}`}
        />
        <YAxis
          domain={[0, 100]}
          axisLine={false}
          tickLine={false}
          tick={{
            fill: '#94a3b8',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
          }}
          tickFormatter={(v) => `${v}%`}
          width={48}
        />
        <ReferenceLine
          y={60}
          stroke="#ef4444"
          strokeDasharray="4 4"
          strokeOpacity={0.4}
          label={{
            value: 'High risk',
            position: 'right',
            fill: '#ef4444',
            fontSize: 10,
          }}
        />
        <ReferenceLine
          y={35}
          stroke="#f59e0b"
          strokeDasharray="4 4"
          strokeOpacity={0.3}
          label={{
            value: 'Watch',
            position: 'right',
            fill: '#f59e0b',
            fontSize: 10,
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="probability"
          stroke="#3b82f6"
          strokeWidth={2.5}
          fill="url(#riskGradient)"
          dot={<CustomDot />}
          activeDot={{
            r: 6,
            fill: '#3b82f6',
            stroke: '#ffffff',
            strokeWidth: 2,
          }}
          animationDuration={1200}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
