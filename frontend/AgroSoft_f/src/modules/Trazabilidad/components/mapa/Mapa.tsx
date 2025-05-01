import { MapContainer, TileLayer, Rectangle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useGetLotes } from '../../hooks/lotes/useGetLotes';
import { useGetEras } from '../../hooks/eras/useGetEras';
import { metersToDegrees } from '@/utilis/configTamMapa';

const MapComponent = () => {
  const { data: lotes } = useGetLotes();
  const { data: eras } = useGetEras();

  const center: [number, number] = [1.892429, -76.089677];

  const renderLotes = lotes?.map((lote) => {
    // Convertir TAMAÑO TOTAL a grados y dividir entre 2
    const halfDeltaLon = metersToDegrees(lote.tamX / 2, lote.posY, true);
    const halfDeltaLat = metersToDegrees(lote.tamY / 2, lote.posY);

    return (
      <Rectangle
        key={lote.id}
        bounds={[
          [lote.posY - halfDeltaLat, lote.posX - halfDeltaLon], // Inferior izquierda
          [lote.posY + halfDeltaLat, lote.posX + halfDeltaLon], // Superior derecha
        ]}
        color="blue"
        fillOpacity={0.2}
      >
        <Popup>Lote: {lote.nombre}</Popup>
      </Rectangle>
    );
  });

  const renderEras = eras?.map((era) => {
    const halfDeltaLon = metersToDegrees(era.tamX / 2, era.posY, true);
    const halfDeltaLat = metersToDegrees(era.tamY / 2, era.posY);

    return (
      <Rectangle
        key={era.id}
        bounds={[
          [era.posY - halfDeltaLat, era.posX - halfDeltaLon],
          [era.posY + halfDeltaLat, era.posX + halfDeltaLon],
        ]}
        color="green"
        fillOpacity={0.4}
      >
        <Popup>Era: {era.tipo}</Popup>
      </Rectangle>
    );
  });

  return (
    <MapContainer center={center} zoom={20} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {renderLotes}
      {renderEras}
    </MapContainer>
  );
};
  
export default MapComponent;