'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { geoMercator, geoPath, geoIdentity } from 'd3-geo';
import * as topojson from 'topojson-client';
import type { RegionRisk } from '@/types';
import indiaTopo from '@/lib/india-states.json';

interface IndiaMapProps {
  regions: RegionRisk[];
  leadDay: number;
  onRegionClick: (regionId: string) => void;
}

function getRiskColor(risk: number): string {
  if (risk >= 60) return '#ef4444';
  if (risk >= 35) return '#f59e0b';
  return '#10b981';
}

function getRiskFill(risk: number): string {
  if (risk >= 60) return 'rgba(239, 68, 68, 0.18)';
  if (risk >= 35) return 'rgba(245, 158, 11, 0.14)';
  return 'rgba(16, 185, 129, 0.10)';
}

function getRiskStroke(risk: number): string {
  if (risk >= 60) return 'rgba(239, 68, 68, 0.6)';
  if (risk >= 35) return 'rgba(245, 158, 11, 0.45)';
  return 'rgba(16, 185, 129, 0.35)';
}

function getRiskGlow(risk: number): string {
  if (risk >= 60) return 'rgba(239, 68, 68, 0.25)';
  return 'transparent';
}

// Convert TopoJSON to GeoJSON once
const indiaGeoData = topojson.feature(indiaTopo as any, indiaTopo.objects.default as any) as unknown as GeoJSON.FeatureCollection<GeoJSON.Geometry, any>;

console.log('--- IndiaMap Debug ---');
console.log('indiaGeoData.features length:', indiaGeoData.features?.length);
if (indiaGeoData.features?.length > 0) {
  console.log('First feature name:', indiaGeoData.features[0].properties?.name);
  console.log('First feature coords:', (indiaGeoData.features[0].geometry as any)?.coordinates?.[0]?.[0]?.[0]);
}
console.log('----------------------');

