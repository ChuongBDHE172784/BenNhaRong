import * as trackasiagl from 'trackasia-gl';
import 'trackasia-gl/dist/trackasia-gl.css';
import { LocateFixed, Route, Ship, TriangleAlert } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { JourneyStop } from '../../types';
import { createTrackAsiaStyleUrl, trackAsiaProvider } from '../../config/mapProvider';
import { vietnamViewBounds } from '../../data/vietnamSovereigntyLocations';
import { createVietnamSovereigntyLayer } from './VietnamSovereigntyLayer';
import './InteractiveJourneyMap.css';

type Props = {
  stops: JourneyStop[];
  activeId: string;
  visitedIds: string[];
  apiKey: string;
  onSelect: (index: number) => void;
};

type MarkerRecord = { id: string; marker: trackasiagl.Marker; element: HTMLButtonElement };

const routeSourceId = 'journey-route-source';
const routeLayerId = 'journey-route-line';
const routeGlowLayerId = 'journey-route-glow';

function coordinatesFor(stops: JourneyStop[]): [number, number][];
function coordinatesFor(stops: JourneyStop[]): [number, number][] {
  return stops.map((stop) => [stop.coordinates[1], stop.coordinates[0]]);
}

function routeData(coordinates: [number, number][]) {
  return {
    type: 'Feature' as const,
    properties: {},
    geometry: { type: 'LineString' as const, coordinates }
  };
}

function fitJourney(map: trackasiagl.Map, stops: JourneyStop[], reducedMotion: boolean) {
  const coordinates = coordinatesFor(stops);
  if (!coordinates.length) return;
  const bounds = coordinates.slice(1).reduce(
    (current, point) => current.extend(point),
    new trackasiagl.LngLatBounds(coordinates[0], coordinates[0])
  );
  map.fitBounds(bounds, { padding: 72, maxZoom: 4.4, duration: reducedMotion ? 0 : 1100 });
}

function createJourneyMarker(stop: JourneyStop, index: number, onSelect: (index: number) => void) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'journey-map-marker';
  button.dataset.stopId = stop.id;
  button.dataset.testid = 'journey-map-marker';
  button.setAttribute('aria-label', `Mở địa điểm ${stop.name}`);
  button.innerHTML = `<span aria-hidden="true">${stop.order}</span>`;
  button.addEventListener('click', () => onSelect(index));
  return {
    element: button,
    marker: new trackasiagl.Marker({ element: button, anchor: 'center' })
      .setLngLat([stop.coordinates[1], stop.coordinates[0]])
  };
}

