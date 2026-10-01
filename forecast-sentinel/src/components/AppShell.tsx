'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/ui/Sidebar';
import MissionControl from '@/components/dashboard/MissionControl';
import Investigation from '@/components/investigation/Investigation';
import VerificationLab from '@/components/verification/VerificationLab';
import ForecastLab from '@/components/lab/ForecastLab';
import { useForecastWorkflow } from '@/context/ForecastWorkflowContext';

export type Screen = 'mission-control' | 'forecast-lab' | 'investigation' | 'verification';

export default function AppShell() {
  const [activeScreen, setActiveScreen] = useState<Screen>('mission-control');
  const { selectedRegion, setSelectedRegion, workflowState, setWorkflowState } = useForecastWorkflow();

  const handleNavigate = (screen: Screen) => {
    setActiveScreen(screen);
  };

  const handleRegionSelect = (regionId: string) => {
    setSelectedRegion(regionId);
    setWorkflowState('INVESTIGATING');
    setActiveScreen('investigation');
  };

  useEffect(() => {
    if (workflowState === 'VERIFIED') {
      setActiveScreen('verification');
    }
  }, [workflowState]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f8f9fb',
      }}
    >
      <Sidebar activeScreen={activeScreen} onNavigate={handleNavigate} />
      <main
        style={{
          flex: 1,
          marginLeft: '260px',
          minHeight: '100vh',
          overflow: 'auto',
        }}
      >
        {activeScreen === 'mission-control' && (
          <MissionControl onRegionSelect={handleRegionSelect} />
        )}
        {activeScreen === 'forecast-lab' && (
          <ForecastLab onRegionSelect={handleRegionSelect} />
        )}
        {activeScreen === 'investigation' && (
          <Investigation
            regionId={selectedRegion || 'maharashtra'}
            onBack={() => {
              setWorkflowState('RESULT_READY');
              setActiveScreen('forecast-lab');
            }}
          />
        )}
        {activeScreen === 'verification' && <VerificationLab />}
      </main>
    </motion.div>
  );
}
