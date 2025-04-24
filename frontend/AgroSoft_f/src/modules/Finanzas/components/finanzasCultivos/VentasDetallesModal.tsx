import { Modal, ModalBody, ModalContent, ModalHeader, TableCell, TableRow } from "@heroui/react";
import { DetalleVenta } from "../../types";
import { TablaFiltrable } from "./tablaFiltrable";

interface VentasModalProps {
  isOpen: boolean;
  onClose: () => void;
  ventas: DetalleVenta[];
}

export const VentasModal = ({ isOpen, onClose, ventas }: VentasModalProps) => {
  const columnas = [
    { key: 'cantidad', label: 'Cantidad', permiteOrdenar: true },
    { key: 'unidad', label: 'Unidad', permiteOrdenar: true },
    { key: 'fecha', label: 'Fecha', permiteOrdenar: true },
    { key: 'valor_total', label: 'Valor Total', permiteOrdenar: true }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>Detalle de Ventas</ModalHeader>
        <ModalBody>
          <TablaFiltrable
            datos={ventas}
            columnas={columnas}
            mostrarFiltroBusqueda={false}
            mostrarFiltroFecha={true}
            claveUnica={(item) => `${item.fecha}-${item.cantidad}-${item.valor_total}`}
            renderFila={(item) => (
              <TableRow>
                <TableCell>{item.cantidad}</TableCell>
                <TableCell>{item.unidad || '-'}</TableCell>
                <TableCell>{item.fecha}</TableCell>
                <TableCell>${item.valor_total.toLocaleString()}</TableCell>
              </TableRow>
            )}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};