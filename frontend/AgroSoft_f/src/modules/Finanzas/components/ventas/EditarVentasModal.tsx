import { useState, useEffect } from "react";
import { usePatchVentas } from "../../hooks/ventas/usePatchVentas";
import ModalComponent from "@/components/Modal";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useGetCosechas } from "../../hooks/cosechas/useGetCosechas";
import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";
import { CrearCosechasModal } from "../cosechas/CrearCosechasModal";
import { Cosechas, UnidadesMedida, VentaCosecha, Ventas } from "../../types";
import { CrearUnidadesMedidaModal } from "../unidadesMedida/CrearUnidadesMedidaModal";
import { Plus, Trash2 } from "lucide-react";
import { useGetPlantaciones } from "@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones";
import { addToast } from "@heroui/toast";

interface EditarVentasModalProps {
  venta: Ventas;
  onClose: () => void;
}

export const EditarVentasModal = ({ venta, onClose }: EditarVentasModalProps) => {
  const [ventaCosechas, setVentaCosechas] = useState<VentaCosecha[]>(venta.cosechas);
  const [error, setError] = useState("");
  const [cosechaModal, setCosechaModal] = useState(false);
  const [unidadMedidaModal, setUnidadMedidaModal] = useState(false);

  const { data: cosechas, isLoading: isLoadingCosechas, refetch: refetchCosecha } = useGetCosechas();
  const { data: plantaciones } = useGetPlantaciones();
  const { data: unidadesMedida, isLoading: isLoadingUnidadesMedida, refetch: refetchUnidadMedida } = useGetUnidadesMedida();
  const { mutate, isPending } = usePatchVentas();

  useEffect(() => {
    if (!cosechas || !unidadesMedida) return;

    const updatedVentaCosechas = ventaCosechas.map((vc) => {
      const cosecha = cosechas.find((c) => c.id === vc.cosecha);
      const unidad = unidadesMedida.find((u) => u.id === vc.unidad_medida);
      if (!cosecha || !unidad || vc.cantidad <= 0) {
        return { ...vc, precio_unitario: "0.00", valor_total: "0.00" };
      }

      const cantidadEnBase = vc.cantidad * unidad.equivalenciabase;
      const precioUnitario = cosecha.valorGramo || 0;
      const porcentajeDescuento = Number(vc.descuento) / 100;
      const valorTotal = cantidadEnBase * precioUnitario * (1 - porcentajeDescuento);
      return {
        ...vc,
        precio_unitario: precioUnitario.toFixed(2),
        valor_total: valorTotal.toFixed(2),
      };
    });

    setVentaCosechas(updatedVentaCosechas);
  }, [ventaCosechas, cosechas, unidadesMedida]);

  const addCosecha = () => {
    setVentaCosechas([...ventaCosechas, { cosecha: 0, cantidad: 1, unidad_medida: 0, descuento: "0", precio_unitario: "0.00", valor_total: "0.00" }]);
  };

  const updateCosecha = (index: number, field: keyof VentaCosecha, value: number | string) => {
    const updated = [...ventaCosechas];
    updated[index] = { ...updated[index], [field]: value };
    setVentaCosechas(updated);
  };

  const removeCosecha = (index: number) => {
    if (ventaCosechas.length === 1) {
      addToast({
        title: "Error",
        description: "Debe haber al menos una cosecha.",
        color: "danger",
      });
      return;
    }
    setVentaCosechas(ventaCosechas.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    for (const [index, vc] of ventaCosechas.entries()) {
      if (!vc.cosecha || !vc.unidad_medida || vc.cantidad <= 0) {
        addToast({
          title: "Campos requeridos",
          description: `Complete todos los campos para la cosecha ${index + 1}.`,
          color: "danger",
        });
        return;
      }

      const cosechaSeleccionada = cosechas?.find((c) => c.id === vc.cosecha);
      const unidadSeleccionada = unidadesMedida?.find((u) => u.id === vc.unidad_medida);

      if (!cosechaSeleccionada || !unidadSeleccionada) {
        addToast({
          title: "Error",
          description: `Cosecha o unidad de medida no válida en la cosecha ${index + 1}.`,
          color: "danger",
        });
        return;
      }

      const cantidadEnBase = vc.cantidad * unidadSeleccionada.equivalenciabase;
      const originalCosecha = venta.cosechas.find((ovc) => ovc.cosecha === vc.cosecha);
      const cantidadAnteriorBase = originalCosecha
        ? originalCosecha.cantidad * (unidadesMedida?.find((u) => u.id === originalCosecha.unidad_medida)?.equivalenciabase || 1)
        : 0;
      const cantidadDisponibleTotal = cosechaSeleccionada.cantidadTotal + cantidadAnteriorBase;

      if (cantidadEnBase > cantidadDisponibleTotal) {
        setError(
          `Cosecha ${index + 1}: La cantidad ingresada (${cantidadEnBase} g) excede la cantidad disponible (${cantidadDisponibleTotal} g).`
        );
        return;
      }

      const descuentoNum = Number(vc.descuento);
      if (descuentoNum < 0 || descuentoNum > 100) {
        addToast({
          title: "Valores inválidos",
          description: `El descuento en la cosecha ${index + 1} debe estar entre 0 y 100.`,
          color: "danger",
        });
        return;
      }
    }

    setError("");

    mutate(
      {
        id: venta.id,
        data: {
          cosechas: ventaCosechas.map((vc) => ({
            cosecha: vc.cosecha,
            cantidad: vc.cantidad,
            unidad_medida: vc.unidad_medida,
            descuento: Number(vc.descuento),
          })),
        },
      },
      {
        onSuccess: () => {
          refetchCosecha();
          onClose();
          addToast({
            title: "Éxito",
            description: "Venta actualizada con éxito.",
            color: "success",
          });
        },
        onError: (error) => {
          addToast({
            title: "Error",
            description: `Error al actualizar la venta: ${error.message}`,
            color: "danger",
          });
        },
      }
    );
  };

  const handleCosechaCreada = (nuevaCosecha: Cosechas) => {
    refetchCosecha();
    setVentaCosechas((prev) => {
      const updated = [...prev];
      updated[0] = { ...updated[0], cosecha: nuevaCosecha.id };
      return updated;
    });
    setCosechaModal(false);
  };

  const handleUnidadMedidaCreada = (nuevaUnidadMedida: UnidadesMedida) => {
    refetchUnidadMedida();
    setVentaCosechas((prev) => {
      const updated = [...prev];
      updated[0] = { ...updated[0], unidad_medida: nuevaUnidadMedida.id };
      return updated;
    });
    setUnidadMedidaModal(false);
  };

  return (
    <>
      <ModalComponent
        isOpen={true}
        onClose={onClose}
        title="Editar Venta"
        footerButtons={[
          {
            label: isPending ? "Guardando..." : "Guardar",
            color: "success",
            onClick: handleSubmit,
          },
        ]}
      >
        <p className="text-red-500 text-sm mb-2">{error}</p>
        {isLoadingCosechas || isLoadingUnidadesMedida ? (
          <p>Cargando...</p>
        ) : (
          <>
            {ventaCosechas.map((vc, index) => {
              const cosechaSeleccionada = cosechas?.find((c) => c.id === vc.cosecha);
              const unidadSeleccionada = unidadesMedida?.find((u) => u.id === vc.unidad_medida);
              const cantidadEnBase = unidadSeleccionada ? vc.cantidad * unidadSeleccionada.equivalenciabase : 0;
              const originalCosecha = venta.cosechas.find((ovc) => ovc.cosecha === vc.cosecha);
              const cantidadAnteriorBase = originalCosecha
                ? originalCosecha.cantidad * (unidadesMedida?.find((u) => u.id === originalCosecha.unidad_medida)?.equivalenciabase || 1)
                : 0;
              const cantidadDisponible = (cosechaSeleccionada?.cantidadTotal || 0) + cantidadAnteriorBase;
              const cantidadRestante = cantidadDisponible - cantidadEnBase;

              return (
                <div key={index} className="mb-4 border p-4 rounded">
                  <h3 className="font-semibold mb-2">Cosecha {index + 1}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Select
                        label="Cosecha"
                        size="sm"
                        placeholder="Selecciona el producto y cantidad"
                        selectedKeys={vc.cosecha ? [vc.cosecha.toString()] : []}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0];
                          updateCosecha(index, "cosecha", selectedKey ? Number(selectedKey) : 0);
                        }}
                      >
                        {(cosechas || [])
                          .filter((cosecha) => cosecha.cantidadTotal > 0)
                          .map((cosecha) => {
                            const plantacion = plantaciones?.find((p) => p.id === cosecha.fk_Plantacion);
                            const producto = plantacion?.cultivo?.nombre || "Sin producto";
                            return (
                              <SelectItem
                                key={cosecha.id.toString()}
                                textValue={`Producto: ${producto} - Cantidad: ${cosecha.cantidadTotal}`}
                              >
                                <div className="flex flex-col">
                                  <span className="font-semibold">Producto: {producto}</span>
                                  <span>Cantidad: {cosecha.cantidadTotal} (g)</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                      </Select>
                    </div>
                    {index === 0 && (
                      <Button
                        onPress={() => setCosechaModal(true)}
                        title="Crear cosecha"
                        color="success"
                        size="sm"
                      >
                        <Plus className="w-5 h-5 text-white" />
                      </Button>
                    )}
                  </div>

                  <Input
                    label={`Cantidad de producto (máx: ${cantidadDisponible.toFixed(2)} g)`}
                    type="number"
                    size="sm"
                    value={vc.cantidad.toString()}
                    onChange={(e) => updateCosecha(index, "cantidad", Number(e.target.value))}
                    required
                    min="1"
                  />

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Select
                        label="Unidades de medida"
                        size="sm"
                        placeholder="Selecciona la unidad de medida"
                        selectedKeys={vc.unidad_medida ? [vc.unidad_medida.toString()] : []}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0];
                          updateCosecha(index, "unidad_medida", selectedKey ? Number(selectedKey) : 0);
                        }}
                      >
                        {(unidadesMedida || []).map((unidadMedida) => (
                          <SelectItem key={unidadMedida.id.toString()} textValue={unidadMedida.nombre}>
                            {unidadMedida.nombre}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    {index === 0 && (
                      <Button
                        onPress={() => setUnidadMedidaModal(true)}
                        title="Crear unidad de medida"
                        color="success"
                        size="sm"
                      >
                        <Plus className="w-5 h-5 text-white" />
                      </Button>
                    )}
                  </div>

                  <Input
                    label="Descuento (%)"
                    type="number"
                    size="sm"
                    value={vc.descuento.toString()}
                    onChange={(e) => updateCosecha(index, "descuento", e.target.value)}
                    min="0"
                    max="100"
                  />

                  {cosechaSeleccionada && unidadSeleccionada && (
                    <div className="mt-2 text-sm">
                      <p className="text-gray-700">
                        <strong>Disponible:</strong> {cantidadDisponible.toFixed(2)} g
                      </p>
                      <p className={cantidadRestante < 0 ? "text-red-500" : "text-green-600"}>
                        <strong>Restante:</strong> {cantidadRestante > 0 ? cantidadRestante.toFixed(2) : 0} g
                      </p>
                      <p>
                        <strong>Precio unitario:</strong> ${vc.precio_unitario}
                      </p>
                      <p>
                        <strong>Valor total:</strong> ${vc.valor_total}
                      </p>
                    </div>
                  )}

                  {ventaCosechas.length > 1 && (
                    <Button
                      onPress={() => removeCosecha(index)}
                      color="danger"
                      size="sm"
                      className="mt-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Eliminar
                    </Button>
                  )}
                </div>
              );
            })}
            <Button onPress={addCosecha} color="primary" size="sm" className="mb-4">
              <Plus className="w-5 h-5" />
              Añadir otra cosecha
            </Button>
          </>
        )}
      </ModalComponent>

      {cosechaModal && (
        <CrearCosechasModal onClose={() => setCosechaModal(false)} onCreate={handleCosechaCreada} />
      )}
      {unidadMedidaModal && (
        <CrearUnidadesMedidaModal
          onClose={() => setUnidadMedidaModal(false)}
          onCreate={handleUnidadMedidaCreada}
        />
      )}
    </>
  );
};