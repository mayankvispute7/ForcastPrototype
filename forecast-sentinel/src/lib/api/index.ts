// ============================================================
// Forecast Sentinel — API Abstraction Layer
// ============================================================
// This layer abstracts the data source.
// Currently uses mock data.
// Replace with fetch() calls to the FastAPI backend when ready.
// ============================================================

import {
  MissionControlData,
  InvestigationData,
  VerificationData,
  HistoricalErrorCell,
} from '@/types';

import {
  getMissionControlData as mockMissionControl,
  getInvestigationData as mockInvestigation,
  getVerificationData as mockVerification,
  getHistoricalErrorAtlas as mockErrorAtlas,
} from '@/lib/mock-data';

// Simulate async API call
function delay(ms: number = 0): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchMissionControlData(
  leadDay: number = 5
): Promise<MissionControlData> {
  await delay();
  return mockMissionControl(leadDay);
}

export async function fetchInvestigationData(
  regionId: string
): Promise<InvestigationData> {
  await delay();
  return mockInvestigation(regionId);
}

export async function fetchVerificationData(): Promise<VerificationData> {
  await delay();
  return mockVerification();
}

export async function fetchHistoricalErrorAtlas(): Promise<
  HistoricalErrorCell[]
> {
  await delay();
  return mockErrorAtlas();
}
