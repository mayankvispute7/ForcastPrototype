'use client';

import { motion } from 'framer-motion';
import {
  Radar,
  Search,
  FlaskConical,
  Database,
  Activity,
  FileText,
} from 'lucide-react';
import type { Screen } from '@/components/AppShell';

interface SidebarProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const navItems: { id: Screen; label: string; icon: React.ReactNode }[] = [
  {
    id: 'mission-control',
    label: 'Mission Control',
    icon: <Radar size={18} />,
  },
  {
    id: 'forecast-lab',
    label: 'Forecast Lab',
    icon: <Activity size={18} />,
  },
  {
    id: 'investigation',
    label: 'Investigation',
    icon: <Search size={18} />,
  },
  {
    id: 'verification',
    label: 'Verification Lab',
    icon: <FlaskConical size={18} />,
  },
];

const secondaryItems = [
  { label: 'Data Status', icon: <Database size={16} /> },
  { label: 'System Health', icon: <Activity size={16} /> },
  { label: 'Documentation', icon: <FileText size={16} /> },
];

export default function Sidebar({ activeScreen, onNavigate }: SidebarProps) {
  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '260px',
        height: '100vh',
        background: '#ffffff',
        borderRight: '1px solid #e5e8ed',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
      }}
    >
      {/* Brand */}
      <div style={{ padding: '1.5rem 1.25rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L4 7V17L12 22L20 17V7L12 2Z"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="12" cy="12" r="3" fill="white" opacity="0.9" />
              <path d="M12 5V9" stroke="white" strokeWidth="1.5" />
              <path d="M12 15V19" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              FORECAST
              <br />
              <span style={{ fontWeight: 300 }}>SENTINEL</span>
            </div>
          </div>
        </div>
        <p
          style={{
            fontSize: '0.6875rem',
            color: '#94a3b8',
            marginTop: '0.5rem',
            letterSpacing: '0.02em',
          }}
        >
          AI Forecast Reliability Engine
        </p>
      </div>

      {/* Primary Nav */}
      <nav style={{ padding: '0 0.75rem', flex: 1 }}>
        <div
          style={{
            fontSize: '0.625rem',
            fontWeight: 600,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '0.5rem 0.5rem 0.375rem',
          }}
        >
          Navigation
        </div>
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.625rem 0.75rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8125rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#0f172a' : '#64748b',
                background: isActive ? '#f1f5f9' : 'transparent',
                transition: 'all 150ms ease',
                marginBottom: '2px',
                fontFamily: 'inherit',
              }}
            >
              <span style={{ opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  style={{
                    marginLeft: 'auto',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#3b82f6',
                  }}
                />
              )}
            </motion.button>
          );
        })}

        {/* Secondary Nav */}
        <div
          style={{
            fontSize: '0.625rem',
            fontWeight: 600,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '1.25rem 0.5rem 0.375rem',
          }}
        >
          System
        </div>
        {secondaryItems.map((item) => (
          <button
            key={item.label}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 400,
              color: '#94a3b8',
              background: 'transparent',
              fontFamily: 'inherit',
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer Status */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid #e5e8ed',
          fontSize: '0.6875rem',
          color: '#94a3b8',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
          }}
        >
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            Data Pipeline
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
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
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
          }}
        >
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            Model
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981',
                display: 'inline-block',
              }}
            />
            Monitoring
          </span>
        </div>

        <div style={{ borderTop: '1px solid #f1f3f6', paddingTop: '0.625rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span>Cycle</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: '#475569' }}>
              00 UTC
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>System</span>
            <span style={{ color: '#10b981', fontWeight: 500 }}>Operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
