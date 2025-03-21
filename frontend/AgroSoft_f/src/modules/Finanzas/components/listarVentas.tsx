import { useState } from "react";
import { useVentas } from "../hooks/useVentas"; 
import TableComponent from "@/components/Table";
import DetallesVentas from "./detallesVentas";
import { Ventas } from "../types"; 
import { Button } from "@heroui/react";
import { deleteVentas } from "../api/ventasApi";

export function VentasList() {
  const { data, isLoading, error, refetch } = useVentas(); // Agregar refetch para actualizar datos
  const [selectedVentas, setSelectedVentas] = useState<Ventas | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Nuevo estado para distinguir detalles/editar

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las Ventas</p>;
  if (!data || data.length === 0) return <p>No se encontraron Ventas.</p>;

  // Definir columnas
  const VentasColumns: { key: keyof Ventas | "acciones"; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "fk_Cosecha", label: "fk_Cosecha" },
    { key: "precioUnitario", label: "PrecioUnitario" },
    { key: "fecha", label: "Fecha" },
    { key: "acciones", label: "Acciones" },
  ];

  // Función para abrir el modal con detalles
  const handleDetailsClick = (ventas: Ventas) => {
    setSelectedVentas(ventas);
    setIsEditMode(false); // Modo solo lectura
    setModalOpen(true);
  };

  // Función para abrir el modal en modo edición
  const handleEditClick = (ventas: Ventas) => {
    setSelectedVentas(ventas);
    setIsEditMode(true); // Modo edición
    setModalOpen(true);
  };

  // Función para eliminar un Registro
  const handleDeleteClick = async (ventas: Ventas) => {
    try {
      await deleteVentas(ventas.id);
      alert("Venta eliminada exitosamente");
      refetch();
    } catch (error) {
      alert("Ocurrió un error al eliminar");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-center font-bold mb-4">Ventas</h1>
      <br />
      <TableComponent<Ventas>
        columns={VentasColumns}
        data={data}
        renderActions={(ventas) => (
          <div className="flex gap-2">
            <Button color="primary" size="sm" onClick={() => handleDetailsClick(ventas)}>
              Detalles
            </Button>
            <Button color="warning" size="sm" onClick={() => handleEditClick(ventas)}>
              Editar
            </Button>
            <Button color="danger" size="sm" onClick={() => handleDeleteClick(ventas)}>
              Eliminar
            </Button>
          </div>
        )}
      />
      {/* Modal reutilizable */}
      <DetallesVentas
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        ventas={selectedVentas}
        isEditMode={isEditMode}
        onSaveSuccess={() => {
          setModalOpen(false); // Cerrar modal al guardar
          refetch(); // Recargar lista de actividades
        }}
      />
    </div>
  );
}
