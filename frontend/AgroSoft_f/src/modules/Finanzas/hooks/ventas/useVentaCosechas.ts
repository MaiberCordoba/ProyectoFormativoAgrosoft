import { useState, useEffect } from "react";
import { Cosechas, UnidadesMedida, VentaCosecha } from "../../types";
import { addToast } from "@heroui/toast";

interface UseVentaCosechasProps {
  cosechas: Cosechas[] | undefined;
  unidadesMedida: UnidadesMedida[] | undefined;
  initialCosechas?: VentaCosecha[];
}

export const useVentaCosechas = ({ cosechas, unidadesMedida, initialCosechas = [] }: UseVentaCosechasProps) => {
  const [ventaCosechas, setVentaCosechas] = useState<VentaCosecha[]>(
    initialCosechas.length > 0
      ? initialCosechas
      : [{ cosecha: 0, cantidad: 1, unidad_medida: 0, descuento: "0", precio_unitario: "0.00", valor_total: "0.00" }]
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!cosechas || !unidadesMedida) return;

    const updatedVentaCosechas = ventaCosechas.map((vc) => {
      const cosecha = cosechas.find((c) => c.id === vc.cosecha);
      const unidad = unidadesMedida.find((u) => u.id === vc.unidad_medida);

      if (!cosecha || !unidad || vc.cantidad <= 0 || cosecha.valorGramo == null) {
        return { ...vc, precio_unitario: "0.00", valor_total: "0.00" };
      }

      const cantidadEnBase = vc.cantidad * unidad.equivalenciabase;
      const precioUnitario = Number(cosecha.valorGramo) || 0;
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

  const validateCosechas = () => {
    for (const [index, vc] of ventaCosechas.entries()) {
      if (!vc.cosecha || !vc.unidad_medida || vc.cantidad <= 0) {
        setError(`Complete todos los campos para la cosecha ${index + 1}.`);
        return false;
      }

      const cosechaSeleccionada = cosechas?.find((c) => c.id === vc.cosecha);
      const unidadSeleccionada = unidadesMedida?.find((u) => u.id === vc.unidad_medida);

      if (!cosechaSeleccionada || !unidadSeleccionada) {
        setError(`Cosecha o unidad de medida no válida en la cosecha ${index + 1}.`);
        return false;
      }

      if (cosechaSeleccionada.valorGramo == null) {
        setError(`La cosecha ${index + 1} no tiene un precio por gramo definido.`);
        return false;
      }

      if (cosechaSeleccionada.cantidad_disponible == null) {
        setError(`La cosecha ${index + 1} no tiene cantidad disponible definida.`);
        return false;
      }

      const cantidadEnBase = vc.cantidad * unidadSeleccionada.equivalenciabase;
      if (cantidadEnBase > cosechaSeleccionada.cantidad_disponible) {
        setError(
          `La cantidad seleccionada ${cantidadEnBase} g sobrepasa la cantidad disponible ${cosechaSeleccionada.cantidad_disponible} g para la cosecha ${index + 1}.`
        );
        return false;
      }

      const descuentoNum = Number(vc.descuento);
      if (descuentoNum < 0 || descuentoNum > 100) {
        setError(`El descuento en la cosecha ${index + 1} debe estar entre 0 y 100.`);
        return false;
      }
    }

    setError("");
    return true;
  };

  const getTotalVenta = () => {
    return ventaCosechas.reduce((total, vc) => total + Number(vc.valor_total), 0).toFixed(2);
  };

  const handleBackendError = (error: any) => {
    if (error.response?.status === 400 && error.message.includes("Cantidad excede el stock disponible")) {
      const match = error.message.match(/Cosecha (\d+)/);
      const cosechaId = match ? Number(match[1]) : null;
      const cosechaSeleccionada = cosechas?.find((c) => c.id === cosechaId);
      if (cosechaSeleccionada) {
        const index = ventaCosechas.findIndex((vc) => vc.cosecha === cosechaId);
        if (index !== -1) {
          const unidad = unidadesMedida?.find((u) => u.id === ventaCosechas[index].unidad_medida);
          const cantidadEnBase = unidad ? ventaCosechas[index].cantidad * unidad.equivalenciabase : 0;
          setError(
            `La cantidad seleccionada ${cantidadEnBase} g sobrepasa la cantidad disponible ${cosechaSeleccionada.cantidad_disponible ?? 0} g para la cosecha ${index + 1}.`
          );
          return;
        }
      }
    }
    setError(`Error al procesar la venta: ${error.message}`);
  };

  return {
    ventaCosechas,
    error,
    addCosecha,
    updateCosecha,
    removeCosecha,
    validateCosechas,
    getTotalVenta,
    handleBackendError,
  };
};