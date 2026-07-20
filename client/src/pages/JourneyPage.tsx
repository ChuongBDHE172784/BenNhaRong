import { ArrowLeft, ArrowRight, Check, Navigation } from 'lucide-react';
import { useState } from 'react';
import InteractiveJourneyMap from '../components/journey/InteractiveJourneyMap';
import VietnamSovereigntyMap from '../components/journey/VietnamSovereigntyMap';
import { readMapApiKey } from '../config/mapProvider';
import { useApi } from '../hooks/useApi';
import type { JourneyStop } from '../types';
import { useProgress } from '../context/ProgressContext';
import { ErrorState, ImageWithFallback, Loading, SectionTitle } from '../components/Ui';

export default function JourneyPage() {
  const { data, error, loading } = useApi<JourneyStop[]>('/journey');
  const [index, setIndex] = useState(0);
  const { progress, mark } = useProgress();
  const stop = data?.[index];
  const mapApiKey = readMapApiKey();

  const select = (nextIndex: number) => {
    setIndex(nextIndex);
    const target = data?.[nextIndex];
    if (target) {
      mark('journeyStops', target.id);
      if (progress.journeyStops.length >= 6) mark('badges', 'navigator');
    }
  };

  if (loading) return <div className="page-state"><Loading label="Đang trải bản đồ…"/></div>;
  if (error || !data) return <div className="page-state"><ErrorState message={error || 'Không có dữ liệu'}/></div>;

  return <div className="journey-page">
    <div className="journey-intro"><SectionTitle light eyebrow="HẢI TRÌNH TƯƠNG TÁC" title="Từ dòng sông ra thế giới" text="Bản đồ minh họa các địa điểm tiêu biểu được tư liệu ghi nhận; không mô tả một tuyến đường tuyệt đối đầy đủ."/></div>
    <div className="journey-layout">
      <aside className="stop-list" aria-label="Danh sách địa điểm">
        {data.map((item, itemIndex) => <button key={item.id} className={itemIndex === index ? 'active' : ''} onClick={() => select(itemIndex)} aria-current={itemIndex === index ? 'step' : undefined}>
          <span>{String(item.order).padStart(2, '0')}</span><div><b>{item.name}</b><small>{item.date}</small></div>{progress.journeyStops.includes(item.id) && <Check/>}
        </button>)}
      </aside>
      <div className="map-wrap">
        {mapApiKey ? (
          <InteractiveJourneyMap stops={data} activeId={stop?.id ?? data[0]!.id} visitedIds={progress.journeyStops} apiKey={mapApiKey} onSelect={select}/>
        ) : (
          <div className="map-configuration-fallback">
            <div className="map-configuration-notice" role="alert">
              <strong>Bản đồ tương tác chưa được cấu hình.</strong>
              <span>Thêm <code>VITE_TRACKASIA_API_KEY</code> vào <code>client/.env</code> rồi khởi động lại Vite. Website không tự chuyển sang nguồn bản đồ khác.</span>
            </div>
            <VietnamSovereigntyMap stops={data} activeId={stop?.id ?? data[0]!.id} visitedIds={progress.journeyStops} onSelect={select}/>
          </div>
        )}
      </div>
      {stop && <aside className="stop-panel" aria-live="polite">
        <div className="sheet-handle" aria-hidden="true"/>
        <ImageWithFallback src={stop.image} alt={stop.name}/>
        <div><span className="overline">CHẶNG {stop.order} · {stop.date}</span><h2>{stop.name}</h2><p>{stop.summary}</p><blockquote>{stop.significance}</blockquote><small>Nguồn tham khảo: {stop.sourceId}</small><div className="panel-nav"><button disabled={index === 0} onClick={() => select(index - 1)}><ArrowLeft/> Trước</button><button disabled={index === data.length - 1} onClick={() => select(index + 1)}>Sau <ArrowRight/></button></div></div>
      </aside>}
    </div>
    <div className="mobile-stop-dots" aria-label="Chọn nhanh địa điểm">{data.map((item, itemIndex) => <button aria-label={`Mở ${item.name}`} className={itemIndex === index ? 'active' : ''} onClick={() => select(itemIndex)} key={item.id}><Navigation/></button>)}</div>
  </div>;
}
