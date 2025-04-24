import { Modal, ModalBody, ModalContent, ModalHeader, TableCell, TableRow } from "@heroui/react";
import { DetalleActividad } from "../../types";
import { TablaFiltrable } from "./tablaFiltrable";

interface ActividadesModalProps {
  isOpen: boolean;
  onClose: () => void;
  actividades: DetalleActividad[];
}

export const ActividadesModal = ({ isOpen, onClose, actividades }: ActividadesModalProps) => {
  // Definición de columnas para la tabla
  const columnas = [
    { key: 'tipo_actividad', label: 'Tipo', permiteOrdenar: true },
    { key: 'responsable', label: 'Responsable', permiteOrdenar: true },
    { key: 'fecha', label: 'Fecha', permiteOrdenar: true },
    { key: 'tiempo_total', label: 'Tiempo (h)', permiteOrdenar: true },
    { key: 'costo_mano_obra', label: 'Costo MO', permiteOrdenar: true },
    { key: 'total_insumos_actividad', label: 'Total Insumos', permiteOrdenar: true }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>Detalle de Actividades</ModalHeader>
        <ModalBody>
          <TablaFiltrable
            datos={actividades}
            columnas={columnas}
            mostrarFiltroBusqueda={true}
            mostrarFiltroFecha={true}
            textoBusquedaPlaceholder="Buscar actividades..."
            claveUnica={(item) => `${item.fecha}-${item.tipo_actividad}`}
            renderFila={(item) => (
              <TableRow>
                <TableCell>{item.tipo_actividad || '-'}</TableCell>
                <TableCell>{item.responsable || '-'}</TableCell>
                <TableCell>{item.fecha}</TableCell>
                <TableCell>{item.tiempo_total}</TableCell>
                <TableCell>${item.costo_mano_obra.toLocaleString()}</TableCell>
                <TableCell>${item.total_insumos_actividad.toLocaleString()}</TableCell>
              </TableRow>
            )}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};