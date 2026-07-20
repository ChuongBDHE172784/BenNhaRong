// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import JourneyPage from './JourneyPage';
import { ProgressProvider } from '../context/ProgressContext';
import type { JourneyStop } from '../types';

vi.mock('trackasia-gl', () => {
  class MockBounds {
    extend() { return this; }
  }

  class MockSource {
    data: unknown;
    constructor(data: unknown) { this.data = data; }
    setData(data: unknown) { this.data = data; return this; }
  }

  class MockMap {
    container: HTMLElement;
    source = new MockSource(null);
    scenario: 'normal' | 'fatal' | 'transient' | 'late-tile' | 'late-sprite' | 'timeout';
    handlers = new Map<string, (event?: unknown) => void>();
    constructor(options: { container: HTMLElement; style: string }) {
      this.container = options.container;
      this.scenario = options.style.includes('invalid-ui-key') ? 'fatal'
        : options.style.includes('transient-ui-key') ? 'transient'
          : options.style.includes('late-tile-error-key') ? 'late-tile'
            : options.style.includes('late-sprite-error-key') ? 'late-sprite'
              : options.style.includes('timeout-ui-key') ? 'timeout'
                : 'normal';
    }
    addControl() { return this; }
    on(event: string, callback: (event?: unknown) => void) {
      this.handlers.set(event, callback);
      if (event === 'error' && (this.scenario === 'fatal' || this.scenario === 'transient')) {
        queueMicrotask(() => callback({
          resourceType: 'Style',
          error: { status: 403, url: 'https://maps.track-asia.com/styles/v2/streets.json?key=redacted-test-key', message: 'HTTP status 403 while loading style' }
        }));
      }
      if (event === 'load' && this.scenario !== 'fatal' && this.scenario !== 'timeout') {
        queueMicrotask(() => {
          callback();
          if (this.scenario === 'late-tile') queueMicrotask(() => this.handlers.get('error')?.({
            resourceType: 'Tile',
            error: { status: 403, url: 'https://tiles.track-asia.com/2/3/1.pbf?key=late-tile-error-key', message: 'HTTP status 403 while loading tile' }
          }));
          if (this.scenario === 'late-sprite') queueMicrotask(() => this.handlers.get('error')?.({
            resourceType: 'SpriteImage',
            error: { status: 404, url: 'https://maps.track-asia.com/mapstyle/sprite.png?key=late-sprite-error-key', message: 'HTTP status 404 while loading sprite' }
          }));
        });
      }
      return this;
    }
    addSource(_id: string, source: { data: unknown }) { this.source = new MockSource(source.data); return this; }
    addLayer() { return this; }
    getSource() { return this.source; }
    getStyle() { return { sources: { composite: {} } }; }
    getZoom() { return 2; }
    isSourceLoaded() { return this.scenario !== 'timeout'; }
    isStyleLoaded() { return this.scenario !== 'fatal' && this.scenario !== 'timeout'; }
    areTilesLoaded() { return this.scenario !== 'timeout'; }
    fitBounds() { return this; }
    flyTo() { return this; }
    remove() { this.container.replaceChildren(); }
  }

  class MockPopup {
    content: Node | null = null;
    setDOMContent(content: Node) { this.content = content; return this; }
  }

  class MockMarker {
    element: HTMLElement;
    popup: MockPopup | null = null;
    map: MockMap | null = null;
    constructor(options?: { element?: HTMLElement }) { this.element = options?.element ?? document.createElement('div'); }
    setLngLat() { return this; }
    setPopup(popup: MockPopup) {
      this.popup = popup;
      this.element.addEventListener('click', () => {
        if (this.popup?.content && this.map) this.map.container.append(this.popup.content);
      });
      return this;
    }
    addTo(map: MockMap) { this.map = map; map.container.append(this.element); return this; }
    remove() { this.element.remove(); return this; }
  }

  return {
    Map: MockMap,
    Marker: MockMarker,
    Popup: MockPopup,
    NavigationControl: class {},
    LngLatBounds: MockBounds
  };
});

