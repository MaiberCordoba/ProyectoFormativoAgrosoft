import { useState } from "react";
import { usePostVentas } from "../../hooks/ventas/usePostVentas";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetCosechas } from "../../hooks/cosechas/useGetCosechas";
import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";
import { CrearCosechasModal } from "../cosechas/CrearCosechasModal";

interface CrearVentasModalProps {
  onClose: () => void;
}

export const CrearVentasModal = ({ onClose }: CrearVentasModalProps) => {
  const [fk_Cosecha, setFk_Cosecha] = useState<number | null>(null);
  const [precioUnitario, setPrecioUnitario] = useState<number>(0);
  const [fecha, setFecha] = useState("");
  const [fk_UnidadMedida, setFk_UnidadMedida] = useState<number | null>(null);
  const [cantidad, setCantidad] = useState<number>(0);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: cosechas, isLoading: isLoadingCosechas } = useGetCosechas();
  const { data: unidadesMedida, isLoading: isLoadingUnidadesMedida } = useGetUnidadesMedida();
  const { mutate, isPending } = usePostVentas();

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    // Aquí podrías recargar la lista de cosechas si usas React Query con refetch()
  };

  const handleSubmit = () => {
    if (!fk_Cosecha || !precioUnitario || !fecha || !fk_UnidadMedida || !cantidad) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      { fk_Cosecha, precioUnitario, fecha, fk_UnidadMedida, cantidad },
      {
        onSuccess: () => {
          onClose();
          setFk_Cosecha(null);
          setPrecioUnitario(0);
          setFecha("");
          setFk_UnidadMedida(null);
          setCantidad(0);
        },
      }
    );
  };

  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Registro de Ventas"
        footerButtons={[
          {
            label: isPending ? "Guardando..." : "Guardar",
            color: "success",
            variant: "light",
            onClick: handleSubmit,
          },
        ]}
      >
        <Input
          label="Precio Unitario"
          type="number"
          value={precioUnitario}
          onChange={(e) => setPrecioUnitario(Number(e.target.value))}
          required
        />
        <Input
          label="Cantidad de producto"
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          required
        />

        <Input
          label="Fecha de venta"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />

        {isLoadingCosechas ? (
          <p>Cargando cosechas...</p>
        ) : (
          <>
            <Select
              label="Fecha Cosecha"
              placeholder="Seleccione la fecha de la cosecha"
              selectedKeys={fk_Cosecha ? [fk_Cosecha.toString()] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                setFk_Cosecha(selectedKey ? Number(selectedKey) : null);
              }}
            >
              {(cosechas || []).map((cosecha) => (
                <SelectItem
                  key={cosecha.id.toString()}
                  textValue={cosecha.fecha}
                >
                  {cosecha.fecha}
                </SelectItem>
              ))}
            </Select>

            <button
              type="button"
              className="text-blue-600 text-sm underline mt-2"
              onClick={openCreateModal}
            >
              ¿No encuentras la cosecha? Crear nueva
            </button>
          </>
        )}

        {isLoadingUnidadesMedida ? (
          <p>Cargando unidades de medida...</p>
        ) : (
          <Select
            label="Unidades de medida"
            placeholder="Selecciona la unidad de medida"
            selectedKeys={fk_UnidadMedida ? [fk_UnidadMedida.toString()] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0];
              setFk_UnidadMedida(selectedKey ? Number(selectedKey) : null);
            }}
          >
            {(unidadesMedida || []).map((unidadMedida) => (
              <SelectItem key={unidadMedida.id.toString()} textValue={unidadMedida.nombre}>
                {unidadMedida.nombre}
              </SelectItem>
            ))}
          </Select>
        )}
      </ModalComponent>

      {isCreateModalOpen && (
        <CrearCosechasModal onClose={closeCreateModal} />
      )}
    </>
  );
};


