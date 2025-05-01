import { MapContainer, TileLayer, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useGetLotes } from '../../hooks/lotes/useGetLotes';
import { useGetEras } from '../../hooks/eras/useGetEras';
import { LatLngTuple } from 'leaflet';
  

const MapComponent = () => {
  const { data: lotes } = useGetLotes();
  const { data: eras } = useGetEras();

  // Función para crear polígonos con validación
  const crearPoligono = (
    latI1: number,
    longI1: number,
    latS1: number,
    longS1: number,
    latI2: number,
    longI2: number,
    latS2: number,
    longS2: number
  ): LatLngTuple[] => {
    return [
      [latI1, longI1], // Esquina inferior izquierda
      [latS1, longS1], // Esquina superior izquierda
      [latS2, longS2], // Esquina superior derecha
      [latI2, longI2], // Esquina inferior derecha
      [latI1, longI1]  // Cierra el polígono
    ];
  };

  return (
    <MapContainer 
      center={[1.892429, -76.089677]} 
      zoom={18} 
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Renderizar Lotes */}
      {lotes?.map((lote) => (
        <Polygon
          key={`lote-${lote.id}`}
          positions={crearPoligono(
            lote.latI1,
            lote.longI1,
            lote.latS1,
            lote.longS1,
            lote.latI2,
            lote.longI2,
            lote.latS2,
            lote.longS2
          )}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg">{lote.nombre}</h3>
              <p className="text-sm">Estado: {lote.estado ? 'Activo' : 'Inactivo'}</p>
            </div>
          </Popup>
        </Polygon>
      ))}

      {/* Renderizar Eras */}
      {eras?.map((era) => (
        <Polygon
          key={`era-${era.id}`}
          positions={crearPoligono(
            era.latI1,
            era.longI1,
            era.latS1,
            era.longS1,
            era.latI2,
            era.longI2,
            era.latS2,
            era.longS2
          )}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">{era.tipo}</h3>
              <p className="text-sm">Lote padre: {era.fk_lote}</p>
            </div>
          </Popup>
        </Polygon>
      ))}
    </MapContainer>
  );
};

export default MapComponent;