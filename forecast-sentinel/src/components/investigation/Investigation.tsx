'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  AlertTriangle,
  Clock,
  Eye,
  CheckCircle2,
  FastForward,
  Activity,
} from 'lucide-react';
import { getInvestigationData } from '@/lib/mock-data';
import RiskTrajectoryChart from '@/components/charts/RiskTrajectoryChart';
import EvidencePanel from '@/components/investigation/EvidencePanel';
import ForecastEvolution from '@/components/investigation/ForecastEvolution';
import EvidenceBreakdown from '@/components/investigation/EvidenceBreakdown';
import HistoricalAnalogues from '@/components/investigation/HistoricalAnalogues';
import { useForecastWorkflow } from '@/context/ForecastWorkflowContext';

interface InvestigationProps {
  regionId: string;
  onBack: () => void;
}

function getRiskColor(prob: number): string {
  if (prob >= 60) return '#ef4444';
  if (prob >= 35) return '#f59e0b';
  return '#10b981';
}

function getRiskLabel(prob: number): string {
  if (prob >= 60) return 'HIGH ATTENTION';
  if (prob >= 35) return 'WATCH';
  return 'LOW RISK';
}

function getRiskBadgeStyle(prob: number) {
  if (prob >= 60)
    return {
      background: '#fef2f2',
      color: '#ef4444',
      border: '1px solid #fecaca',
    };
  if (prob >= 35)
    return {
      background: '#fffbeb',
      color: '#f59e0b',
      border: '1px solid #fde68a',
    };
  return {
    background: '#ecfdf5',
    color: '#10b981',
    border: '1px solid #a7f3d0',
  };
}

