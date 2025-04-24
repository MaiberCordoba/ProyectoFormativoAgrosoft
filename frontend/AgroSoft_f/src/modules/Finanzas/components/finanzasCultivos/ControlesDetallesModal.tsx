import { Modal, ModalBody, ModalContent, ModalHeader, TableCell, TableRow } from "@heroui/react";
import { DetalleControl } from "../../types";
import { TablaFiltrable } from "./tablaFiltrable";

interface ControlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  controles: DetalleControl[];
}

export const ControlesModal = ({ isOpen, onClose, controles }: ControlesModalProps) => {
  const columnas = [
    { key: 'descripcion', label: 'Descripción', permiteOrdenar: true },
    { key: 'fecha', label: 'Fecha', permiteOrdenar: true },
    { key: 'tipo_control', label: 'Tipo Control', permiteOrdenar: true },
    { key: 'plaga', label: 'Plaga', permiteOrdenar: true },
    { key: 'tiempo_total', label: 'Tiempo (h)', permiteOrdenar: true },
    { key: 'costo_mano_obra', label: 'Costo MO', permiteOrdenar: true },
    { key: 'total_insumos_control', label: 'Total Insumos', permiteOrdenar: true }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>Detalle de Controles</ModalHeader>
        <ModalBody>
          <TablaFiltrable
            datos={controles}
            columnas={columnas}
            mostrarFiltroBusqueda={true}
            mostrarFiltroFecha={true}
            textoBusquedaPlaceholder="Buscar por descripción o plaga..."
            claveUnica={(item) => `${item.fecha}-${item.tipo_control}-${item.plaga}`}
            renderFila={(item) => (
              <TableRow>
                <TableCell>{item.descripcion}</TableCell>
                <TableCell>{item.fecha}</TableCell>
                <TableCell>{item.tipo_control || '-'}</TableCell>
                <TableCell>{item.plaga || '-'}</TableCell>
                <TableCell>{item.tiempo_total}</TableCell>
                <TableCell>${item.costo_mano_obra.toLocaleString()}</TableCell>
                <TableCell>${item.total_insumos_control.toLocaleString()}</TableCell>
              </TableRow>
            )}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};