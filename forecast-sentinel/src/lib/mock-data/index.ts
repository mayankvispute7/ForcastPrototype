// ============================================================
// Forecast Sentinel — Mock Data Layer
// ============================================================
// This file provides structured prototype data.
// Replace these functions with FastAPI calls when the backend is ready.
// ============================================================

import {
  MissionControlData,
  InvestigationData,
  VerificationData,
  HistoricalErrorCell,
  RegionRisk,
  RiskTrajectoryPoint,
  EvidenceFactor,
  ForecastRun,
  HistoricalAnalogue,
  VerificationMetric,
  CalibrationPoint,
  AttentionBudgetPoint,
  SpreadBlindCase,
  MissedBust,
  LedgerEntry,
} from '@/types';

// ----------------------------------------------------------
// Region risk data by lead day
// ----------------------------------------------------------

const regionBaseData: Omit<RegionRisk, 'bustProbability' | 'riskLevel'>[] = [
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    peakLeadDay: 5,
    primaryConcern: 'Rainfall — High uncertainty',
    historicalError: 'elevated',
    trend: [12, 18, 29, 47, 78, 81, 76, 69, 61, 55],
  },
  {
    id: 'odisha',
    name: 'Odisha',
    peakLeadDay: 4,
    primaryConcern: 'Cyclonic activity — Pattern shift',
    historicalError: 'high',
    trend: [8, 14, 32, 71, 68, 62, 55, 48, 42, 38],
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    peakLeadDay: 6,
    primaryConcern: 'Rainfall — Forecast divergence',
    historicalError: 'moderate',
    trend: [5, 9, 18, 31, 48, 63, 59, 52, 44, 39],
  },
  {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    peakLeadDay: 5,
    primaryConcern: 'Temperature — Model disagreement',
    historicalError: 'moderate',
    trend: [6, 11, 19, 33, 48, 52, 47, 41, 36, 31],
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    peakLeadDay: 7,
    primaryConcern: 'Wind — Low historical coverage',
    historicalError: 'low',
    trend: [3, 5, 8, 12, 15, 18, 21, 19, 16, 14],
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    peakLeadDay: 4,
    primaryConcern: 'Rainfall — Ensemble divergence',
    historicalError: 'elevated',
    trend: [10, 16, 28, 55, 52, 47, 42, 38, 33, 29],
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    peakLeadDay: 5,
    primaryConcern: 'Rainfall — Western Ghats interaction',
    historicalError: 'moderate',
    trend: [7, 12, 22, 38, 51, 48, 43, 38, 33, 28],
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    peakLeadDay: 6,
    primaryConcern: 'Cyclonic — Bay of Bengal influence',
    historicalError: 'elevated',
    trend: [4, 8, 15, 25, 39, 54, 49, 43, 37, 32],
  },
  {
    id: 'kerala',
    name: 'Kerala',
    peakLeadDay: 4,
    primaryConcern: 'Rainfall — Orographic uncertainty',
    historicalError: 'high',
    trend: [9, 15, 31, 58, 53, 47, 41, 36, 31, 27],
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    peakLeadDay: 6,
    primaryConcern: 'Temperature — Heat wave pattern',
    historicalError: 'moderate',
    trend: [4, 7, 13, 22, 34, 46, 42, 37, 32, 28],
  },
  {
    id: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    peakLeadDay: 5,
    primaryConcern: 'Rainfall — Coastal interaction',
    historicalError: 'moderate',
    trend: [5, 9, 17, 29, 43, 40, 36, 31, 27, 23],
  },
  {
    id: 'punjab',
    name: 'Punjab',
    peakLeadDay: 7,
    primaryConcern: 'Temperature — Western disturbance',
    historicalError: 'low',
    trend: [2, 4, 7, 11, 14, 17, 20, 18, 15, 13],
  },
  {
    id: 'assam',
    name: 'Assam',
    peakLeadDay: 4,
    primaryConcern: 'Rainfall — Monsoon trough',
    historicalError: 'elevated',
    trend: [8, 13, 24, 45, 42, 38, 34, 30, 26, 23],
  },
  {
    id: 'jharkhand',
    name: 'Jharkhand',
    peakLeadDay: 5,
    primaryConcern: 'Rainfall — Convective uncertainty',
    historicalError: 'moderate',
    trend: [6, 10, 18, 30, 44, 41, 37, 32, 28, 24],
  },
];

