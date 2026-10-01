'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sublabel: string;
  accentColor: string;
  delay?: number;
}

function AnimatedNumber({ value }: { value: string | number }) {
  const [display, setDisplay] = useState<string>('0');
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const strVal = String(value);
    // Check if value is a pure number or has suffix
    const numMatch = strVal.match(/^([\d,]+)/);
    if (!numMatch) {
      setDisplay(strVal);
      return;
    }

    const targetNum = parseInt(numMatch[1].replace(/,/g, ''));
    const suffix = strVal.slice(numMatch[1].length);
    const duration = 800;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(targetNum * eased);
      setDisplay(current.toLocaleString() + suffix);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [value, isInView]);

  return <div ref={ref}>{display}</div>;
}

export default function MetricCard({
  icon,
  label,
  value,
  sublabel,
  accentColor,
  delay = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="card"
      style={{ padding: '1.25rem 1.5rem' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.875rem',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: `${accentColor}10`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accentColor,
          }}
        >
          {icon}
        </div>
        <span
          style={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: '#0f172a',
          letterSpacing: '-0.03em',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
          marginBottom: '0.375rem',
        }}
      >
        <AnimatedNumber value={value} />
      </div>
      <p
        style={{
          fontSize: '0.75rem',
          color: '#94a3b8',
          margin: 0,
        }}
      >
        {sublabel}
      </p>
    </motion.div>
  );
}
