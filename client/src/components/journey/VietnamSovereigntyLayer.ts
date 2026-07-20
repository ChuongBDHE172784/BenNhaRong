import * as vietmapgl from '@vietmap/vietmap-gl-js/dist/vietmap-gl';
import { vietnamSovereigntyLocations } from '../../data/vietnamSovereigntyLocations';

export function createVietnamSovereigntyLayer(map: vietmapgl.Map): () => void {
  const markers = vietnamSovereigntyLocations.map((location) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'sovereignty-marker';
    button.title = location.description;
    button.setAttribute('aria-label', `${location.name}, ${location.country}. Mở thông tin`);

    const cluster = document.createElement('span');
    cluster.className = 'sovereignty-marker__cluster';
    cluster.setAttribute('aria-hidden', 'true');
    cluster.innerHTML = '<i></i><i></i><i></i>';

    const label = document.createElement('span');
    label.className = 'sovereignty-marker__label';
    const name = document.createElement('strong');
    name.textContent = location.name;
    const country = document.createElement('em');
    country.textContent = location.country;
    label.append(name, country);
    button.append(cluster, label);

    const popupContent = document.createElement('article');
    popupContent.className = 'sovereignty-popup';
    const title = document.createElement('h3');
    title.textContent = location.name;
    const nation = document.createElement('strong');
    nation.textContent = location.country;
    const description = document.createElement('p');
    description.textContent = location.description;
    popupContent.append(title, nation, description);

    const popup = new vietmapgl.Popup({
      className: 'journey-map-popup',
      closeButton: true,
      closeOnClick: false,
      maxWidth: '320px',
      offset: 24
    }).setDOMContent(popupContent);

    const marker = new vietmapgl.Marker({ element: button, anchor: 'bottom' })
      .setLngLat([location.longitude, location.latitude])
      .setPopup(popup)
      .addTo(map);

    return marker;
  });

  return () => markers.forEach((marker) => marker.remove());
}