function getRiskLevel(probability: number): 'low' | 'moderate' | 'high' {
  if (probability >= 60) return 'high';
  if (probability >= 35) return 'moderate';
  return 'low';
}

function getRegionsForDay(day: number): RegionRisk[] {
  return regionBaseData.map((r) => {
    const prob = r.trend[day - 1] || r.trend[0];
    return {
      ...r,
      bustProbability: prob,
      riskLevel: getRiskLevel(prob),
    };
  });
}

// ----------------------------------------------------------
// Mission Control
// ----------------------------------------------------------

export function getMissionControlData(leadDay: number = 5): MissionControlData {
  const regions = getRegionsForDay(leadDay);
  const highRisk = regions.filter((r) => r.riskLevel === 'high');
  const peakRisk = Math.max(...regions.map((r) => r.bustProbability));

  return {
    highRiskRegions: highRisk.length,
    peakBustRisk: peakRisk,
    peakLeadDay: leadDay,
    forecastsMonitored: 1248,
    forecastCycle: '00 UTC',
    validDate: '30 Sep 2026',
    systemStatus: 'operational',
    regions: regions.sort((a, b) => b.bustProbability - a.bustProbability),
  };
}

// ----------------------------------------------------------
// Investigation
// ----------------------------------------------------------

export function getRiskTrajectory(regionId: string): RiskTrajectoryPoint[] {
  const region = regionBaseData.find((r) => r.id === regionId);
  if (!region) return [];
  return region.trend.map((prob, i) => ({
    day: i + 1,
    probability: prob,
    label: `Day ${i + 1}`,
  }));
}

export function getEvidence(regionId: string): EvidenceFactor[] {
  const evidenceMap: Record<string, EvidenceFactor[]> = {
    maharashtra: [
      {
        id: 'forecast-evolution',
        name: 'Forecast Evolution',
        level: 'high',
        value: 0.88,
        description:
          'Recent forecast runs changed significantly for the same valid period.',
        icon: 'TrendingUp',
      },
      {
        id: 'historical-error',
        name: 'Historical Error',
        level: 'high',
        value: 0.76,
        description:
          'This region/lead/season combination has shown higher historical forecast error.',
        icon: 'History',
      },
      {
        id: 'weather-regime',
        name: 'Weather Regime',
        level: 'moderate',
        value: 0.54,
        description:
          'Current large-scale pattern shows moderate similarity to historical high-error situations.',
        icon: 'Cloud',
      },
      {
        id: 'ensemble-spread',
        name: 'Ensemble Spread',
        level: 'low',
        value: 0.22,
        description:
          'Current spread alone does not indicate strong uncertainty.',
        icon: 'GitBranch',
      },
      {
        id: 'recent-error',
        name: 'Recent Verification Error',
        level: 'high',
        value: 0.71,
        description:
          'Recent forecasts for this region have shown above-average verification errors.',
        icon: 'AlertTriangle',
      },
      {
        id: 'model-disagreement',
        name: 'Model Disagreement',
        level: 'moderate',
        value: 0.49,
        description:
          'Multiple models show moderate disagreement for this region and lead time.',
        icon: 'GitCompare',
      },
    ],
  };

  return (
    evidenceMap[regionId] || [
      {
        id: 'forecast-evolution',
        name: 'Forecast Evolution',
        level: 'moderate',
        value: 0.52,
        description:
          'Moderate changes observed across recent forecast runs.',
        icon: 'TrendingUp',
      },
      {
        id: 'historical-error',
        name: 'Historical Error',
        level: 'moderate',
        value: 0.48,
        description:
          'This region/lead/season combination has shown average historical forecast error.',
        icon: 'History',
      },
      {
        id: 'weather-regime',
        name: 'Weather Regime',
        level: 'low',
        value: 0.31,
        description:
          'Current large-scale pattern shows low similarity to historical high-error situations.',
        icon: 'Cloud',
      },
      {
        id: 'ensemble-spread',
        name: 'Ensemble Spread',
        level: 'moderate',
        value: 0.45,
        description:
          'Moderate spread detected in current ensemble.',
        icon: 'GitBranch',
      },
      {
        id: 'recent-error',
        name: 'Recent Verification Error',
        level: 'low',
        value: 0.28,
        description:
          'Recent forecasts for this region have shown acceptable verification errors.',
        icon: 'AlertTriangle',
      },
      {
        id: 'model-disagreement',
        name: 'Model Disagreement',
        level: 'low',
        value: 0.33,
        description:
          'Models show general agreement for this region.',
        icon: 'GitCompare',
      },
    ]
  );
}

