import React, { useState, useMemo, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
} from "@heroui/react";
import { DetalleControl } from "../../types"; // Asegúrate de que esta ruta sea correcta
import { FiltroFecha } from "@/components/ui/filtroFecha";
import { FilasPorPagina } from "@/components/ui/table/filasPorPagina";
import { PaginacionTabla } from "@/components/ui/table/PaginacionTabla";
import { SearchCheckIcon } from "lucide-react";

interface ControlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  controles: DetalleControl[];
}

export const ControlesModal = ({
  isOpen,
  onClose,
  controles,
}: ControlesModalProps) => {
  interface RenderedControlItem extends DetalleControl {
    insumo: {
      id?: number;
      nombre: string;
      cantidad: number;
      unidad: string;
      costo: number;
    };
    id_fila_unica: string;
  }

  const datosTransformados: RenderedControlItem[] = useMemo(() => {
    return controles.flatMap((control) =>
      control.insumos.map(
        (insumo, insumoIndex) =>
          ({
            ...control,
            insumo,
            fecha: control.fecha,
            id_fila_unica: `${control.id || "no-id"}-${insumo.id || insumoIndex}-${control.fecha}`,
          }) as RenderedControlItem
      )
    );
  }, [controles]);

  const [paginaActual, setPaginaActual] = useState(1);
  const [filasPorPagina, setFilasPorPagina] = useState(10);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [rangoFechas, setRangoFechas] = useState({
    fechaInicio: null as string | null,
    fechaFin: null as string | null,
  });

  useEffect(() => {
    if (isOpen) {
      setPaginaActual(1);
      setTextoBusqueda("");
      setRangoFechas({ fechaInicio: null, fechaFin: null });
      setFilasPorPagina(10);
    }
  }, [isOpen]);

  const datosFiltrados = useMemo(() => {
    let resultado = [...datosTransformados];

    if (textoBusqueda) {
      const busqueda = textoBusqueda.toLowerCase();
      resultado = resultado.filter(
        (item) =>
          item.descripcion?.toLowerCase().includes(busqueda) ||
          item.tipo_control?.toLowerCase().includes(busqueda) ||
          item.plaga?.toLowerCase().includes(busqueda) ||
          item.insumo.nombre?.toLowerCase().includes(busqueda) ||
          item.insumo.unidad?.toLowerCase().includes(busqueda) ||
          item.tiempo_total?.toString().toLowerCase().includes(busqueda) ||
          item.costo_mano_obra?.toString().toLowerCase().includes(busqueda) ||
          item.total_insumos_control
            ?.toString()
            .toLowerCase()
            .includes(busqueda) ||
          item.insumo.cantidad?.toString().toLowerCase().includes(busqueda) ||
          (item.fecha
            ? new Date(item.fecha + "T00:00:00")
                .toLocaleDateString("es-CO")
                .toLowerCase()
                .includes(busqueda)
            : false)
      );
    }

    if (rangoFechas.fechaInicio || rangoFechas.fechaFin) {
      resultado = resultado.filter((item) => {
        if (!item.fecha) return false;

        const fechaItem = new Date(item.fecha + "T00:00:00");

        const inicio = rangoFechas.fechaInicio
          ? new Date(rangoFechas.fechaInicio + "T00:00:00")
          : null;

        const fin = rangoFechas.fechaFin
          ? new Date(rangoFechas.fechaFin + "T23:59:59.999")
          : null;

        const cumpleInicio = !inicio || fechaItem >= inicio;
        const cumpleFin = !fin || fechaItem <= fin;

        return cumpleInicio && cumpleFin;
      });
    }

    return resultado;
  }, [datosTransformados, textoBusqueda, rangoFechas]);

  useEffect(() => {
    const newTotalPages = Math.ceil(datosFiltrados.length / filasPorPagina);
    if (paginaActual > newTotalPages && newTotalPages > 0) {
      setPaginaActual(newTotalPages);
    } else if (datosFiltrados.length === 0 && paginaActual !== 1) {
      setPaginaActual(1);
    }
  }, [datosFiltrados, filasPorPagina, paginaActual]);

  const totalPaginas = Math.ceil(datosFiltrados.length / filasPorPagina);

  const datosPagina = useMemo(() => {
    const start = (paginaActual - 1) * filasPorPagina;
    const end = start + filasPorPagina;
    return datosFiltrados.slice(start, end);
  }, [datosFiltrados, paginaActual, filasPorPagina]);

  const handleFechaChange = (newRango: {
    fechaInicio: string | null;
    fechaFin: string | null;
  }) => {
    setRangoFechas(newRango);
    setPaginaActual(1);
  };

  const handleLimpiarFechas = () => {
    setRangoFechas({ fechaInicio: null, fechaFin: null });
    setPaginaActual(1);
  };

  const handleBusquedaChange = (value: string) => {
    setTextoBusqueda(value);
    setPaginaActual(1);
  };

  const handleRowsPerPageChange = (value: number) => {
    setFilasPorPagina(value);
    setPaginaActual(1);
  };

  const columnasControles = [
    { uid: "descripcion", name: "Descripción" },
    { uid: "fecha", name: "Fecha" },
    { uid: "tipo_control", name: "Tipo Control" },
    { uid: "plaga", name: "Plaga" },
    { uid: "tiempo_total", name: "Tiempo (h)" },
    { uid: "costo_mano_obra", name: "Costo MO" },
    { uid: "total_insumos_control", name: "Total Insumos" },
    { uid: "insumo_nombre", name: "Insumo" },
    { uid: "insumo_cantidad", name: "Cantidad" },
    { uid: "insumo_unidad", name: "Unidad" },
  ];

  const renderControlCelda = (item: RenderedControlItem, columnKey: string) => {
    switch (columnKey) {
      case "descripcion":
        return <span>{item.descripcion || "-"}</span>;
      case "fecha":
        return (
          <span>
            {new Date(item.fecha + "T00:00:00").toLocaleDateString("es-CO")}
          </span>
        );
      case "tipo_control":
        return <span>{item.tipo_control || "-"}</span>;
      case "plaga":
        return <span>{item.plaga || "-"}</span>;
      case "tiempo_total":
        return <span>{item.tiempo_total}</span>;
      case "costo_mano_obra":
        return (
          <span>
            ${item.costo_mano_obra?.toLocaleString("es-CO") || "0.00"}
          </span>
        );
      case "total_insumos_control":
        return (
          <span>
            ${item.total_insumos_control?.toLocaleString("es-CO") || "0.00"}
          </span>
        );
      case "insumo_nombre":
        return <span>{item.insumo.nombre || "-"}</span>;
      case "insumo_cantidad":
        return <span>{item.insumo.cantidad}</span>;
      case "insumo_unidad":
        return <span>{item.insumo.unidad || "-"}</span>;
      default:
        return <span>{(item as any)[columnKey]?.toString() || ""}</span>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      className="overflow-hidden"
    >
      <ModalContent className="max-h-[90vh] flex flex-col">
        {/* Header del Modal con Filtros */}
        <ModalHeader className="bg-gray-50 p-4 border-b">
          <div className="flex flex-wrap gap-4 items-center">
            <Input
              isClearable
              className="flex-1 min-w-[200px]"
              placeholder="Buscar controles..."
              startContent={<SearchCheckIcon className="text-gray-400" />}
              value={textoBusqueda}
              onClear={() => handleBusquedaChange("")}
              onValueChange={handleBusquedaChange}
            />

            <FilasPorPagina
              filasPorPagina={filasPorPagina}
              onChange={handleRowsPerPageChange}
            />

            <FiltroFecha
              fechaInicio={rangoFechas.fechaInicio}
              fechaFin={rangoFechas.fechaFin}
              onChange={handleFechaChange}
              onLimpiar={handleLimpiarFechas}
            />
          </div>
        </ModalHeader>

        {/* Cuerpo del Modal con la Tabla */}
        <ModalBody className="flex-1 overflow-auto p-4">
          <div className="p-0">
            <Table className="w-full">
              <TableHeader>
                {columnasControles.map((column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                ))}
              </TableHeader>
              <TableBody
                items={datosPagina}
                emptyContent="No hay controles para mostrar con los filtros aplicados."
              >
                {/* ¡¡LA CORRECCIÓN FINAL PARA ESTE ERROR ES AQUÍ!! */}
                {/* La función que se pasa a TableBody debe devolver un `TableRow` */}
                {(item: RenderedControlItem) => (
                  <TableRow key={item.id_fila_unica}>
                    {/* El contenido de TableRow es directamente un array de TableCell's */}
                    {columnasControles.map((column) => (
                      <TableCell key={column.uid}>
                        {renderControlCelda(item, column.uid)}
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </ModalBody>

        {/* Footer del Modal con Paginación y Botón de Cerrar */}
        <ModalFooter className="bg-gray-50 p-4 border-t w-full flex justify-between items-center">
          <PaginacionTabla
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            onCambiarPagina={setPaginaActual}
          />
          <Button color="danger" variant="solid" onPress={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
