'use client';

import { useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle, Circle, Loader2, CheckCircle2 } from 'lucide-react';
import { useForecastWorkflow, ForecastState } from '@/context/ForecastWorkflowContext';
import { getMissionControlData } from '@/lib/mock-data';
import IndiaMap from '@/components/map/IndiaMap';
import PriorityRegions from '@/components/dashboard/PriorityRegions';

interface ForecastLabProps {
  onRegionSelect: (regionId: string) => void;
}

const processingSequence: ForecastState[] = [
  'INGESTING',
  'ALIGNING',
  'ANALYZING_FORECAST',
  'ANALYZING_HISTORY',
  'ANALYZING_REGIME',
  'ANALYZING_UNCERTAINTY',
  'PREDICTING_RISK',
  'CALIBRATING',
  'RESULT_READY'
];

const stateDescriptions: Partial<Record<ForecastState, { title: string, desc: string }>> = {
  INGESTING: { title: '01 FORECAST INGESTED', desc: 'Forecast ingested' },
  ALIGNING: { title: '02 DATA ALIGNED', desc: 'Data aligned' },
  ANALYZING_FORECAST: { title: '03 FORECAST BEHAVIOUR', desc: 'Examining how the forecast evolves across lead times.' },
  ANALYZING_HISTORY: { title: '04 HISTORICAL ERROR', desc: 'Comparing current conditions with historical forecast-error patterns.' },
  ANALYZING_REGIME: { title: '05 WEATHER REGIME', desc: 'Identifying the current atmospheric regime.' },
  ANALYZING_UNCERTAINTY: { title: '06 UNCERTAINTY SIGNALS', desc: 'Evaluating available uncertainty and model-disagreement signals.' },
  PREDICTING_RISK: { title: '07 BUST RISK', desc: 'Estimating the probability of a significant forecast error.' },
  CALIBRATING: { title: '08 PROBABILITY CALIBRATION', desc: 'Converting model output into a calibrated reliability signal.' },
  RESULT_READY: { title: '09 REGIONAL RELIABILITY', desc: 'Finalizing regional reliability values.' }
};

export default function ForecastLab({ onRegionSelect }: ForecastLabProps) {
  const { workflowState, setWorkflowState } = useForecastWorkflow();
  const data = useMemo(() => getMissionControlData(5), []); // Default Day 5 for demo

  const isIdle = workflowState === 'IDLE' || workflowState === 'FORECAST_READY';
  const isProcessing = processingSequence.slice(0, -1).includes(workflowState);
  const isReady = workflowState === 'RESULT_READY' || workflowState === 'INVESTIGATING' || workflowState === 'OUTCOME_READY' || workflowState === 'VERIFYING' || workflowState === 'VERIFIED';

  useEffect(() => {
    const currentIndex = processingSequence.indexOf(workflowState);
    if (currentIndex >= 0 && currentIndex < processingSequence.length - 1) {
      const timer = setTimeout(() => {
        setWorkflowState(processingSequence[currentIndex + 1]);
      }, 1500); // 1.5s per step
      return () => clearTimeout(timer);
    }
  }, [workflowState, setWorkflowState]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ padding: '2rem 2.5rem', maxWidth: '1600px', margin: '0 auto' }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#0f172a',
            letterSpacing: '-0.03em',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Forecast Lab
        </h1>
        <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          See how Sentinel evaluates a forecast before the outcome arrives.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isIdle && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ maxWidth: '800px' }}
          >
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                  NEW MEDIUM-RANGE FORECAST
                </h2>
                <span className="badge badge-prototype">PROTOTYPE DEMO</span>
              </div>

              <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e5e8ed' }}>
                <div>
                  <div style={{ fontSize: '0.625rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Forecast Cycle</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#0f172a' }}>00Z</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.625rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Coverage</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#0f172a' }}>India</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.625rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Lead</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#0f172a' }}>Day 1 → Day 10</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.625rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Source</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#0f172a' }}>NWP</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ padding: '1rem', background: '#f8f9fb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>MAHARASHTRA</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#0f172a' }}>Rainfall</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>30 mm</span>
                  </div>
                </div>
                <div style={{ padding: '1rem', background: '#f8f9fb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>RAJASTHAN</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#0f172a' }}>Temperature</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>45°C</span>
                  </div>
                </div>
                <div style={{ padding: '1rem', background: '#f8f9fb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>GUJARAT</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#0f172a' }}>Rainfall</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>12 mm</span>
                  </div>
                </div>
                <div style={{ padding: '1rem', background: '#f8f9fb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>MADHYA PRADESH</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#0f172a' }}>Temperature</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>39°C</span>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => setWorkflowState('INGESTING')}
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2.5rem',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'background 0.2s',
                    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
                >
                  <Play size={18} fill="currentColor" />
                  ANALYZE THIS FORECAST
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {isProcessing && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="card"
            style={{ padding: '3rem', maxWidth: '600px', margin: '2rem auto' }}
          >
            <h2 style={{ margin: '0 0 2.5rem', fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', textAlign: 'center' }}>
              SENTINEL ANALYSIS ENGINE
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {processingSequence.map((state, index) => {
                const currentStepIndex = processingSequence.indexOf(workflowState);
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isUpcoming = index > currentStepIndex;
                const info = stateDescriptions[state];

                if (!info) return null;

                return (
                  <motion.div
                    key={state}
                    initial={false}
                    animate={{
                      opacity: isUpcoming ? 0.4 : 1,
                      x: isCurrent ? 8 : 0,
                    }}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div style={{ marginTop: '0.125rem' }}>
                      {isCompleted ? (
                        <CheckCircle size={20} color="#10b981" />
                      ) : isCurrent ? (
                        <Loader2 size={20} color="#3b82f6" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <Circle size={20} color="#94a3b8" />
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: isCurrent ? 700 : 600, color: isCompleted ? '#0f172a' : isCurrent ? '#3b82f6' : '#94a3b8' }}>
                        {info.title}
                      </div>
                      {(isCurrent || isCompleted) && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                          {info.desc}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {isReady && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', background: '#ecfdf5', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
              <CheckCircle2 size={20} color="#10b981" />
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#065f46', margin: 0 }}>
                ANALYSIS COMPLETE
              </h2>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                FORECAST RELIABILITY
              </h2>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.25rem' }}>
                Select a high-risk region to investigate reliability factors.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem' }}>
              <div className="card" style={{ padding: '1.5rem', minHeight: '500px' }}>
                <IndiaMap
                  regions={data.regions}
                  leadDay={5}
                  onRegionClick={onRegionSelect}
                />
              </div>
              <PriorityRegions
                regions={data.regions}
                onRegionClick={onRegionSelect}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
