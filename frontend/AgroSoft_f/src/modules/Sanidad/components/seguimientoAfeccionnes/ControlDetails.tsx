import { ControlDetails } from "../../types";
import { useState } from "react";

interface Props {
  controles: ControlDetails[];
}

// Mapeo de códigos a nombres legibles
const estadoLabels: Record<string, string> = {
  ST: "Detectado",
  EC: "EnTratamiento",
  EL: "Erradicado",
};

// Clases CSS según el estado (fondo, borde, sombra)
const estadoStyles: Record<string, string> = {
  ST: "bg-green-100 border-l-4 border-green-500 shadow shadow-green-500/40",
  EC: "bg-yellow-100 border-l-4 border-yellow-500 shadow shadow-yellow-500/40",
  EL: "bg-red-100 border-l-4 border-red-500 shadow shadow-red-500/40",
};

const ListaControles = ({ controles }: Props) => {
  const [tipoBusqueda, setTipoBusqueda] = useState<string>("");
  const [cultivoBusqueda, setCultivoBusqueda] = useState<string>("");
  const [estadoBusqueda, setEstadoBusqueda] = useState<string>("");

  const controlesFiltrados = controles.filter((control) => {
    const tipo = control.tipoControl?.nombre?.toLowerCase() || "";
    const cultivo = control.afeccion?.plantaciones?.eras?.Lote?.nombre?.toLowerCase() || "";
    const estadoCod = control.afeccion?.estado || "";
    const estadoNombre = estadoLabels[estadoCod] || "";

    return (
      (!tipoBusqueda || tipo.includes(tipoBusqueda.toLowerCase())) &&
      (!cultivoBusqueda || cultivo.includes(cultivoBusqueda.toLowerCase())) &&
      (!estadoBusqueda || estadoNombre.toLowerCase() === estadoBusqueda.toLowerCase())
    );
  });

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold mb-4">Lista de Controles</h2>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="tipoBusqueda" className="block font-semibold mb-2">
            Tipo de control:
          </label>
          <input
            type="text"
            id="tipoBusqueda"
            value={tipoBusqueda}
            onChange={(e) => setTipoBusqueda(e.target.value)}
            placeholder="Ej: químico, biológico..."
            className="p-2 border rounded-md w-full"
          />
        </div>
        <div>
          <label htmlFor="cultivoBusqueda" className="block font-semibold mb-2">
            Cultivo:
          </label>
          <input
            type="text"
            id="cultivoBusqueda"
            value={cultivoBusqueda}
            onChange={(e) => setCultivoBusqueda(e.target.value)}
            placeholder="Ej: Lote 1, Tomate..."
            className="p-2 border rounded-md w-full"
          />
        </div>
        <div>
          <label htmlFor="estadoBusqueda" className="block font-semibold mb-2">
            Estado de la Afección:
          </label>
          <select
            id="estadoBusqueda"
            value={estadoBusqueda}
            onChange={(e) => setEstadoBusqueda(e.target.value)}
            className="p-2 border rounded-md w-full"
          >
            <option value="">Todos</option>
            <option value="Detectado">Detectado</option>
            <option value="EnTratamiento">EnTratamiento</option>
            <option value="Erradicado">Erradicado</option>
          </select>
        </div>
      </div>

      {/* Lista filtrada */}
      {controlesFiltrados.length === 0 ? (
        <p>No se encontraron controles con los filtros seleccionados.</p>
      ) : (
        controlesFiltrados.map((control) => {
          const estadoCod = control.afeccion?.estado || "";
          const estiloTarjeta = estadoStyles[estadoCod] || "bg-gray-100 border-l-4 border-gray-400 shadow";

          return (
            <div
              key={control.id}
              className={`p-4 rounded space-y-2 ${estiloTarjeta}`}
            >
              <p><strong>Fecha del Control:</strong> {control.fechaControl ? new Date(control.fechaControl).toLocaleDateString() : 'Fecha no disponible'}</p>
              <p><strong>Descripción:</strong> {control.descripcion ?? 'Sin descripción'}</p>
              <p><strong>Afección:</strong> {control.afeccion?.plagas?.nombre ?? 'Plaga no disponible'}</p>
              <p><strong>Tipo de afección:</strong> {control.afeccion?.plagas?.tipoPlaga?.nombre ?? 'Tipo no disponible'}</p>
              <p><strong>Cultivo (Lote):</strong> {control.afeccion?.plantaciones?.eras?.Lote?.nombre ?? 'Cultivo no disponible'}</p>
              <p><strong>Tipo de Control:</strong> {control.tipoControl?.nombre ?? 'Tipo no disponible'}</p>
              <p><strong>Estado de la Afección:</strong> {estadoLabels[estadoCod] ?? 'Estado no disponible'}</p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ListaControles;