const stops: JourneyStop[] = [
  ['saigon', 'Bến Nhà Rồng, Sài Gòn', 10.7682, 106.7068],
  ['singapore', 'Singapore', 1.264, 103.82],
  ['colombo', 'Colombo, Sri Lanka', 6.9271, 79.8612],
  ['portsaid', 'Port Said, Ai Cập', 31.2653, 32.3019],
  ['marseille-stop', 'Marseille, Pháp', 43.2965, 5.3698],
  ['paris', 'Paris, Pháp', 48.8566, 2.3522],
  ['pacbo', 'Pác Bó, Cao Bằng', 22.9747, 106.0518]
].map(([id, name, latitude, longitude], index) => ({
  id: String(id),
  order: index + 1,
  name: String(name),
  date: '1911',
  coordinates: [Number(latitude), Number(longitude)],
  summary: 'Tóm tắt',
  significance: 'Ý nghĩa',
  image: '',
  sourceId: 'source'
}));

const matchMediaMock = (matches: boolean) => (query: string) => ({
  matches,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn()
});

function textFiles(root: string): string[] {
  if (!statSync(root, { throwIfNoEntry: false })) return [];
  return readdirSync(root, { recursive: true })
    .map(String)
    .filter((file) => /\.(tsx?|css|html|json|md)$/i.test(file) && !file.endsWith('.test.tsx'))
    .map((file) => join(root, file));
}

function renderJourney() {
  return render(<ProgressProvider><JourneyPage/></ProgressProvider>);
}

