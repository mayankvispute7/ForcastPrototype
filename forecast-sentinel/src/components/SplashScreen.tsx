'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'brand' | 'tagline' | 'exit'>('brand');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('tagline'), 600);
    const t2 = setTimeout(() => setPhase('exit'), 1800);
    const t3 = setTimeout(onComplete, 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {/* Background grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Animated contour lines */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.06,
        }}
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.ellipse
            key={i}
            cx="400"
            cy="300"
            rx={120 + i * 60}
            ry={80 + i * 40}
            fill="none"
            stroke="#0f172a"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 1.5,
              delay: i * 0.15,
              ease: 'easeOut',
            }}
          />
        ))}
      </svg>

      {/* Brand */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'relative',
          textAlign: 'center',
        }}
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L4 7V17L12 22L20 17V7L12 2Z"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="12" cy="12" r="3" fill="white" opacity="0.9" />
              <path d="M12 5V9" stroke="white" strokeWidth="1.5" />
              <path d="M12 15V19" stroke="white" strokeWidth="1.5" />
              <path d="M7 8.5L10.5 10.5" stroke="white" strokeWidth="1" opacity="0.5" />
              <path d="M13.5 13.5L17 15.5" stroke="white" strokeWidth="1" opacity="0.5" />
            </svg>
          </div>
        </motion.div>

        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: '#0f172a',
            margin: 0,
          }}
        >
          FORECAST
          <br />
          <span style={{ fontWeight: 300, fontSize: '1.8rem' }}>SENTINEL</span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'brand' ? 0 : 1 }}
          transition={{ duration: 0.4 }}
          style={{
            marginTop: '1rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#64748b',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          AI Forecast Reliability Engine
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'tagline' ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            marginTop: '1.5rem',
            fontSize: '1.125rem',
            fontWeight: 400,
            color: '#334155',
            fontStyle: 'italic',
          }}
        >
          Forecast the forecast.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
