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
import { DetalleCosecha } from "../../types"; // Asegúrate de que esta ruta sea correcta
import { FiltroFecha } from "@/components/ui/filtroFecha"; // Asume que esta ruta es correcta
import { FilasPorPagina } from "@/components/ui/table/filasPorPagina"; // Asume que esta ruta es correcta
import { PaginacionTabla } from "@/components/ui/table/PaginacionTabla"; // Asume que esta ruta es correcta
import { SearchCheckIcon } from "lucide-react"; // Asegúrate de que 'lucide-react' esté instalado

interface CosechasModalProps {
  isOpen: boolean;
  onClose: () => void;
  cosechas: DetalleCosecha[]; // La lista COMPLETA de cosechas
}

export const CosechasModal = ({
  isOpen,
  onClose,
  cosechas,
}: CosechasModalProps) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [filasPorPagina, setFilasPorPagina] = useState(10);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [rangoFechas, setRangoFechas] = useState({
    fechaInicio: null as string | null,
    fechaFin: null as string | null,
  });

  // Efecto para resetear la paginación cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      setPaginaActual(1);
      setTextoBusqueda("");
      setRangoFechas({ fechaInicio: null, fechaFin: null });
      setFilasPorPagina(10); // O tu valor por defecto preferido
    }
  }, [isOpen]);

  const datosFiltrados = useMemo(() => {
    let resultado = [...cosechas];

    // 1. Filtrar por búsqueda de texto
    if (textoBusqueda) {
      const busqueda = textoBusqueda.toLowerCase();
      resultado = resultado.filter(
        (item) =>
          // Aquí puedes especificar en qué campos quieres buscar (ej. cantidad, unidad)
          item.cantidad?.toString().toLowerCase().includes(busqueda) ||
          item.unidad?.toLowerCase().includes(busqueda) ||
          (item.fecha
            ? new Date(item.fecha + "T00:00:00")
                .toLocaleDateString("es-CO")
                .toLowerCase()
                .includes(busqueda)
            : false)
      );
    }

    // 2. Filtrar por rango de fechas
    if (rangoFechas.fechaInicio || rangoFechas.fechaFin) {
      resultado = resultado.filter((item) => {
        if (!item.fecha) return false;

        // Creamos objetos Date a partir de la cadena de fecha del item, asegurando medianoche local.
        const fechaItem = new Date(item.fecha + "T00:00:00");

        // Creamos objetos Date para el inicio y fin del rango, también en medianoche local.
        const inicio = rangoFechas.fechaInicio
          ? new Date(rangoFechas.fechaInicio + "T00:00:00")
          : null;

        // Para la fecha fin, aseguramos que incluya todo el día hasta el último milisegundo.
        const fin = rangoFechas.fechaFin
          ? new Date(rangoFechas.fechaFin + "T23:59:59.999")
          : null;

        const cumpleInicio = !inicio || fechaItem >= inicio;
        const cumpleFin = !fin || fechaItem <= fin;

        return cumpleInicio && cumpleFin;
      });
    }

    return resultado;
  }, [cosechas, textoBusqueda, rangoFechas]);

  // Manejo de paginación: si los filtros reducen los resultados y la página actual ya no existe
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

  const columnasCosechas = [
    { uid: "cantidad", name: "Cantidad" },
    { uid: "unidad", name: "Unidad" },
    { uid: "fecha", name: "Fecha" },
  ];

  const renderCosechaCelda = (item: DetalleCosecha, columnKey: string) => {
    switch (columnKey) {
      case "cantidad":
        return <span>{item.cantidad}</span>;
      case "unidad":
        return <span>{item.unidad || "-"}</span>;
      case "fecha":
        // Formatear la fecha para la visualización.
        // Se usa 'T00:00:00' para que `new Date()` interprete la cadena en la zona horaria local,
        // evitando el desfase de un día.
        return (
          <span>
            {new Date(item.fecha + "T00:00:00").toLocaleDateString("es-CO")}
          </span>
        );
      default:
        // Asegura que el valor no sea null/undefined antes de llamar a toString()
        return (
          <span>
            {item[columnKey as keyof DetalleCosecha]?.toString() || ""}
          </span>
        );
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
              placeholder="Buscar cosechas..." // Texto de búsqueda específico
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
                {columnasCosechas.map((column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                ))}
              </TableHeader>
              <TableBody
                items={datosPagina} // Usa los datos ya filtrados y paginados
                emptyContent="No hay cosechas para mostrar con los filtros aplicados."
              >
                {/* ¡CORRECCIÓN AQUÍ! La función solo recibe el `item`. */}
                {(item: DetalleCosecha) => (
                  <TableRow
                    key={
                      item.id ||
                      `${item.fecha}-${item.cantidad}-${item.unidad || "no-unit"}`
                    }
                  >
                    {columnasCosechas.map((column) => (
                      <TableCell key={column.uid}>
                        {renderCosechaCelda(item, column.uid)}
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
