import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { applyStyle } from 'ol-mapbox-style';

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

const overtureLayer = new VectorLayer({
  source: new VectorSource({
    url: 'overture.geojson',
    format: new GeoJSON({ dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' })
  })
});

fetch('overture-style.json')
  .then((r) => r.json())
  .then((style) => applyStyle(overtureLayer, style, 'overture'));

const map = new Map({
  target: 'map',
  layers: [osmLayer, buildingsLayer, roadsLayer, poiLayer, overtureLayer],
  view: new View({
    center: [5591969, 7039499],
    zoom: 17
  })
});

document.getElementById('buildingsToggle').addEventListener('change', (e) => {
  buildingsLayer.setVisible(e.target.checked);
});

document.getElementById('roadsToggle').addEventListener('change', (e) => {
  roadsLayer.setVisible(e.target.checked);
});

document.getElementById('poiToggle').addEventListener('change', (e) => {
  poiLayer.setVisible(e.target.checked);
});

document.getElementById('overtureToggle').addEventListener('change', (e) => {
  overtureLayer.setVisible(e.target.checked);
});

map.on('click', (event) => {
  const coords = event.coordinate;
  console.log('Координаты клика:', coords);
});

console.log('Карта инициализирована. Слои добавлены.');
