import { useState, useEffect } from "react";
import { usePostVentas } from "../../hooks/ventas/usePostVentas";
import ModalComponent from "@/components/Modal";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useGetCosechas } from "../../hooks/cosechas/useGetCosechas";
import { useGetUnidadesMedida } from "../../hooks/unidadesMedida/useGetUnidadesMedida";
import { CrearCosechasModal } from "../cosechas/CrearCosechasModal";
import { Cosechas, UnidadesMedida, VentaCosecha } from "../../types";
import { CrearUnidadesMedidaModal } from "../unidadesMedida/CrearUnidadesMedidaModal";
import { Plus, Trash2 } from "lucide-react";
import { useGetPlantaciones } from "@/modules/Trazabilidad/hooks/plantaciones/useGetPlantaciones";
import { addToast } from "@heroui/toast";

interface CrearVentasModalProps {
  onClose: () => void;
  onCreate: () => void;
}

export const CrearVentasModal = ({ onClose, onCreate }: CrearVentasModalProps) => {
  const [ventaCosechas, setVentaCosechas] = useState<VentaCosecha[]>([
    { cosecha: 0, cantidad: 1, unidad_medida: 0, descuento: "0", precio_unitario: "0.00", valor_total: "0.00" },
  ]);
  const [error, setError] = useState("");
  const [cosechaModal, setCosechaModal] = useState(false);
  const [unidadMedidaModal, setUnidadMedidaModal] = useState(false);

  const { data: cosechas, isLoading: isLoadingCosechas, refetch: refetchCosecha } = useGetCosechas();
  const { data: plantaciones } = useGetPlantaciones();
  const { data: unidadesMedida, isLoading: isLoadingUnidadesMedida, refetch: refetchUnidadMedida } = useGetUnidadesMedida();
  const { mutate, isPending } = usePostVentas();

  useEffect(() => {
    if (!cosechas || !unidadesMedida) return;

    const updatedVentaCosechas = ventaCosechas.map((vc) => {
      const cosecha = cosechas.find((c) => c.id === vc.cosecha);
      const unidad = unidadesMedida.find((u) => u.id === vc.unidad_medida);

      // Si no hay cosecha, unidad, cantidad válida, o valorGramo, devolver valores por defecto
      if (!cosecha || !unidad || vc.cantidad <= 0 || cosecha.valorGramo == null) {
        return { ...vc, precio_unitario: "0.00", valor_total: "0.00" };
      }

      const cantidadEnBase = vc.cantidad * unidad.equivalenciabase;
      const precioUnitario = Number(cosecha.valorGramo) || 0; // Asegurar que sea número
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

      if (cosechaSeleccionada.valorGramo == null) {
        addToast({
          title: "Error",
          description: `La cosecha ${index + 1} no tiene un precio por gramo definido.`,
          color: "danger",
        });
        return;
      }

      const cantidadEnBase = vc.cantidad * unidadSeleccionada.equivalenciabase;
      if (cantidadEnBase > cosechaSeleccionada.cantidad_disponible!) {
        setError(
          `Cosecha ${index + 1}: La cantidad ingresada (${cantidadEnBase} g) excede la cantidad disponible (${cosechaSeleccionada.cantidad_disponible} g).`
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
        cosechas: ventaCosechas.map((vc) => ({
          cosecha: vc.cosecha,
          cantidad: vc.cantidad,
          unidad_medida: vc.unidad_medida,
          descuento: Number(vc.descuento),
        })),
      },
      {
        onSuccess: () => {
          refetchCosecha();
          onCreate();
          onClose();
          setVentaCosechas([{ cosecha: 0, cantidad: 1, unidad_medida: 0, descuento: "0", precio_unitario: "0.00", valor_total: "0.00" }]);
          addToast({
            title: "Éxito",
            description: "Venta creada con éxito.",
            color: "success",
          });
        },
        onError: (error) => {
          addToast({
            title: "Error",
            description: `Error al crear la venta: ${error.message}`,
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
        title="Registro de Ventas"
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
              const cantidadDisponible = cosechaSeleccionada?.cantidad_disponible || 0;
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
                          .filter((cosecha) => cosecha.cantidad_disponible! > 0)
                          .map((cosecha) => {
                            const plantacion = plantaciones?.find((p) => p.id === cosecha.fk_Plantacion);
                            const producto = plantacion?.cultivo?.nombre || "Sin producto";
                            return (
                              <SelectItem
                                key={cosecha.id.toString()}
                                textValue={`Producto: ${producto} - Cantidad: ${cosecha.cantidad_disponible!}`}
                              >
                                <div className="flex flex-col">
                                  <span className="font-semibold">Producto: {producto}</span>
                                  <span>Cantidad: {cosecha.cantidad_disponible!} (g)</span>
                                  {cosecha.valorGramo == null && (
                                    <span className="text-red-500">Precio no definido</span>
                                  )}
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
                    label="Cantidad de producto"
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
                        <strong>Disponible:</strong> {cosechaSeleccionada.cantidad_disponible!.toFixed(2)} g
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