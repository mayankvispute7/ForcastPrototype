'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FlaskConical,
  Target,
  Eye,
  AlertTriangle,
  XCircle,
  Clock,
  Lock,
  CheckCircle,
} from 'lucide-react';
import { getVerificationData } from '@/lib/mock-data';
import CalibrationChart from '@/components/charts/CalibrationChart';
import AttentionBudgetChart from '@/components/charts/AttentionBudgetChart';
import SpreadBlindAnalysis from '@/components/verification/SpreadBlindAnalysis';

function getRiskColor(level: string): string {
  switch (level) {
    case 'high': return '#ef4444';
    case 'moderate': return '#f59e0b';
    default: return '#10b981';
  }
}

export default function VerificationLab() {
  const data = useMemo(() => getVerificationData(), []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ padding: '2rem 2.5rem', maxWidth: '1600px' }}
    >
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6',
            }}
          >
            <FlaskConical size={18} />
          </div>
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
              }}
            >
              Verification Lab
            </motion.h1>
          </div>
        </div>
        <p
          style={{
            fontSize: '0.8125rem',
            color: '#94a3b8',
            marginTop: '0.25rem',
            maxWidth: '600px',
          }}
        >
          Measure whether Forecast Sentinel adds useful reliability information
          beyond conventional uncertainty signals.
        </p>
      </div>

      {/* Metric Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '0.75rem',
          marginBottom: '2rem',
        }}
      >
        {data.metrics.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="card"
            style={{ padding: '1rem 1.25rem' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {m.name}
              </span>
              <span className="badge badge-prototype" style={{ fontSize: '0.5rem', padding: '0.125rem 0.375rem' }}>
                DEMO
              </span>
            </div>
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#0f172a',
                fontVariantNumeric: 'tabular-nums',
                fontFamily: 'var(--font-mono)',
                lineHeight: 1,
                marginBottom: '0.375rem',
              }}
            >
              {m.value}
            </div>
            <div
              style={{
                fontSize: '0.625rem',
                color: '#94a3b8',
              }}
            >
              {m.benchmark}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row: Calibration + Attention Budget */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.25rem',
          marginBottom: '1.25rem',
        }}
      >
        {/* Reliability Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
          style={{ padding: '1.5rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <h3
              style={{
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: '#0f172a',
                margin: 0,
              }}
            >
              Reliability Diagram
            </h3>
            <span className="badge badge-prototype" style={{ fontSize: '0.5625rem' }}>PROTOTYPE DATA</span>
          </div>
          <p
            style={{
              fontSize: '0.6875rem',
              color: '#94a3b8',
              margin: '0 0 1rem',
            }}
          >
            Predicted probability vs observed bust frequency
          </p>
          <CalibrationChart data={data.calibrationCurve} />
        </motion.div>

        {/* Attention Budget */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="card"
          style={{ padding: '1.5rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <h3
              style={{
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: '#0f172a',
                margin: 0,
              }}
            >
              Forecaster Attention Budget
            </h3>
            <span className="badge badge-prototype" style={{ fontSize: '0.5625rem' }}>PROTOTYPE DATA</span>
          </div>
          <p
            style={{
              fontSize: '0.6875rem',
              color: '#94a3b8',
              margin: '0 0 1rem',
            }}
          >
            If only the highest-risk fraction of region-days can be reviewed, how
            many serious busts are captured?
          </p>
          <AttentionBudgetChart data={data.attentionBudget} />
        </motion.div>
      </div>

      {/* Spread-Blind Analysis */}
      <SpreadBlindAnalysis cases={data.spreadBlindCases} />

      {/* Honest Miss */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
        style={{ padding: '1.5rem', marginTop: '1.25rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <XCircle size={16} style={{ color: '#ef4444' }} />
          <h3
            style={{
              fontSize: '0.9375rem',
              fontWeight: 700,
              color: '#0f172a',
              margin: 0,
            }}
          >
            Where Sentinel Failed
          </h3>
        </div>
        <p
          style={{
            fontSize: '0.6875rem',
            color: '#94a3b8',
            margin: '0 0 1rem',
          }}
        >
          Honest acknowledgment of missed bust events
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {data.missedBusts.map((miss, i) => (
            <motion.div
              key={miss.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.06 }}
              style={{
                padding: '1.25rem',
                borderRadius: '10px',
                border: '1px solid #fecaca',
                background: '#fef2f2',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span
                  className="badge"
                  style={{
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: '1px solid #fca5a5',
                    fontSize: '0.5625rem',
                    fontWeight: 700,
                  }}
                >
                  MISS DETECTED
                </span>
                <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>
                  {miss.region} · {miss.date}
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  marginBottom: '0.75rem',
                  fontSize: '0.75rem',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.625rem',
                      fontWeight: 600,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '0.125rem',
                    }}
                  >
                    Predicted Risk
                  </div>
                  <div style={{ fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)', fontSize: '1rem' }}>
                    {miss.predictedRisk}%
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '0.625rem',
                      fontWeight: 600,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '0.125rem',
                    }}
                  >
                    Actual Outcome
                  </div>
                  <div style={{ fontWeight: 600, color: '#ef4444' }}>Bust</div>
                </div>
              </div>

              <div
                style={{
                  padding: '0.75rem',
                  background: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #fecaca',
                }}
              >
                <div
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '0.25rem',
                  }}
                >
                  Why?
                </div>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#475569',
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {miss.explanation}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <p
          style={{
            fontSize: '0.6875rem',
            color: '#94a3b8',
            fontStyle: 'italic',
            marginTop: '1rem',
            marginBottom: 0,
          }}
        >
          Failures are retained for verification and future model monitoring.
        </p>
      </motion.div>

      {/* Prospective Ledger */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="card"
        style={{ padding: '1.5rem', marginTop: '1.25rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <Lock size={16} style={{ color: '#3b82f6' }} />
          <h3
            style={{
              fontSize: '0.9375rem',
              fontWeight: 700,
              color: '#0f172a',
              margin: 0,
            }}
          >
            Prospective Prediction Ledger
          </h3>
        </div>
        <p
          style={{
            fontSize: '0.6875rem',
            color: '#94a3b8',
            margin: '0 0 1rem',
          }}
        >
          Predictions are recorded before the verifying observation becomes
          available.
        </p>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0 4px',
              fontSize: '0.75rem',
            }}
          >
            <thead>
              <tr
                style={{
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Prediction Created</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Region</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Valid</th>
                <th style={{ textAlign: 'right', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Bust Prob</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Hash</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Verification</th>
              </tr>
            </thead>
            <tbody>
              {data.ledger.map((entry, i) => {
                const statusColor =
                  entry.verification === 'verified-correct'
                    ? '#10b981'
                    : entry.verification === 'verified-miss'
                    ? '#ef4444'
                    : entry.verification === 'verified-false-alarm'
                    ? '#f59e0b'
                    : '#94a3b8';

                const statusLabel =
                  entry.verification === 'verified-correct'
                    ? 'Verified ✓'
                    : entry.verification === 'verified-miss'
                    ? 'Missed'
                    : entry.verification === 'verified-false-alarm'
                    ? 'False Alarm'
                    : 'Pending';

                return (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.04 }}
                    style={{
                      background: '#f8f9fb',
                      borderRadius: '8px',
                    }}
                  >
                    <td
                      style={{
                        padding: '0.75rem',
                        borderRadius: '8px 0 0 8px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: '#475569',
                      }}
                    >
                      {entry.predictionCreated}
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 600, color: '#0f172a' }}>
                      {entry.region}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#475569' }}>
                      {entry.forecastValid}
                    </td>
                    <td
                      style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        color:
                          entry.bustProbability >= 60
                            ? '#ef4444'
                            : entry.bustProbability >= 35
                            ? '#f59e0b'
                            : '#10b981',
                      }}
                    >
                      {entry.bustProbability}%
                    </td>
                    <td
                      style={{
                        padding: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        color: '#94a3b8',
                      }}
                    >
                      {entry.predictionHash.slice(0, 8)}…
                    </td>
                    <td
                      style={{
                        padding: '0.75rem',
                        borderRadius: '0 8px 8px 0',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        {entry.verification === 'pending' ? (
                          <Clock size={12} style={{ color: statusColor }} />
                        ) : entry.verification === 'verified-correct' ? (
                          <CheckCircle size={12} style={{ color: statusColor }} />
                        ) : (
                          <AlertTriangle size={12} style={{ color: statusColor }} />
                        )}
                        <span
                          style={{
                            fontWeight: 600,
                            color: statusColor,
                            fontSize: '0.6875rem',
                          }}
                        >
                          {statusLabel}
                        </span>
                        {entry.isPrototype && (
                          <span className="badge badge-prototype" style={{ fontSize: '0.5rem', padding: '0 0.375rem', marginLeft: '0.25rem' }}>
                            PROTO
                          </span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            background: '#eff6ff',
            borderRadius: '8px',
            border: '1px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Lock size={14} style={{ color: '#3b82f6' }} />
          <span
            className="badge badge-info"
            style={{
              fontSize: '0.5625rem',
              fontWeight: 700,
            }}
          >
            TIMESTAMP LOCKED
          </span>
          <span style={{ fontSize: '0.75rem', color: '#1e40af' }}>
            Predictions are recorded before the verifying observation becomes available.
          </span>
        </div>
      </motion.div>

      {/* Closing tagline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{
          textAlign: 'center',
          padding: '3rem 0 2rem',
        }}
      >
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#0f172a',
            letterSpacing: '-0.03em',
            margin: '0 0 0.5rem',
          }}
        >
          Forecast Sentinel
        </h2>
        <p
          style={{
            fontSize: '0.9375rem',
            color: '#64748b',
            fontStyle: 'italic',
          }}
        >
          Know when the forecast deserves another look.
        </p>
      </motion.div>
    </motion.div>
  );
}
