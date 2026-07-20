import { motion, useReducedMotion } from 'framer-motion';
import { Compass, Ship } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { JourneyStop } from '../../types';
import { journeyMapPoints, journeyRoutePath } from '../../data/journeyCoordinates';
import { vietnamIslandGroups, type VietnamIslandGroup } from '../../data/vietnamIslands';
import { worldMapPaths } from '../../data/worldMapPaths';
import './VietnamSovereigntyMap.css';

type Props = {
  stops: JourneyStop[];
  activeId: string;
  visitedIds: string[];
  onSelect: (index: number) => void;
};

const keyActivate = (event: React.KeyboardEvent<SVGGElement>, action: () => void) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    action();
  }
};

export default function VietnamSovereigntyMap({ stops, activeId, visitedIds, onSelect }: Props) {
  const reducedMotion = useReducedMotion();
  const mapViewport = useRef<HTMLDivElement>(null);
  const [islandInfo, setIslandInfo] = useState<VietnamIslandGroup | null>(null);
  const [intro, setIntro] = useState(!reducedMotion);
  const points = useMemo(() => stops.map((stop) => journeyMapPoints.find((point) => point.id === stop.id)).filter((point): point is NonNullable<typeof point> => Boolean(point)), [stops]);
  const activePoint = journeyMapPoints.find((point) => point.id === activeId) ?? journeyMapPoints[0]!;

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setTimeout(() => setIntro(false), 7200);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    const viewport = mapViewport.current;
    if (!viewport || window.innerWidth > 520) return;
    viewport.scrollLeft = viewport.scrollWidth - viewport.clientWidth;
  }, []);

  const selectStop = (index: number) => {
    setIntro(false);
    onSelect(index);
  };

  return (
    <div className="sovereignty-map" data-testid="sovereignty-map">
      <div ref={mapViewport} className="map-scroll">
      <div className="map-canvas">
      <svg viewBox="0 0 1200 680" role="img" aria-labelledby="journey-map-title journey-map-description" preserveAspectRatio="xMidYMid meet">
        <title id="journey-map-title">Bản đồ minh họa hành trình từ Bến Nhà Rồng</title>
        <desc id="journey-map-description">Bản đồ hàng hải cách điệu với bảy địa điểm hành trình, Việt Nam, Biển Đông, quần đảo Hoàng Sa và quần đảo Trường Sa thuộc Việt Nam.</desc>
        <defs>
          <radialGradient id="seaGlow" cx="78%" cy="60%" r="52%"><stop offset="0" stopColor="#214d54"/><stop offset="1" stopColor="#071c21"/></radialGradient>
          <pattern id="paperGrainMap" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="3" cy="5" r=".7" fill="#e1c58a" opacity=".08"/><circle cx="17" cy="14" r=".5" fill="#fff" opacity=".05"/></pattern>
          <filter id="mapShadow"><feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#020a0c" floodOpacity=".45"/></filter>
        </defs>
        <rect width="1200" height="680" fill="url(#seaGlow)"/>
        <rect width="1200" height="680" fill="url(#paperGrainMap)"/>
        <g className="map-grid" aria-hidden="true">
          {[120, 280, 440, 600, 760, 920, 1080].map((x) => <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="680"/>)}
          {[110, 230, 350, 470, 590].map((y) => <line key={`h-${y}`} x1="0" y1={y} x2="1200" y2={y}/>)}
        </g>
        <g className="landmasses" filter="url(#mapShadow)">
          {worldMapPaths.map((land) => <path key={land.id} className={land.className} d={land.d}/>)}
        </g>
        <g className="region-labels" aria-hidden="true">
          {worldMapPaths.filter((land) => land.label).map((land) => <text key={`label-${land.id}`} x={land.label!.x} y={land.label!.y}>{land.label!.text}</text>)}
          <text className="sea-label" x="1030" y="575">BIỂN ĐÔNG</text>
          <text className="ocean-label" x="602" y="566">ẤN ĐỘ DƯƠNG</text>
          <text className="ocean-label" x="235" y="274">ĐỊA TRUNG HẢI</text>
        </g>
        <g className="compass-rose" transform="translate(96 570)" aria-hidden="true">
          <circle r="47"/><circle r="36"/><path d="M0-31 8-8 0 0-8-8ZM0 31 8 8 0 0-8 8ZM-31 0-8 8 0 0-8-8ZM31 0 8 8 0 0 8-8Z"/><text x="0" y="-53">B</text>
        </g>
        <path className="route-ghost" d={journeyRoutePath}/>
        <motion.path className="route-active" d={journeyRoutePath} initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reducedMotion ? 0 : 4.8, ease: 'easeInOut' }}/>
        <motion.g
          className="route-ship"
          initial={false}
          animate={intro ? { x: points.map((point) => point.x), y: points.map((point) => point.y) } : { x: activePoint.x, y: activePoint.y }}
          transition={intro ? { duration: 6.8, times: points.map((_, index) => index / Math.max(1, points.length - 1)), ease: 'easeInOut' } : { duration: reducedMotion ? 0 : .7, ease: 'easeInOut' }}
        >
          <circle r="19"/><Ship x="-11" y="-11" width="22" height="22"/>
        </motion.g>
        <g className="journey-markers">
          {stops.map((stop, index) => {
            const point = journeyMapPoints.find((entry) => entry.id === stop.id);
            if (!point) return null;
            const active = stop.id === activeId;
            const visited = visitedIds.includes(stop.id);
            return <g key={stop.id} role="button" tabIndex={0} aria-label={`Mở địa điểm ${stop.name}`} aria-pressed={active} className={`journey-marker ${active ? 'active' : ''} ${visited ? 'visited' : ''}`} transform={`translate(${point.x} ${point.y})`} onClick={() => selectStop(index)} onKeyDown={(event) => keyActivate(event, () => selectStop(index))}>
              <title>{`${stop.order}. ${stop.name} — ${stop.date}`}</title>
              <circle className="marker-pulse" r="17"/><circle className="marker-core" r="10"/><text className="marker-number" y="4">{stop.order}</text>
              <text className="marker-label" x={point.labelX - point.x} y={point.labelY - point.y} textAnchor={point.anchor ?? 'start'}>{point.label}</text>
            </g>;
          })}
        </g>
        <g className="vietnam-islands">
          {vietnamIslandGroups.map((island) => <g key={island.id} role="button" tabIndex={0} aria-label={`${island.label}, ${island.nation}. Mở thông tin`} className="island-hotspot" transform={`translate(${island.x} ${island.y})`} onClick={() => setIslandInfo(island)} onKeyDown={(event) => keyActivate(event, () => setIslandInfo(island))}>
            <title>{`${island.label} — ${island.nation}`}</title>
            <circle cx="0" cy="0" r="3"/><circle cx="10" cy="-7" r="2.5"/><circle cx="-8" cy="9" r="2"/><path d="M-14-12 16 13M-13 14 15-13"/>
            <text className="island-label" x="-18" y="-22" textAnchor="end"><tspan x="-18">{island.label}</tspan><tspan className="island-nation" x="-18" dy="16">{island.nation}</tspan></text>
          </g>)}
        </g>
        {islandInfo && <g className="island-tooltip" transform={`translate(${Math.min(islandInfo.x - 335, 805)} ${islandInfo.y + 18})`} role="status">
          <rect width="320" height="68" rx="4"/>
          <text x="16" y="25"><tspan x="16">{islandInfo.message.replace(' của lãnh thổ Việt Nam.', '')}</tspan>{' '}<tspan x="16" dy="20">của lãnh thổ Việt Nam.</tspan></text>
        </g>}
        <g className="map-cartouche" transform="translate(32 28)" aria-hidden="true"><rect width="326" height="57"/><text x="18" y="24">HẢI ĐỒ HÀNH TRÌNH</text><text className="cartouche-sub" x="18" y="43">BẾN NHÀ RỒNG · 05.06.1911</text></g>
      </svg>
      </div>
      </div>
      <div className="map-legend"><span><i className="legend-route"/>Hành trình tiêu biểu</span><span><i className="legend-visited"/>Đã khám phá</span><span><Compass/>Bản đồ minh họa</span></div>
      <p className="sovereignty-note">Hoàng Sa và Trường Sa là của Việt Nam.</p>
    </div>
  );
}