export default function Investigation({ regionId, onBack }: InvestigationProps) {
  const data = useMemo(() => getInvestigationData(regionId), [regionId]);
  const [showAnalogues, setShowAnalogues] = useState(false);
  const { workflowState, advanceToOutcome, setWorkflowState } = useForecastWorkflow();

  const isOutcomePhase = workflowState === 'OUTCOME_READY' || workflowState === 'VERIFYING' || workflowState === 'VERIFIED';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ padding: '2rem 2.5rem', maxWidth: '1600px' }}
    >
      {/* Back button + Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <motion.button
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            whileHover={{ x: -3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
              fontSize: '0.75rem',
              fontWeight: 500,
              fontFamily: 'inherit',
              padding: 0,
            }}
          >
            <ArrowLeft size={14} />
            Mission Control
          </motion.button>

          {!isOutcomePhase && (
            <button
              onClick={advanceToOutcome}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#0f172a',
                color: 'white',
                border: 'none',
                padding: '0.625rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#1e293b'}
              onMouseOut={(e) => e.currentTarget.style.background = '#0f172a'}
            >
              ADVANCE TO OUTCOME <FastForward size={14} />
            </button>
          )}

          {isOutcomePhase && (
            <button
              onClick={() => setWorkflowState('VERIFIED')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.625rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
              onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
            >
              <CheckCircle2 size={14} /> VERIFY PREDICTION
            </button>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
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
                textTransform: 'uppercase',
              }}
            >
              {data.region.name}
            </motion.h1>
            <p
              style={{
                fontSize: '0.8125rem',
                color: '#94a3b8',
                marginTop: '0.25rem',
              }}
            >
              Forecast Reliability Investigation
            </p>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {/* Bust probability */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: getRiskColor(data.region.bustProbability),
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                }}
              >
                {data.region.bustProbability}%
              </div>
              <div
                style={{
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginTop: '0.25rem',
                }}
              >
                Bust Probability
              </div>
            </div>

            {/* Status badge */}
            <div
              className="badge"
              style={{
                ...getRiskBadgeStyle(data.region.bustProbability),
                padding: '0.375rem 0.875rem',
                fontSize: '0.6875rem',
              }}
            >
              <AlertTriangle size={12} />
              {getRiskLabel(data.region.bustProbability)}
            </div>

            {/* Meta */}
            <div
              style={{
                fontSize: '0.75rem',
                color: '#94a3b8',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Clock size={12} />
                <span>
                  Valid: <span style={{ color: '#475569', fontWeight: 500 }}>05 Oct 2026</span>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Eye size={12} />
                <span>
                  Lead: <span style={{ color: '#475569', fontWeight: 500 }}>Day {data.region.peakLeadDay}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isOutcomePhase ? (
          <motion.div
            key="outcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card"
            style={{ padding: '2rem', marginBottom: '2rem', border: '2px solid #10b981' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', background: '#ecfdf5', color: '#10b981', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={20} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Forecast Outcome</h2>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748b' }}>Observation data has arrived</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ padding: '1.5rem', background: '#f8f9fb', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>PREDICTED</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>Risk Level: {getRiskLabel(data.region.bustProbability)}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>Bust Probability: {data.region.bustProbability}%</div>
              </div>
              
              <div style={{ padding: '1.5rem', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fca5a5' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#dc2626', textTransform: 'uppercase', marginBottom: '0.5rem' }}>OBSERVED OUTCOME</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#b91c1c' }}>Forecast Bust Occurred</div>
                <div style={{ fontSize: '0.875rem', color: '#7f1d1d', marginTop: '0.5rem' }}>Error magnitude exceeded threshold</div>
              </div>
            </div>
            
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#eff6ff', borderRadius: '8px', color: '#1e40af', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} />
              Sentinel successfully identified this bust in advance. Verify prediction to add to ledger.
            </div>
          </motion.div>
        ) : (
          <motion.div key="investigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Risk Trajectory */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="card"
              style={{ padding: '1.5rem', marginBottom: '1.25rem' }}
            >
              <h3
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  margin: '0 0 0.25rem',
                }}
              >
                Risk Trajectory
              </h3>
              <p
                style={{
                  fontSize: '0.6875rem',
                  color: '#94a3b8',
                  margin: '0 0 1rem',
                }}
              >
                Bust probability across lead days for the same valid period
              </p>
              <RiskTrajectoryChart data={data.riskTrajectory} />
            </motion.div>

            {/* Evidence + Forecast Evolution side by side */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.25rem',
                marginBottom: '1.25rem',
              }}
            >
              <EvidencePanel
                evidence={data.evidence}
                spreadBlindDetected={data.spreadBlindDetected}
                spreadBlindExplanation={data.spreadBlindExplanation}
              />
              <ForecastEvolution runs={data.forecastEvolution} />
            </div>

            {/* Evidence Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{ marginBottom: '1.25rem' }}
            >
              <EvidenceBreakdown evidence={data.evidence} />
            </motion.div>

            {/* Historical Analogues */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
              style={{ padding: '1.5rem' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      margin: 0,
                    }}
                  >
                    Historical Analogues
                  </h3>
                  <p
                    style={{
                      fontSize: '0.6875rem',
                      color: '#94a3b8',
                      margin: '0.25rem 0 0',
                    }}
                  >
                    Past situations with similar forecast patterns
                  </p>
                </div>
                <button
                  onClick={() => setShowAnalogues(true)}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#3b82f6',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '6px',
                    padding: '0.375rem 0.875rem',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {data.historicalAnalogues.length} similar cases →
                </button>
              </div>

              {/* Summary cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.75rem',
                }}
              >
                {data.historicalAnalogues.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      border: '1px solid #e5e8ed',
                      background: a.bustOccurred ? '#fef2f2' : '#f8f9fb',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0f172a' }}>
                        {a.date}
                      </span>
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
                        {a.bustOccurred ? 'BUST' : 'NO BUST'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#64748b', marginBottom: '0.375rem' }}>
                      {a.season} · Day {a.leadDay}
                    </div>
                    <div
                      style={{
                        fontSize: '0.6875rem',
                        color: '#475569',
                        lineHeight: 1.5,
                      }}
                    >
                      {a.actualOutcome}
                    </div>
                    <div
                      style={{
                        marginTop: '0.5rem',
                        fontSize: '0.625rem',
                        color: '#94a3b8',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      Similarity: {(a.patternSimilarity * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analogues Modal */}
      {showAnalogues && (
        <HistoricalAnalogues
          analogues={data.historicalAnalogues}
          onClose={() => setShowAnalogues(false)}
        />
      )}
    </motion.div>
  );
}
