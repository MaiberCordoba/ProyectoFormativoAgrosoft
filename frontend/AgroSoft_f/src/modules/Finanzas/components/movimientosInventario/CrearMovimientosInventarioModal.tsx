import { useState } from "react";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { MovimientoInventario } from "../../types";
import { usePostMovimiento } from "../../hooks/movimientoInventario/usePostMovimientos";
import { useGetInsumos } from "../../hooks/insumos/useGetInsumos";
import { useGetHerramientas } from "../../hooks/herramientas/useGetHerramientas";

interface CrearMovimientoInventarioModalProps {
  onClose: () => void;
  onCreate: (nuevoMovimiento: MovimientoInventario) => void;
}

export const CrearMovimientoInventarioModal = ({ onClose }: CrearMovimientoInventarioModalProps) => {
  const [tipo, setTipo] = useState<"entrada" | "salida">("entrada");
  const [unidades, setUnidades] = useState<string>("");
  const [fk_Insumo, setFk_Insumo] = useState<number | null>(null);
  const [fk_Herramienta, setFk_Herramienta] = useState<number | null>(null);
  const [error, setError] = useState("");

  const { mutate, isPending } = usePostMovimiento();
  const { data: insumos = [], isLoading: cargandoInsumos } = useGetInsumos();
  const { data: herramientas = [], isLoading: cargandoHerramientas } = useGetHerramientas();

  const handleSubmit = () => {
    const cantidad = Number(unidades);

    if (isNaN(cantidad) || cantidad <= 0) {
      setError("Por favor, ingresa una cantidad válida mayor a 0.");
      return;
    }

    const tieneInsumo = fk_Insumo !== null;
    const tieneHerramienta = fk_Herramienta !== null;

    if (tieneInsumo && tieneHerramienta) {
      setError("Solo se puede registrar un movimiento para insumo o herramienta, no ambos.");
      return;
    }

    if (!tieneInsumo && !tieneHerramienta) {
      setError("Debes asociar el movimiento a un insumo o herramienta.");
      return;
    }

    mutate(
      {
        tipo,
        unidades: cantidad,
        fk_Insumo,
        fk_UsoInsumo: null,
        fk_Herramienta,
        fk_UsoHerramienta: null,
      },
      {
        onSuccess: () => {
          onClose();
          setTipo("entrada");
          setUnidades("");
          setFk_Insumo(null);
          setFk_Herramienta(null);
          setError("");
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Movimiento de Inventario"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      <p className="text-red-500 text-sm mb-2">{error}</p>
      <div className="space-y-4">
        <Select
          label="Tipo de movimiento"
          selectedKeys={[tipo]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as "entrada" | "salida";
            setTipo(selected);
          }}
        >
          <SelectItem key="entrada">Entrada</SelectItem>
          <SelectItem key="salida">Salida</SelectItem>
        </Select>

        <Input
          label="Cantidad de unidades"
          type="text"
          value={unidades}
          onChange={(e) => setUnidades(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <h3 className="font-medium">Selecciona un Insumo</h3>
            <Select
              label="Insumo"
              placeholder="Selecciona un insumo"
              selectedKeys={fk_Insumo ? [fk_Insumo.toString()] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                setFk_Insumo(selected ? Number(selected) : null);
                setFk_Herramienta(null); // Desactiva herramienta si se selecciona insumo
              }}
              isDisabled={cargandoInsumos}
            >
              {insumos.map((insumo) => (
                <SelectItem key={insumo.id.toString()}>{insumo.nombre}</SelectItem>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-medium">Selecciona una Herramienta</h3>
            <Select
              label="Herramienta"
              placeholder="Selecciona una herramienta"
              selectedKeys={fk_Herramienta ? [fk_Herramienta.toString()] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                setFk_Herramienta(selected ? Number(selected) : null);
                setFk_Insumo(null); // Desactiva insumo si se selecciona herramienta
              }}
              isDisabled={cargandoHerramientas}
            >
              {herramientas.map((herramienta) => (
                <SelectItem key={herramienta.id.toString()}>{herramienta.nombre}</SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </ModalComponent>
  );
};
