'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ForecastState = 
  | 'IDLE'
  | 'FORECAST_READY'
  | 'INGESTING'
  | 'ALIGNING'
  | 'ANALYZING_FORECAST'
  | 'ANALYZING_HISTORY'
  | 'ANALYZING_REGIME'
  | 'ANALYZING_UNCERTAINTY'
  | 'PREDICTING_RISK'
  | 'CALIBRATING'
  | 'RESULT_READY'
  | 'INVESTIGATING'
  | 'OUTCOME_READY'
  | 'VERIFYING'
  | 'VERIFIED';

interface ForecastWorkflowContextType {
  workflowState: ForecastState;
  setWorkflowState: (state: ForecastState) => void;
  selectedRegion: string | null;
  setSelectedRegion: (regionId: string | null) => void;
  advanceToOutcome: () => void;
}

const ForecastWorkflowContext = createContext<ForecastWorkflowContextType | undefined>(undefined);

export function ForecastWorkflowProvider({ children }: { children: ReactNode }) {
  const [workflowState, setWorkflowState] = useState<ForecastState>('IDLE');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const advanceToOutcome = () => {
    setWorkflowState('OUTCOME_READY');
  };

  return (
    <ForecastWorkflowContext.Provider
      value={{
        workflowState,
        setWorkflowState,
        selectedRegion,
        setSelectedRegion,
        advanceToOutcome,
      }}
    >
      {children}
    </ForecastWorkflowContext.Provider>
  );
}

export function useForecastWorkflow() {
  const context = useContext(ForecastWorkflowContext);
  if (context === undefined) {
    throw new Error('useForecastWorkflow must be used within a ForecastWorkflowProvider');
  }
  return context;
}