export default function IndiaMap({
  regions,
  leadDay,
  onRegionClick,
}: IndiaMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const regionDataMap = useMemo(
    () => new Map(regions.map((r) => [r.id, r])),
    [regions]
  );

  // Create projection and path generator
  const { pathGenerator, projection } = useMemo(() => {
    // Highcharts TopoJSON coordinates are often pre-projected or require simple scaling
    const proj = geoIdentity().reflectY(true).fitSize([600, 560], indiaGeoData);
    const pathGen = geoPath().projection(proj);

    return { pathGenerator: pathGen, projection: proj };
  }, []);

  // Compute centroid positions for labels
  const stateCentroids = useMemo(() => {
    const centroids: Record<string, { x: number; y: number }> = {};
    indiaGeoData.features.forEach((feature) => {
      const stateId = (feature.properties?.name || '').toLowerCase().replace(/ /g, '-');
      const centroid = pathGenerator.centroid(feature as any);
      if (centroid && isFinite(centroid[0]) && isFinite(centroid[1])) {
        // Adjust some specific centroid positions manually if they overlap oddly, optional
        centroids[stateId] = {
          x: centroid[0],
          y: centroid[1],
        };
      }
    });
    return centroids;
  }, [pathGenerator]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent, regionId: string) => {
      const rect = e.currentTarget.closest('svg')?.getBoundingClientRect();
      if (!rect) return;
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setHoveredRegion(regionId);
    },
    []
  );

  const hoveredData = hoveredRegion
    ? regionDataMap.get(hoveredRegion)
    : null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        viewBox="0 0 600 560"
        style={{
          width: '100%',
          height: '100%',
          minHeight: '440px',
        }}
      >
        <defs>
          <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="shadow-filter" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Render state paths */}
        {indiaGeoData.features.map((feature, idx) => {
          const stateId = (feature.properties?.name || '').toLowerCase().replace(/ /g, '-');
          const regionData = regionDataMap.get(stateId);
          const risk = regionData?.bustProbability || 0;
          const isHovered = hoveredRegion === stateId;
          const isHighRisk = risk >= 60;
          const hasData = !!regionData;
          const d = pathGenerator(feature as any) || '';

          return (
            <g key={`path-${stateId}-${idx}`}>
              {/* Subtle glow for high-risk regions */}
              {isHighRisk && hasData && (
                <motion.path
                  d={d}
                  fill={getRiskGlow(risk)}
                  stroke="none"
                  filter="url(#glow-filter)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}

              {/* Main state shape */}
              <motion.path
                d={d}
                fill={hasData ? getRiskFill(risk) : '#f8f9fb'}
                stroke={
                  isHovered && hasData
                    ? getRiskColor(risk)
                    : hasData
                    ? getRiskStroke(risk)
                    : '#dde1e8'
                }
                strokeWidth={isHovered && hasData ? 2 : 0.8}
                style={{
                  cursor: hasData ? 'pointer' : 'default',
                  transition: 'fill 0.3s ease, stroke 0.2s ease, stroke-width 0.2s ease',
                }}
                filter={isHovered && hasData ? 'url(#shadow-filter)' : undefined}
                onClick={() => hasData && onRegionClick(stateId)}
                onMouseMove={(e) => hasData && handleMouseMove(e, stateId)}
                onMouseLeave={() => setHoveredRegion(null)}
              />
            </g>
          );
        })}

        {/* Risk labels on states */}
        {indiaGeoData.features.map((feature, idx) => {
          const stateId = (feature.properties?.name || '').toLowerCase().replace(/ /g, '-');
          const regionData = regionDataMap.get(stateId);
          const centroid = stateCentroids[stateId];
          if (!regionData || !centroid) return null;

          const risk = regionData.bustProbability;

          return (
            <g key={`label-${stateId}-${idx}`} style={{ pointerEvents: 'none' }}>
              {/* Risk percentage */}
              <text
                x={centroid.x}
                y={centroid.y - 4}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  fill: getRiskColor(risk),
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {risk}%
              </text>
              {/* State name */}
              <text
                x={centroid.x}
                y={centroid.y + 10}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: '6.5px',
                  fontWeight: 500,
                  fill: '#475569',
                  letterSpacing: '0.03em',
                }}
              >
                {regionData.name}
              </text>
            </g>
          );
        })}

        {/* Map legend */}
        <text
          x="10"
          y="545"
          style={{
            fontSize: '10px',
            fill: '#94a3b8',
            fontWeight: 500,
          }}
        >
          Forecast Bust Risk — Day {leadDay}
        </text>

        {/* Legend items */}
        <g transform="translate(10, 500)">
          <circle cx="0" cy="0" r="4" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="1" />
          <text x="10" y="3" style={{ fontSize: '8px', fill: '#94a3b8' }}>Low risk (&lt;35%)</text>

          <circle cx="0" cy="15" r="4" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" strokeWidth="1" />
          <text x="10" y="18" style={{ fontSize: '8px', fill: '#94a3b8' }}>Moderate (35–60%)</text>

          <circle cx="0" cy="30" r="4" fill="rgba(239, 68, 68, 0.3)" stroke="#ef4444" strokeWidth="1" />
          <text x="10" y="33" style={{ fontSize: '8px', fill: '#94a3b8' }}>High risk (&gt;60%)</text>
        </g>
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredData && (
          <motion.div
            key={hoveredRegion}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              left: Math.min(tooltipPos.x + 16, 400),
              top: tooltipPos.y - 10,
              background: '#ffffff',
              border: '1px solid #e5e8ed',
              borderRadius: '10px',
              padding: '1rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              pointerEvents: 'none',
              zIndex: 100,
              minWidth: '200px',
            }}
          >
            <div
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '0.625rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {hoveredData.name}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                fontSize: '0.75rem',
              }}
            >
              <div>
                <div
                  style={{
                    color: '#94a3b8',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Bust Risk
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    color: getRiskColor(hoveredData.bustProbability),
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.125rem',
                  }}
                >
                  {hoveredData.bustProbability}%
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: '#94a3b8',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Lead
                </div>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>
                  Day {hoveredData.peakLeadDay}
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: '0.5rem',
                paddingTop: '0.5rem',
                borderTop: '1px solid #f1f3f6',
              }}
            >
              <div
                style={{
                  color: '#94a3b8',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.125rem',
                }}
              >
                Primary Concern
              </div>
              <div style={{ color: '#475569', fontSize: '0.75rem' }}>
                {hoveredData.primaryConcern}
              </div>
            </div>
            <div style={{ marginTop: '0.375rem' }}>
              <div
                style={{
                  color: '#94a3b8',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.125rem',
                }}
              >
                Historical Error
              </div>
              <div
                style={{
                  color: '#475569',
                  fontSize: '0.75rem',
                  textTransform: 'capitalize',
                }}
              >
                {hoveredData.historicalError}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