export default function InteractiveJourneyMap({ stops, activeId, visitedIds, apiKey, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<trackasiagl.Map | null>(null);
  const onSelectRef = useRef(onSelect);
  const markerRecordsRef = useRef<MarkerRecord[]>([]);
  const shipRef = useRef<trackasiagl.Marker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!containerRef.current || !apiKey || stops.length === 0) return;

    const map = new trackasiagl.Map({
      container: containerRef.current,
      style: createTrackAsiaStyleUrl(apiKey),
      center: [52, 24],
      zoom: 2,
      minZoom: trackAsiaProvider.minZoom,
      maxZoom: trackAsiaProvider.maxZoom,
      attributionControl: { compact: true, customAttribution: trackAsiaProvider.attribution },
      dragRotate: false,
      pitchWithRotate: false
    });
    mapRef.current = map;
    map.addControl(new trackasiagl.NavigationControl({ showCompass: false, showZoom: true }), 'top-right');

    let removeSovereigntyLayer: () => void = () => undefined;
    const handleError = (e: any) => {
      console.error('[map:error]', e);
      setLoading(false);
      setError('Không thể tải bản đồ TrackAsia. Hãy kiểm tra API key, giới hạn tên miền và kết nối mạng.');
    };

    map.on('error', handleError);
    map.on('load', () => {
      setLoading(false);
      setError('');
      const fullRoute = coordinatesFor(stops);
      const initialRoute = reducedMotion ? fullRoute : [fullRoute[0], fullRoute[0]];

      map.addSource(routeSourceId, { type: 'geojson', data: routeData(initialRoute) });
      map.addLayer({
        id: routeGlowLayerId,
        type: 'line',
        source: routeSourceId,
        paint: { 'line-color': '#1a0907', 'line-width': 8, 'line-opacity': 0.52, 'line-blur': 3 }
      });
      map.addLayer({
        id: routeLayerId,
        type: 'line',
        source: routeSourceId,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#d8ad59', 'line-width': 3.5, 'line-dasharray': [1.5, 2.2] }
      });

      markerRecordsRef.current = stops.map((stop, index) => {
        const record = createJourneyMarker(stop, index, (nextIndex) => onSelectRef.current(nextIndex));
        record.marker.addTo(map);
        return { id: stop.id, ...record };
      });
      removeSovereigntyLayer = createVietnamSovereigntyLayer(map);

      const shipElement = document.createElement('div');
      shipElement.className = 'journey-ship-marker';
      shipElement.setAttribute('aria-label', 'Vị trí con tàu trên hành trình');
      shipElement.innerHTML = '<span aria-hidden="true">⚓</span>';
      shipRef.current = new trackasiagl.Marker({ element: shipElement, anchor: 'center' })
        .setLngLat(fullRoute[0])
        .addTo(map);

      fitJourney(map, stops, reducedMotion);

      if (reducedMotion) return;
      const source = map.getSource(routeSourceId) as trackasiagl.GeoJSONSource;
      const segmentDuration = 900;
      const startedAt = performance.now();
      const drawRoute = (now: number) => {
        const progress = Math.min((now - startedAt) / (segmentDuration * (fullRoute.length - 1)), 1);
        const scaled = progress * (fullRoute.length - 1);
        const segment = Math.min(Math.floor(scaled), fullRoute.length - 2);
        const within = scaled - segment;
        const start = fullRoute[segment];
        const end = fullRoute[segment + 1];
        const current: [number, number] = [
          start[0] + (end[0] - start[0]) * within,
          start[1] + (end[1] - start[1]) * within
        ];
        source.setData(routeData([...fullRoute.slice(0, segment + 1), current]));
        shipRef.current?.setLngLat(current);
        if (progress < 1) animationFrameRef.current = requestAnimationFrame(drawRoute);
      };
      animationFrameRef.current = requestAnimationFrame(drawRoute);
    });

    return () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
      markerRecordsRef.current.forEach(({ marker }) => marker.remove());
      markerRecordsRef.current = [];
      shipRef.current?.remove();
      shipRef.current = null;
      removeSovereigntyLayer();
      map.remove();
      mapRef.current = null;
    };
  }, [apiKey, reducedMotion, stops]);

  useEffect(() => {
    markerRecordsRef.current.forEach(({ id, element }) => {
      element.classList.toggle('is-active', id === activeId);
      element.classList.toggle('is-visited', visitedIds.includes(id));
      element.setAttribute('aria-pressed', String(id === activeId));
    });
    const activeStop = stops.find((stop) => stop.id === activeId);
    if (activeStop && shipRef.current) {
      const activeCoordinates: [number, number] = [activeStop.coordinates[1], activeStop.coordinates[0]];
      shipRef.current.setLngLat(activeCoordinates);
      mapRef.current?.flyTo({ center: activeCoordinates, zoom: Math.max(mapRef.current.getZoom(), 4.5), duration: reducedMotion ? 0 : 750 });
    }
  }, [activeId, reducedMotion, stops, visitedIds]);

  if (stops.length === 0) {
    return <div className="journey-map-empty" role="status"><Ship/>Chưa có địa điểm hành trình để hiển thị.</div>;
  }

  return (
    <section className="interactive-map-shell" aria-label="Bản đồ tương tác hành trình lịch sử" data-reduced-motion={reducedMotion ? 'true' : 'false'}>
      <div className="interactive-map-stage">
        <div ref={containerRef} className="interactive-map-canvas" data-testid="interactive-journey-map"/>
        {loading && <div className="journey-map-status" role="status"><span className="map-loader"/>Đang tải bản đồ TrackAsia…</div>}
        {error && <div className="journey-map-error" role="alert"><TriangleAlert/><span>{error}</span></div>}
        <div className="journey-map-actions" aria-label="Điều khiển góc nhìn bản đồ">
          <button type="button" onClick={() => mapRef.current && fitJourney(mapRef.current, stops, reducedMotion)}><Route/>Xem toàn bộ hành trình</button>
          <button type="button" onClick={() => mapRef.current?.fitBounds(vietnamViewBounds, { padding: 46, maxZoom: 5.2, duration: reducedMotion ? 0 : 900 })}><LocateFixed/>Về Việt Nam</button>
        </div>
      </div>
      <p className="interactive-sovereignty-note">Hoàng Sa và Trường Sa là của Việt Nam.</p>
    </section>
  );
}
