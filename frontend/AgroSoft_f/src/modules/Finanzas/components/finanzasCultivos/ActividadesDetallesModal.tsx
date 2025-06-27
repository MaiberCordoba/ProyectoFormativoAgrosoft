import { useState, useMemo, useEffect } from "react";
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
import { DetalleActividad } from "../../types"; // Asegúrate de que esta ruta sea correcta
import { FiltroFecha } from "@/components/ui/filtroFecha";
import { FilasPorPagina } from "@/components/ui/table/filasPorPagina";
import { PaginacionTabla } from "@/components/ui/table/PaginacionTabla";
import { SearchCheckIcon } from "lucide-react";

interface ActividadesModalProps {
  isOpen: boolean;
  onClose: () => void;
  actividades: DetalleActividad[];
}

export const ActividadesModal = ({
  isOpen,
  onClose,
  actividades,
}: ActividadesModalProps) => {
  // Define un tipo para el item transformado para mejor tipado interno
  interface RenderedActivityItem extends DetalleActividad {
    insumo: {
      id?: number;
      nombre: string;
      cantidad: number;
      unidad: string;
      costo: number;
    };
    id_fila_unica: string;
  }

  const datosTransformados: RenderedActivityItem[] = useMemo(() => {
    return actividades.flatMap((actividad) =>
      actividad.insumos.map(
        (insumo, insumoIndex) =>
          ({
            ...actividad,
            insumo,
            fecha: actividad.fecha,
            id_fila_unica: `${actividad.id || "no-id"}-${insumo.id || insumoIndex}-${actividad.fecha}`,
          }) as RenderedActivityItem
      )
    );
  }, [actividades]);

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
          item.tipo_actividad?.toLowerCase().includes(busqueda) ||
          item.responsable?.toLowerCase().includes(busqueda) ||
          item.insumo.nombre?.toLowerCase().includes(busqueda) ||
          item.insumo.unidad?.toLowerCase().includes(busqueda) ||
          item.tiempo_total?.toString().toLowerCase().includes(busqueda) ||
          item.costo_mano_obra?.toString().toLowerCase().includes(busqueda) ||
          item.insumo.costo?.toString().toLowerCase().includes(busqueda) ||
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

  const columnasActividades = [
    { uid: "tipo_actividad", name: "Tipo" },
    { uid: "responsable", name: "Responsable" },
    { uid: "fecha", name: "Fecha" },
    { uid: "tiempo_total", name: "Tiempo (h)" },
    { uid: "costo_mano_obra", name: "Costo MO" },
    { uid: "insumo_costo", name: "Costo Insumo" },
    { uid: "insumo_nombre", name: "Nombre Insumo" },
    { uid: "insumo_cantidad", name: "Cantidad" },
    { uid: "insumo_unidad", name: "Unidad" },
  ];

  const renderActividadCelda = (
    item: RenderedActivityItem,
    columnKey: string
  ) => {
    switch (columnKey) {
      case "tipo_actividad":
        return <span>{item.tipo_actividad || "-"}</span>;
      case "responsable":
        return <span>{item.responsable || "-"}</span>;
      case "fecha":
        return (
          <span>
            {new Date(item.fecha + "T00:00:00").toLocaleDateString("es-CO")}
          </span>
        );
      case "tiempo_total":
        return (
          <span
            style={{ width: "80px", textAlign: "center", display: "block" }}
          >
            {item.tiempo_total}
          </span>
        );
      case "costo_mano_obra":
        return (
          <span>
            ${item.costo_mano_obra?.toLocaleString("es-CO") || "0.00"}
          </span>
        );
      case "insumo_costo":
        return (
          <span>${item.insumo.costo?.toLocaleString("es-CO") || "0.00"}</span>
        );
      case "insumo_nombre":
        return <span>{item.insumo.nombre || "-"}</span>;
      case "insumo_cantidad":
        return (
          <span
            style={{ width: "80px", textAlign: "center", display: "block" }}
          >
            {item.insumo.cantidad}
          </span>
        );
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
        {/* Header con Filtros */}
        <ModalHeader className="bg-gray-50 p-4 border-b">
          <div className="flex flex-wrap gap-4 items-center">
            <Input
              isClearable
              className="flex-1 min-w-[200px]"
              placeholder="Buscar actividades..."
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

        {/* Cuerpo que contendrá la tabla */}
        <ModalBody className="flex-1 overflow-auto p-4">
          <div className="p-0">
            <Table className="w-full">
              <TableHeader>
                {columnasActividades.map((column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                ))}
              </TableHeader>
              {/* ¡¡CORRECCIÓN CLAVE PARA EL ERROR DE TABLECELL/TABLEBODY!! */}
              <TableBody
                items={datosPagina}
                emptyContent="No hay actividades para mostrar con los filtros aplicados."
              >
                {/* Heroui/NextUI espera que la función del children de TableBody
                    devuelva directamente un <TableRow>. No hagas un map dentro de TableRow aquí. */}
                {(item: RenderedActivityItem) => (
                  <TableRow key={item.id_fila_unica}>
                    {/* Aquí, el map de TableCell debe ser directo. */}
                    {columnasActividades.map((column) => (
                      <TableCell key={column.uid}>
                        {renderActividadCelda(item, column.uid)}
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </ModalBody>

        {/* Footer con Paginación y Botón de Cerrar */}
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
