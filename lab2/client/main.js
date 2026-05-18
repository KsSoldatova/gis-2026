import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';

// Функция для создания WMS слоя
function createWMSLayer(layerName, visible = true) {
  return new ImageLayer({
    visible: visible,
    source: new ImageWMS({
      url: 'http://localhost:8080/geoserver/gis/wms',
      params: {
        'LAYERS': `gis:${layerName}`,
        'TILED': true,
        'FORMAT': 'image/png',
        'TRANSPARENT': true
      },
      ratio: 1,
      serverType: 'geoserver'
    })
  });
}

const osmLayer = new TileLayer({ source: new OSM() });
const buildingsLayer = createWMSLayer('buildings', true);
const roadsLayer = createWMSLayer('roads', true);
const poiLayer = createWMSLayer('poi', true);

// Создаем карту со всеми слоями сразу
const map = new Map({
  target: 'map',
  layers: [osmLayer, buildingsLayer, roadsLayer, poiLayer],
  view: new View({
    center: [5591969, 7039499],
    zoom: 17
  })
});

// Добавляем управление видимостью слоев
document.getElementById('buildingsToggle').addEventListener('change', (e) => {
  buildingsLayer.setVisible(e.target.checked);
});

document.getElementById('roadsToggle').addEventListener('change', (e) => {
  roadsLayer.setVisible(e.target.checked);
});

document.getElementById('poiToggle').addEventListener('change', (e) => {
  poiLayer.setVisible(e.target.checked);
});

// Выводим координаты при клике на карту (для отладки)
map.on('click', (event) => {
  const coords = event.coordinate;
  console.log('Координаты клика:', coords);
});

console.log('Карта инициализирована. Слои добавлены.');
