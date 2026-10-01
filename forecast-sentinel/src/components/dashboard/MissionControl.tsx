'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  TrendingUp,
  Clock,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { getMissionControlData, getHistoricalErrorAtlas } from '@/lib/mock-data';
import MetricCard from '@/components/ui/MetricCard';
import IndiaMap from '@/components/map/IndiaMap';
import PriorityRegions from '@/components/dashboard/PriorityRegions';
import ErrorAtlas from '@/components/dashboard/ErrorAtlas';

interface MissionControlProps {
  onRegionSelect: (regionId: string) => void;
}

export default function MissionControl({ onRegionSelect }: MissionControlProps) {
  const [leadDay, setLeadDay] = useState(5);
  const [mapOverlay, setMapOverlay] = useState<string>('risk');

  const data = useMemo(() => getMissionControlData(leadDay), [leadDay]);
  const errorAtlas = useMemo(() => getHistoricalErrorAtlas(), []);

  const overlays = [
    { id: 'risk', label: 'Risk' },
    { id: 'forecast-error', label: 'Forecast Error' },
    { id: 'historical-error', label: 'Historical Error' },
    { id: 'lead-time', label: 'Lead Time' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ padding: '2rem 2.5rem', maxWidth: '1600px', position: 'relative' }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2rem',
        }}
      >
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Forecast Reliability
            <br />
            <span style={{ fontWeight: 300, color: '#475569' }}>
              Mission Control
            </span>
          </motion.h1>
          <p
            style={{
              fontSize: '0.8125rem',
              color: '#94a3b8',
              marginTop: '0.5rem',
            }}
          >
            Monitor where medium-range forecasts may become unreliable across
            India.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'flex',
            gap: '1.5rem',
            fontSize: '0.75rem',
            color: '#94a3b8',
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: '0.625rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.25rem',
              }}
            >
              Forecast Cycle
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                color: '#0f172a',
                fontWeight: 500,
              }}
            >
              {data.forecastCycle}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: '0.625rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.25rem',
              }}
            >
              Valid
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                color: '#0f172a',
                fontWeight: 500,
              }}
            >
              {data.validDate}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: '0.625rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.25rem',
              }}
            >
              Status
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontWeight: 500,
                color: '#10b981',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#10b981',
                  display: 'inline-block',
                }}
              />
              Operational
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Metric Cards */}
        <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <MetricCard
              icon={<AlertTriangle size={18} />}
              label="High-Risk Regions"
              value={data.highRiskRegions}
              sublabel="Regions requiring attention"
              accentColor="#ef4444"
              delay={0}
            />
            <MetricCard
              icon={<TrendingUp size={18} />}
              label="Peak Bust Risk"
              value={`${data.peakBustRisk}%`}
              sublabel="Highest detected risk"
              accentColor="#ef4444"
              delay={0.05}
            />
            <MetricCard
              icon={<Clock size={18} />}
              label="Lead Time"
              value={`Day ${data.peakLeadDay}`}
              sublabel="Peak risk horizon"
              accentColor="#f59e0b"
              delay={0.1}
            />
            <MetricCard
              icon={<BarChart3 size={18} />}
              label="Forecasts Monitored"
              value={data.forecastsMonitored.toLocaleString()}
              sublabel="Current evaluation window"
              accentColor="#3b82f6"
              delay={0.15}
            />
          </div>

          {/* Map Controls */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            {/* Overlay toggles */}
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {overlays.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setMapOverlay(o.id)}
                  style={{
                    padding: '0.375rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor:
                      mapOverlay === o.id ? '#3b82f6' : '#e5e8ed',
                    background:
                      mapOverlay === o.id ? '#eff6ff' : '#ffffff',
                    color: mapOverlay === o.id ? '#3b82f6' : '#64748b',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 150ms ease',
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>

            {/* Day selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={14} style={{ color: '#94a3b8' }} />
              <div style={{ display: 'flex', gap: '2px' }}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    onClick={() => setLeadDay(day)}
                    style={{
                      width: '32px',
                      height: '28px',
                      borderRadius: '5px',
                      border: '1px solid',
                      borderColor:
                        leadDay === day ? '#0f172a' : '#e5e8ed',
                      background:
                        leadDay === day ? '#0f172a' : '#ffffff',
                      color: leadDay === day ? '#ffffff' : '#64748b',
                      fontSize: '0.6875rem',
                      fontWeight: leadDay === day ? 600 : 400,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      transition: 'all 150ms ease',
                    }}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content: Map + Priority Panel */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 340px',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            {/* Map Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={leadDay}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="card"
                style={{ padding: '1.5rem', minHeight: '480px' }}
              >
                <IndiaMap
                  regions={data.regions}
                  leadDay={leadDay}
                  onRegionClick={onRegionSelect}
                />
              </motion.div>
            </AnimatePresence>

            {/* Priority Regions */}
            <PriorityRegions
              regions={data.regions.slice(0, 7)}
              onRegionClick={onRegionSelect}
            />
          </div>

          {/* Error Atlas */}
          <ErrorAtlas data={errorAtlas} />
        </motion.div>
    </motion.div>
  );
}