describe('bản đồ hành trình TrackAsia', () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window, 'matchMedia', { writable: true, value: vi.fn().mockImplementation(matchMediaMock(false)) });
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: stops, total: 7 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })));
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    window.history.replaceState({}, '', '/');
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('render bản đồ tương tác với đủ marker, lớp chủ quyền và hai control', async () => {
    vi.stubEnv('VITE_TRACKASIA_API_KEY', 'test-key');
    renderJourney();

    expect(await screen.findByTestId('interactive-journey-map')).toBeInTheDocument();
    expect(await screen.findAllByRole('button', { name: /^Mở địa điểm/ })).toHaveLength(7);
    expect(screen.getByRole('button', { name: 'Quần đảo Hoàng Sa, Việt Nam. Mở thông tin' })).toHaveTextContent('Việt Nam');
    expect(screen.getByRole('button', { name: 'Quần đảo Trường Sa, Việt Nam. Mở thông tin' })).toHaveTextContent('Việt Nam');
    expect(screen.getByRole('button', { name: 'Xem toàn bộ hành trình' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Về Việt Nam' })).toBeInTheDocument();
    expect(screen.getByText('Hoàng Sa và Trường Sa là của Việt Nam.')).toBeInTheDocument();
  });

  it('mở popup chủ quyền bằng click', async () => {
    vi.stubEnv('VITE_TRACKASIA_API_KEY', 'test-key');
    renderJourney();
    fireEvent.click(await screen.findByRole('button', { name: 'Quần đảo Hoàng Sa, Việt Nam. Mở thông tin' }));
    expect(screen.getByText('Quần đảo Hoàng Sa là bộ phận không thể tách rời của lãnh thổ Việt Nam.')).toBeInTheDocument();
  });

  it('click marker cập nhật panel và tiến độ hộ chiếu', async () => {
    vi.stubEnv('VITE_TRACKASIA_API_KEY', 'test-key');
    renderJourney();
    fireEvent.click(await screen.findByRole('button', { name: 'Mở địa điểm Singapore' }));
    expect(screen.getByRole('heading', { name: 'Singapore' })).toBeInTheDocument();
    await waitFor(() => expect(JSON.parse(localStorage.getItem('ben-nha-rong-progress-v1') ?? '{}').journeyStops).toContain('singapore'));
  });

  it('tắt animation phức tạp khi người dùng yêu cầu giảm chuyển động', async () => {
    vi.stubEnv('VITE_TRACKASIA_API_KEY', 'test-key');
    Object.defineProperty(window, 'matchMedia', { writable: true, value: vi.fn().mockImplementation(matchMediaMock(true)) });
    renderJourney();
    const map = await screen.findByLabelText('Bản đồ tương tác hành trình lịch sử');
    expect(map).toHaveAttribute('data-reduced-motion', 'true');
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('thiếu API key hiển thị hướng dẫn và chỉ dùng fallback SVG nội bộ', async () => {
    vi.stubEnv('VITE_TRACKASIA_API_KEY', '');
    renderJourney();
    expect(await screen.findByText('Bản đồ tương tác chưa được cấu hình.')).toBeInTheDocument();
    expect(screen.getByTestId('sovereignty-map')).toBeInTheDocument();
    expect(screen.queryByTestId('interactive-journey-map')).not.toBeInTheDocument();
    expect(screen.getByText('Quần đảo Hoàng Sa')).toBeInTheDocument();
    expect(screen.getByText('Quần đảo Trường Sa')).toBeInTheDocument();
  });

  it('API key sai hiển thị error state và không đổi provider', async () => {
    vi.stubEnv('VITE_TRACKASIA_API_KEY', 'invalid-ui-key');
    renderJourney();
    expect(await screen.findByRole('alert')).toHaveTextContent('Không thể tải bản đồ TrackAsia');
    expect(screen.getByTestId('interactive-journey-map')).toBeInTheDocument();
    expect(screen.queryByTestId('sovereignty-map')).not.toBeInTheDocument();
  });

  it('map load thành công sau lỗi tạm thời sẽ xóa error banner', async () => {
    vi.stubEnv('VITE_TRACKASIA_API_KEY', 'transient-ui-key');
    renderJourney();
    const map = await screen.findByLabelText('Bản đồ tương tác hành trình lịch sử');
    await waitFor(() => expect(map).toHaveAttribute('data-map-state', 'ready'));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByText(/Bản đồ nền tải chưa đầy đủ/)).not.toBeInTheDocument();
  });

  it('lỗi tile phụ sau khi ready chỉ chuyển degraded và không che bản đồ', async () => {
    vi.stubEnv('VITE_TRACKASIA_API_KEY', 'late-tile-error-key');
    renderJourney();
    const warning = await screen.findByText(/Bản đồ nền tải chưa đầy đủ \(tile · tiles\.track-asia\.com\)/);
    expect(warning.closest('.journey-map-warning')).toBeInTheDocument();
    expect(screen.getByLabelText('Bản đồ tương tác hành trình lịch sử')).toHaveAttribute('data-map-state', 'degraded');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('chỉ chuyển failed sau timeout nếu style không tải', async () => {
    vi.useFakeTimers();
    vi.stubEnv('VITE_TRACKASIA_API_KEY', 'timeout-ui-key');
    renderJourney();
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });
    expect(screen.getByTestId('interactive-journey-map')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(15_000));
    expect(screen.getByRole('alert')).toHaveTextContent('Không thể tải bản đồ TrackAsia');
    expect(screen.getByLabelText('Bản đồ tương tác hành trình lịch sử')).toHaveAttribute('data-map-state', 'failed');
  });

  it('mapDebug chỉ hiển thị diagnostic đã redact', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    window.history.replaceState({}, '', '/journey?mapDebug=1');
    vi.stubEnv('VITE_TRACKASIA_API_KEY', 'late-sprite-error-key');
    renderJourney();
    const panel = await screen.findByTestId('map-debug-panel');
    await waitFor(() => expect(panel).toHaveTextContent('degraded'));
    expect(panel).toHaveTextContent('maps.track-asia.com');
    expect(panel).not.toHaveTextContent('late-sprite-error-key');
    expect(panel.textContent).not.toContain('?key=');
    expect(JSON.stringify(warn.mock.calls)).not.toContain('late-sprite-error-key');
    warn.mockRestore();
  });

  it('không chứa URL nền cũ hoặc nhà cung cấp ngoài danh sách cho phép', () => {
    const roots = [join(process.cwd(), 'src'), join(process.cwd(), '..', 'server', 'src')];
    const productionText = roots.flatMap(textFiles).map((file) => readFileSync(file, 'utf8')).join('\n').toLocaleLowerCase('vi');
    const forbidden = [
      ['tile', '.', 'openstreetmap', '.', 'org'].join(''),
      ['maps', '.', 'googleapis', '.', 'com'].join(''),
      ['virtualearth', '.', 'net'].join(''),
      ['api', '.', 'mapbox', '.', 'com'].join(''),
      ['maps', '.', 'hereapi', '.', 'com'].join('')
    ];
    forbidden.forEach((term) => expect(productionText).not.toContain(term));
  });

  it('giới hạn overflow trong map để mobile không làm tràn toàn trang', () => {
    const css = readFileSync(join(process.cwd(), 'src', 'components', 'journey', 'InteractiveJourneyMap.css'), 'utf8');
    expect(css).toMatch(/\.interactive-map-shell\s*\{[^}]*overflow:\s*hidden/s);
    expect(css).toMatch(/\.interactive-map-stage\s*\{[^}]*overflow:\s*hidden/s);
    expect(css).toContain('@media (max-width: 900px)');
    expect(css).toContain('@media (max-width: 520px)');
  });
});
