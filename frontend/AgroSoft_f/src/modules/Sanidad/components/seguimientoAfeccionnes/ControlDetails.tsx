import { ControlDetails } from "../../types";
import { useState } from "react";

interface Props {
  controles: ControlDetails[];
}

const ListaControles = ({ controles }: Props) => {
  const [tipoBusqueda, setTipoBusqueda] = useState<string>("");

  // Filtrar por tipo de control
  const controlesFiltrados = controles.filter((control) => {
    if (!tipoBusqueda) return true;
    const tipo = control.tipoControl?.nombre?.toLowerCase() || "";
    return tipo.includes(tipoBusqueda.toLowerCase());
  });

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold mb-4">Lista de Controles</h2>

      {/* Campo de búsqueda por tipo de control */}
      <div className="mb-4">
        <label htmlFor="tipoBusqueda" className="block font-semibold mb-2">Buscar por tipo de control:</label>
        <input
          type="text"
          id="tipoBusqueda"
          value={tipoBusqueda}
          onChange={(e) => setTipoBusqueda(e.target.value)}
          placeholder="Ej: químico, biológico, etc."
          className="p-2 border rounded-md w-full"
        />
      </div>

      {/* Mostrar los controles filtrados */}
      {controlesFiltrados.length === 0 ? (
        <p>No se encontraron controles con ese tipo.</p>
      ) : (
        controlesFiltrados.map((control) => (
          <div key={control.id} className="border p-4 rounded shadow-md space-y-2">
            <p><strong>Fecha del Control:</strong> {control.fechaControl ? new Date(control.fechaControl).toLocaleDateString() : 'Fecha no disponible'}</p>
            <p><strong>Descripción:</strong> {control.descripcion ?? 'Sin descripción'}</p>
            <p><strong>Afección:</strong> {control.afeccion?.plagas?.nombre ?? 'Plaga no disponible'}</p>
            <p><strong>Tipo de afección:</strong> {control.afeccion?.plagas?.tipoPlaga?.nombre ?? 'Tipo no disponible'}</p>
            <p><strong>Cultivo (Lote):</strong> {control.afeccion?.plantaciones?.eras?.Lote?.nombre ?? 'Cultivo no disponible'}</p>
            <p><strong>Tipo de Control:</strong> {control.tipoControl?.nombre ?? 'Tipo no disponible'}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ListaControles;
