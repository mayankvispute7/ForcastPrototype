// ============================================================
// Forecast Sentinel — Type Definitions
// ============================================================

export interface RegionRisk {
  id: string;
  name: string;
  bustProbability: number;
  riskLevel: 'low' | 'moderate' | 'high';
  peakLeadDay: number;
  primaryConcern: string;
  historicalError: 'low' | 'moderate' | 'elevated' | 'high';
  trend: number[]; // sparkline data
}

export interface MissionControlData {
  highRiskRegions: number;
  peakBustRisk: number;
  peakLeadDay: number;
  forecastsMonitored: number;
  forecastCycle: string;
  validDate: string;
  systemStatus: 'operational' | 'degraded' | 'offline';
  regions: RegionRisk[];
}

export interface RiskTrajectoryPoint {
  day: number;
  probability: number;
  label: string;
}

export interface EvidenceFactor {
  id: string;
  name: string;
  level: 'low' | 'moderate' | 'high';
  value: number; // 0–1 normalized
  description: string;
  icon: string;
}

export interface ForecastRun {
  runId: string;
  label: string;
  timestamp: string;
  rainfall: number;
  temperature: number;
  windSpeed: number;
}

export interface HistoricalAnalogue {
  id: string;
  date: string;
  season: string;
  region: string;
  leadDay: number;
  patternSimilarity: number;
  actualOutcome: string;
  bustOccurred: boolean;
}

export interface InvestigationData {
  region: RegionRisk;
  riskTrajectory: RiskTrajectoryPoint[];
  evidence: EvidenceFactor[];
  forecastEvolution: ForecastRun[];
  historicalAnalogues: HistoricalAnalogue[];
  spreadBlindDetected: boolean;
  spreadBlindExplanation: string;
}

export interface VerificationMetric {
  id: string;
  name: string;
  value: number;
  description: string;
  benchmark: string;
  isPrototype: boolean;
}

export interface CalibrationPoint {
  predicted: number;
  observed: number;
}

export interface AttentionBudgetPoint {
  fraction: number;
  random: number;
  spread: number;
  sentinel: number;
}

export interface SpreadBlindCase {
  id: string;
  region: string;
  date: string;
  spreadSignal: 'low' | 'moderate';
  sentinelSignal: 'moderate' | 'high';
  actualOutcome: 'bust' | 'no-bust';
}

export interface MissedBust {
  id: string;
  region: string;
  date: string;
  predictedRisk: number;
  actualOutcome: string;
  explanation: string;
}

export interface LedgerEntry {
  id: string;
  predictionCreated: string;
  forecastValid: string;
  region: string;
  bustProbability: number;
  predictionHash: string;
  verification: 'pending' | 'verified-correct' | 'verified-miss' | 'verified-false-alarm';
  isPrototype: boolean;
}

export interface VerificationData {
  metrics: VerificationMetric[];
  calibrationCurve: CalibrationPoint[];
  attentionBudget: AttentionBudgetPoint[];
  spreadBlindCases: SpreadBlindCase[];
  missedBusts: MissedBust[];
  ledger: LedgerEntry[];
}

export interface HistoricalErrorCell {
  region: string;
  day: number;
  errorFrequency: number; // 0–1
}

export type MapOverlay = 'risk' | 'forecast-error' | 'historical-error' | 'lead-time';

export interface SystemHealth {
  dataPipeline: 'operational' | 'degraded' | 'offline';
  model: 'operational' | 'monitoring' | 'offline';
  lastUpdate: string;
}
