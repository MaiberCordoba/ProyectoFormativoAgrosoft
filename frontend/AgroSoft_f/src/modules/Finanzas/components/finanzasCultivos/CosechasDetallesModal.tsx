import { Modal, ModalBody, ModalContent, ModalHeader, TableCell, TableRow } from "@heroui/react";
import { DetalleCosecha } from "../../types";
import { TablaFiltrable } from "./tablaFiltrable";

interface CosechasModalProps {
  isOpen: boolean;
  onClose: () => void;
  cosechas: DetalleCosecha[];
}

export const CosechasModal = ({ isOpen, onClose, cosechas }: CosechasModalProps) => {
  const columnas = [
    { key: 'cantidad', label: 'Cantidad', permiteOrdenar: true },
    { key: 'unidad', label: 'Unidad', permiteOrdenar: true },
    { key: 'fecha', label: 'Fecha', permiteOrdenar: true }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalContent>
        <ModalHeader>Detalle de Cosechas</ModalHeader>
        <ModalBody>
          <TablaFiltrable
            datos={cosechas}
            columnas={columnas}
            mostrarFiltroBusqueda={false}
            mostrarFiltroFecha={true}
            claveUnica={(item) => `${item.fecha}-${item.cantidad}`}
            renderFila={(item) => (
              <TableRow>
                <TableCell>{item.cantidad}</TableCell>
                <TableCell>{item.unidad || '-'}</TableCell>
                <TableCell>{item.fecha}</TableCell>
              </TableRow>
            )}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};