export function getForecastEvolution(regionId: string): ForecastRun[] {
  const evolutionMap: Record<string, ForecastRun[]> = {
    maharashtra: [
      {
        runId: 'run-3',
        label: 'Run −3',
        timestamp: '28 Sep 2026 00 UTC',
        rainfall: 42,
        temperature: 31.2,
        windSpeed: 18,
      },
      {
        runId: 'run-2',
        label: 'Run −2',
        timestamp: '28 Sep 2026 12 UTC',
        rainfall: 57,
        temperature: 30.8,
        windSpeed: 22,
      },
      {
        runId: 'run-1',
        label: 'Run −1',
        timestamp: '29 Sep 2026 00 UTC',
        rainfall: 81,
        temperature: 29.6,
        windSpeed: 28,
      },
      {
        runId: 'current',
        label: 'Current',
        timestamp: '30 Sep 2026 00 UTC',
        rainfall: 96,
        temperature: 28.9,
        windSpeed: 34,
      },
    ],
  };

  return (
    evolutionMap[regionId] || [
      {
        runId: 'run-3',
        label: 'Run −3',
        timestamp: '28 Sep 2026 00 UTC',
        rainfall: 28,
        temperature: 32.1,
        windSpeed: 14,
      },
      {
        runId: 'run-2',
        label: 'Run −2',
        timestamp: '28 Sep 2026 12 UTC',
        rainfall: 32,
        temperature: 31.8,
        windSpeed: 16,
      },
      {
        runId: 'run-1',
        label: 'Run −1',
        timestamp: '29 Sep 2026 00 UTC',
        rainfall: 35,
        temperature: 31.5,
        windSpeed: 17,
      },
      {
        runId: 'current',
        label: 'Current',
        timestamp: '30 Sep 2026 00 UTC',
        rainfall: 38,
        temperature: 31.2,
        windSpeed: 19,
      },
    ]
  );
}

export function getHistoricalAnalogues(
  regionId: string
): HistoricalAnalogue[] {
  const analogueMap: Record<string, HistoricalAnalogue[]> = {
    maharashtra: [
      {
        id: 'ha-1',
        date: '12 Sep 2024',
        season: 'Monsoon',
        region: 'Maharashtra',
        leadDay: 5,
        patternSimilarity: 0.87,
        actualOutcome: 'Forecast bust — rainfall exceeded by 140%',
        bustOccurred: true,
      },
      {
        id: 'ha-2',
        date: '03 Oct 2023',
        season: 'Post-monsoon',
        region: 'Maharashtra',
        leadDay: 4,
        patternSimilarity: 0.79,
        actualOutcome: 'Forecast bust — wind speed underestimated',
        bustOccurred: true,
      },
      {
        id: 'ha-3',
        date: '28 Aug 2024',
        season: 'Monsoon',
        region: 'Maharashtra',
        leadDay: 6,
        patternSimilarity: 0.72,
        actualOutcome: 'Near-miss — rainfall within threshold',
        bustOccurred: false,
      },
    ],
  };

  return (
    analogueMap[regionId] || [
      {
        id: 'ha-1',
        date: '15 Jul 2024',
        season: 'Monsoon',
        region: 'General',
        leadDay: 5,
        patternSimilarity: 0.65,
        actualOutcome: 'Minor deviation from forecast',
        bustOccurred: false,
      },
    ]
  );
}

export function getInvestigationData(regionId: string): InvestigationData {
  const regions = getRegionsForDay(5);
  const region = regions.find((r) => r.id === regionId) || regions[0];

  return {
    region,
    riskTrajectory: getRiskTrajectory(regionId),
    evidence: getEvidence(regionId),
    forecastEvolution: getForecastEvolution(regionId),
    historicalAnalogues: getHistoricalAnalogues(regionId),
    spreadBlindDetected: regionId === 'maharashtra',
    spreadBlindExplanation:
      'Current ensemble spread is relatively low, while other historical and forecast-evolution signals indicate elevated bust risk. This is a spread-blind condition — conventional uncertainty measures may understate true forecast risk.',
  };
}

