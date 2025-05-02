import ModalComponent from "@/components/Modal";
import { useDeleteVariedad } from "../../hooks/variedad/useDeleteVariedad";

interface EliminarVariedadModalProps {
  variedad: {
    id: number;
    nombre: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export const EliminarVariedadModal = ({
  variedad,
  isOpen,
  onClose,
}: EliminarVariedadModalProps) => {
  const { mutate, isPending } = useDeleteVariedad();

  const handleEliminar = () => {
    mutate({ id: variedad.id }, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar Variedad"
      footerButtons={[
        {
          label: isPending ? "Eliminando..." : "Eliminar",
          color: "danger",
          variant: "light",
          onClick: handleEliminar,
        },
      ]}
    >
      <p>¿Estás seguro que deseas eliminar la variedad <strong>{variedad.nombre}</strong>?</p>
    </ModalComponent>
  );
};
