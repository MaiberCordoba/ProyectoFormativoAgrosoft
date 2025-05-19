import { MapContainer, TileLayer, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useGetLotes } from '../../hooks/lotes/useGetLotes';
import { useGetEras } from '../../hooks/eras/useGetEras';
import { LatLngTuple } from 'leaflet';

interface MapComponentProps {
  filtroEspecie?: string; // ID de la especie para filtrar
}

const MapComponent = ({ filtroEspecie }: MapComponentProps) => {
  const { data: lotes } = useGetLotes();
  const { data: eras } = useGetEras();

  // Filtrar eras basado en el filtro
  const erasFiltradas = eras?.filter((era) => {
    if (!filtroEspecie) return true;
    const especieEra = era.plantaciones?.[0]?.fk_Cultivo?.fk_Semillero?.fk_especie;
    return especieEra?.id?.toString() === filtroEspecie;
  });

  // Crear polígonos
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
      [latI1, longI1],
      [latS1, longS1],
      [latS2, longS2],
      [latI2, longI2],
      [latI1, longI1],
    ];
  };

  return (
    <MapContainer
      center={[1.892429, -76.089677]}
      zoom={18}
      style={{ height: '100%', width: '100%', zIndex: 0 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* Lotes - Azul */}
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
          pathOptions={{ color: 'blue', weight: 2, fillOpacity: 0.2 }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg">{lote.nombre}</h3>
              <p className="text-sm">
                Estado: {lote.estado ? 'Activo' : 'Inactivo'}
              </p>
            </div>
          </Popup>
        </Polygon>
      ))}

      {/* Eras - Verde */}
      {erasFiltradas?.map((era) => {
        const cultivo = era.plantaciones?.[0]?.fk_Cultivo;
        const semillero = cultivo?.fk_Semillero;
        const especie = semillero?.fk_especie;

        return (
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
            pathOptions={{ color: 'green', weight: 2, fillOpacity: 0.4 }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-2">{era.tipo}</h3>
                {cultivo && especie ? (
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Cultivo:</span> {especie.nombre}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Cantidad:</span> {cultivo.unidades}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Sin cultivos registrados</p>
                )}
              </div>
            </Popup>
          </Polygon>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;