// ----------------------------------------------------------
// Historical Error Atlas
// ----------------------------------------------------------

export function getHistoricalErrorAtlas(): HistoricalErrorCell[] {
  const regions = [
    'Maharashtra',
    'Odisha',
    'Gujarat',
    'Madhya Pradesh',
    'Rajasthan',
    'West Bengal',
    'Karnataka',
    'Tamil Nadu',
    'Kerala',
    'Uttar Pradesh',
  ];

  const cells: HistoricalErrorCell[] = [];
  regions.forEach((region) => {
    for (let day = 1; day <= 10; day++) {
      // Simulate increasing error with lead time, with regional variation
      const baseError = 0.05 + day * 0.06;
      const regionFactor =
        region === 'Maharashtra'
          ? 1.4
          : region === 'Odisha'
          ? 1.3
          : region === 'Kerala'
          ? 1.35
          : region === 'West Bengal'
          ? 1.2
          : region === 'Rajasthan'
          ? 0.7
          : region === 'Punjab'
          ? 0.65
          : 1.0;
      const noise = (Math.sin(day * 3 + region.length) * 0.08);
      cells.push({
        region,
        day,
        errorFrequency: Math.min(
          1,
          Math.max(0, baseError * regionFactor + noise)
        ),
      });
    }
  });
  return cells;
}

// ----------------------------------------------------------
// Verification Lab
// ----------------------------------------------------------

export function getVerificationMetrics(): VerificationMetric[] {
  return [
    {
      id: 'brier',
      name: 'Brier Score',
      value: 0.168,
      description: 'Lower is better. Measures probabilistic forecast accuracy.',
      benchmark: '< 0.25 good',
      isPrototype: true,
    },
    {
      id: 'pr-auc',
      name: 'PR-AUC',
      value: 0.72,
      description:
        'Precision-Recall Area Under Curve. Higher indicates better bust detection.',
      benchmark: '> 0.5 acceptable',
      isPrototype: true,
    },
    {
      id: 'calibration',
      name: 'Calibration Error',
      value: 0.043,
      description:
        'Expected calibration error. Lower means predicted probabilities match observed frequencies.',
      benchmark: '< 0.10 good',
      isPrototype: true,
    },
    {
      id: 'false-alarm',
      name: 'False Alarm Rate',
      value: 0.18,
      description:
        'Fraction of high-risk alerts where no bust occurred.',
      benchmark: '< 0.30 acceptable',
      isPrototype: true,
    },
    {
      id: 'miss-rate',
      name: 'Miss Rate',
      value: 0.14,
      description:
        'Fraction of actual busts not flagged as high risk.',
      benchmark: '< 0.20 acceptable',
      isPrototype: true,
    },
  ];
}

export function getCalibrationCurve(): CalibrationPoint[] {
  return [
    { predicted: 0.05, observed: 0.04 },
    { predicted: 0.15, observed: 0.13 },
    { predicted: 0.25, observed: 0.22 },
    { predicted: 0.35, observed: 0.31 },
    { predicted: 0.45, observed: 0.47 },
    { predicted: 0.55, observed: 0.52 },
    { predicted: 0.65, observed: 0.62 },
    { predicted: 0.75, observed: 0.71 },
    { predicted: 0.85, observed: 0.88 },
    { predicted: 0.95, observed: 0.91 },
  ];
}

export function getAttentionBudget(): AttentionBudgetPoint[] {
  return [
    { fraction: 0.05, random: 0.05, spread: 0.12, sentinel: 0.28 },
    { fraction: 0.1, random: 0.1, spread: 0.22, sentinel: 0.48 },
    { fraction: 0.15, random: 0.15, spread: 0.3, sentinel: 0.6 },
    { fraction: 0.2, random: 0.2, spread: 0.37, sentinel: 0.69 },
    { fraction: 0.3, random: 0.3, spread: 0.48, sentinel: 0.81 },
    { fraction: 0.4, random: 0.4, spread: 0.57, sentinel: 0.88 },
    { fraction: 0.5, random: 0.5, spread: 0.65, sentinel: 0.93 },
    { fraction: 0.6, random: 0.6, spread: 0.72, sentinel: 0.96 },
    { fraction: 0.7, random: 0.7, spread: 0.79, sentinel: 0.98 },
    { fraction: 0.8, random: 0.8, spread: 0.85, sentinel: 0.99 },
    { fraction: 0.9, random: 0.9, spread: 0.91, sentinel: 1.0 },
    { fraction: 1.0, random: 1.0, spread: 1.0, sentinel: 1.0 },
  ];
}

