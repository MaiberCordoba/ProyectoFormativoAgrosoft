import MapComponent from "../components/mapa/Mapa"

// MapPage.tsx
export const MapPage = () => {
    return (
      <div style={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
  
        {/* Contenedor principal */}
        <div className="flex-1 flex gap-4 p-4 ">
          {/* Contenedor del mapa (izquierda) */}
          <div className="w-[600px] h-[400px] bg-white rounded-lg shadow-lg p-2">
            <MapComponent />
          </div>
  
          {/* Contenedor de contenido adicional (derecha) */}
          <div className="flex-1 bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-4">filtros</h2>
            {/* Agrega aquí tu contenido adicional */}
          </div>
        </div>
      </div>
    );
  };