import { ActividadesList } from "../components/actividades/ActividadesList";

export function Actividades() {
  return (
    <div>
      <h1 className="text-4xl p-4 font-serif">Actividades asignadas</h1>
      <ActividadesList />
    </div>
  );
}