export function getSpreadBlindCases(): SpreadBlindCase[] {
  return [
    {
      id: 'sb-1',
      region: 'Maharashtra',
      date: '12 Sep 2024',
      spreadSignal: 'low',
      sentinelSignal: 'high',
      actualOutcome: 'bust',
    },
    {
      id: 'sb-2',
      region: 'Odisha',
      date: '18 Aug 2024',
      spreadSignal: 'low',
      sentinelSignal: 'high',
      actualOutcome: 'bust',
    },
    {
      id: 'sb-3',
      region: 'West Bengal',
      date: '05 Jul 2024',
      spreadSignal: 'low',
      sentinelSignal: 'moderate',
      actualOutcome: 'bust',
    },
    {
      id: 'sb-4',
      region: 'Gujarat',
      date: '22 Sep 2024',
      spreadSignal: 'moderate',
      sentinelSignal: 'high',
      actualOutcome: 'no-bust',
    },
    {
      id: 'sb-5',
      region: 'Tamil Nadu',
      date: '10 Oct 2024',
      spreadSignal: 'low',
      sentinelSignal: 'high',
      actualOutcome: 'bust',
    },
  ];
}

export function getMissedBusts(): MissedBust[] {
  return [
    {
      id: 'miss-1',
      region: 'Rajasthan',
      date: '15 Aug 2024',
      predictedRisk: 24,
      actualOutcome: 'Forecast bust — unexpected convective rainfall exceeded threshold by 85%',
      explanation:
        'Current feature pattern was poorly represented in historical training cases. Region-season combination had limited analogues in the training period.',
    },
    {
      id: 'miss-2',
      region: 'Assam',
      date: '02 Jul 2024',
      predictedRisk: 31,
      actualOutcome: 'Forecast bust — rapid intensification not captured',
      explanation:
        'Rapid downstream development was not represented in the feature set. This failure case has been retained for future model monitoring.',
    },
  ];
}

export function getPredictionLedger(): LedgerEntry[] {
  return [
    {
      id: 'ledger-1',
      predictionCreated: '30 Sep 2026 — 00:18 UTC',
      forecastValid: '05 Oct 2026',
      region: 'Maharashtra',
      bustProbability: 78,
      predictionHash: '8F4A2B7C91C3E6D1',
      verification: 'pending',
      isPrototype: true,
    },
    {
      id: 'ledger-2',
      predictionCreated: '30 Sep 2026 — 00:18 UTC',
      forecastValid: '04 Oct 2026',
      region: 'Odisha',
      bustProbability: 71,
      predictionHash: 'A3C7F9E2B4D6801A',
      verification: 'pending',
      isPrototype: true,
    },
    {
      id: 'ledger-3',
      predictionCreated: '29 Sep 2026 — 00:22 UTC',
      forecastValid: '03 Oct 2026',
      region: 'Gujarat',
      bustProbability: 63,
      predictionHash: '6B2D4F8A1E3C9705',
      verification: 'pending',
      isPrototype: true,
    },
    {
      id: 'ledger-4',
      predictionCreated: '25 Sep 2026 — 00:15 UTC',
      forecastValid: '30 Sep 2026',
      region: 'West Bengal',
      bustProbability: 55,
      predictionHash: 'D9E1F3A7B2C48066',
      verification: 'verified-correct',
      isPrototype: true,
    },
    {
      id: 'ledger-5',
      predictionCreated: '24 Sep 2026 — 00:20 UTC',
      forecastValid: '29 Sep 2026',
      region: 'Kerala',
      bustProbability: 58,
      predictionHash: '5A8C2E6F9D1B3074',
      verification: 'verified-miss',
      isPrototype: true,
    },
  ];
}

export function getVerificationData(): VerificationData {
  return {
    metrics: getVerificationMetrics(),
    calibrationCurve: getCalibrationCurve(),
    attentionBudget: getAttentionBudget(),
    spreadBlindCases: getSpreadBlindCases(),
    missedBusts: getMissedBusts(),
    ledger: getPredictionLedger(),
  };
}
