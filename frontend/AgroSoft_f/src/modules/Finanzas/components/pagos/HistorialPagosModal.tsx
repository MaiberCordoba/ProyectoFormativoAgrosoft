import React, { useState, useEffect, useMemo } from "react";
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
} from "@heroui/react";
import apiClient from "@/api/apiClient";
import { TiempoActividadControl } from "../../types";
import { FiltrosTabla } from "@/components/ui/table/FiltrosTabla";
import { FiltroFecha } from "@/components/ui/filtroFecha";
import { FilasPorPagina } from "@/components/ui/table/filasPorPagina";
import { PaginacionTabla } from "@/components/ui/table/PaginacionTabla";

interface HistorialPagosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HistorialPagosModal: React.FC<HistorialPagosModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [todosLosRegistros, setTodosLosRegistros] = useState<
    TiempoActividadControl[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const [filterValue, setFilterValue] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      apiClient
        .get<TiempoActividadControl[]>("/tiempoActividadesControles/")
        .then((response) => {
          const pagosRealizados = response.data.filter(
            (p) => p.estado_pago === "PAGADO"
          );
          setTodosLosRegistros(pagosRealizados);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error al cargar historial de pagos:", err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    let currentFiltered = todosLosRegistros;

    if (startDate) {
      const startOfDay = new Date(startDate + "T00:00:00"); // Asegura que se interprete correctamente
      startOfDay.setHours(0, 0, 0, 0);
      currentFiltered = currentFiltered.filter(
        (item) => new Date(item.fecha) >= startOfDay
      );
    }
    if (endDate) {
      const endOfDay = new Date(endDate + "T00:00:00"); // Asegura que se interprete correctamente
      endOfDay.setHours(23, 59, 59, 999);
      currentFiltered = currentFiltered.filter(
        (item) => new Date(item.fecha) <= endOfDay
      );
    }

    if (filterValue) {
      const lowercasedFilter = filterValue.toLowerCase();
      currentFiltered = currentFiltered.filter(
        (item) =>
          item.actividad?.usuario?.nombre
            ?.toLowerCase()
            .includes(lowercasedFilter) ||
          item.actividad?.usuario?.apellidos
            ?.toLowerCase()
            .includes(lowercasedFilter) ||
          item.control?.usuario?.nombre
            ?.toLowerCase()
            .includes(lowercasedFilter) ||
          item.control?.usuario?.apellidos
            ?.toLowerCase()
            .includes(lowercasedFilter) ||
          item.valorTotal.toString().includes(lowercasedFilter) ||
          (item.fk_actividad ? "actividad" : "control").includes(
            lowercasedFilter
          )
      );
    }

    return currentFiltered;
  }, [todosLosRegistros, startDate, endDate, filterValue]);

  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const handleDateFilterChange = (filtros: {
    fechaInicio: string | null;
    fechaFin: string | null;
  }) => {
    setStartDate(filtros.fechaInicio);
    setEndDate(filtros.fechaFin);
    setPage(1);
  };

  const handleClearDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setPage(1);
  };

  const handleClearSearch = () => {
    setFilterValue("");
    setPage(1);
  };

  const columns = [
    { uid: "usuario", name: "Usuario" },
    { uid: "fecha", name: "Fecha de Pago" },
    { uid: "valorTotal", name: "Valor Pagado" },
    { uid: "tipo", name: "Tipo" },
  ];

  const renderCell = (
    item: TiempoActividadControl,
    columnKey: keyof TiempoActividadControl | "tipo"
  ) => {
    switch (columnKey) {
      case "usuario":
        const userName =
          item.actividad?.usuario?.nombre || item.control?.usuario?.nombre;
        const userLastName =
          item.actividad?.usuario?.apellidos ||
          item.control?.usuario?.apellidos;
        return (
          <span className="font-medium text-gray-800">
            {userName} {userLastName}
          </span>
        );
      case "fecha":
        // Asegúrate de formatear la fecha aquí también para evitar sorpresas visuales
        return (
          <span className="text-sm text-gray-600">
            {new Date(item.fecha).toLocaleDateString("es-CO", {
              timeZone: "UTC",
            })}
          </span>
        );
      case "valorTotal":
        return (
          <span className="font-semibold text-green-700">
            ${item.valorTotal?.toFixed(2) || "0.00"}
          </span>
        );
      case "tipo":
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              item.fk_actividad
                ? "bg-blue-100 text-blue-700"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            {item.fk_actividad ? "Actividad" : "Control"}
          </span>
        );
      default:
        return String(item[columnKey as keyof TiempoActividadControl]);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      className="max-w-4xl mx-auto shadow-xl rounded-lg"
    >
      <ModalContent className="max-h-[90vh] overflow-hidden">
        <ModalHeader className="flex flex-col gap-1 text-center bg-green-50 text-green-800 py-4 rounded-t-lg">
          <h2 className="text-xl font-bold">Historial de Pagos Realizados</h2>
        </ModalHeader>

        <ModalBody className="overflow-y-auto max-h-[70vh] p-6 bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            {/* Contenedor de búsqueda y filas por página */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <FiltrosTabla
                valorFiltro={filterValue}
                onCambiarBusqueda={(value) => {
                  setFilterValue(value);
                  setPage(1);
                }}
                onLimpiarBusqueda={handleClearSearch}
                placeholderBusqueda="Buscar por usuario o valor..."
              />
              <FilasPorPagina
                filasPorPagina={rowsPerPage}
                onChange={(value) => {
                  setRowsPerPage(value);
                  setPage(1);
                }}
              />
            </div>

            {/* Filtro de Fecha */}
            <FiltroFecha
              fechaInicio={startDate}
              fechaFin={endDate}
              onChange={handleDateFilterChange}
              onLimpiar={handleClearDateFilter}
            />
          </div>

          <Table aria-label="Tabla Historial de Pagos" className="min-w-full">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  className="bg-green-100 text-green-800 font-semibold text-sm px-4 py-3 border-b border-green-200"
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={paginatedItems}
              emptyContent={
                loading
                  ? "Cargando historial..."
                  : "No hay pagos registrados para los filtros seleccionados"
              }
            >
              {(item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  {(columnKey) => (
                    <TableCell className="py-3 px-4 border-b border-gray-200 text-gray-700">
                      {renderCell(
                        item,
                        columnKey as keyof TiempoActividadControl | "tipo"
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Mueve la paginación a un div separado sin fondo gris si se prefiere */}
          <div className="flex justify-between items-center mt-6 p-0">
            {" "}
            {/* Eliminamos el fondo gris aquí */}
            {/* FilasPorPagina ya no está aquí, fue movido arriba */}
            <PaginacionTabla
              paginaActual={page}
              totalPaginas={totalPages}
              onCambiarPagina={setPage}
            />
          </div>
        </ModalBody>

        <ModalFooter className="py-3 px-6 flex justify-end rounded-b-lg">
          {" "}
          {/* Quita el bg-gray-100 */}
          <Button color="danger" variant="solid" onPress={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default HistorialPagosModal;
