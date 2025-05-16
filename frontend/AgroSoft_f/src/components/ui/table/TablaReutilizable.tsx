import React from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip, SortDescriptor
} from "@heroui/react";
import { useFiltrado } from "../../../hooks/useFiltrado";
import { useFilasPorPagina } from "../../../hooks/useFilasPorPagina";
import { usePaginacion } from "../../../hooks/usePaginacion";
import { useColumnasVisibles } from "@/hooks/useColumnasVisibles";
import { FiltrosTabla } from "./FiltrosTabla";
import { FilasPorPagina } from "./filasPorPagina";
import { PaginacionTabla } from "./PaginacionTabla";
import { PlusIcon } from "lucide-react";
import { SelectorColumnas } from "./SelectorDeColumnas";

interface TablaReutilizableProps<T extends { [key: string]: any }> {
  datos: T[];
  columnas: { name: string; uid: string; sortable?: boolean }[];
  claveBusqueda: keyof T;
  opcionesEstado?: { uid: string; nombre: string }[];
  renderCell: (item: T, columnKey: React.Key) => React.ReactNode;
  onCrearNuevo: () => void;
  onRegistroMasivo?: () => void;
  placeholderBusqueda?: string;
  initialVisibleColumns?: string[]; // Nueva prop
  renderReporteAction?: (data: T[]) => React.ReactNode;
}

export const TablaReutilizable = <T extends { [key: string]: any }>({
  renderReporteAction,
  datos,
  columnas,
  claveBusqueda,
  opcionesEstado = [],
  renderCell,
  onCrearNuevo,
  onRegistroMasivo = undefined,
  placeholderBusqueda = "Buscar...",
  initialVisibleColumns = columnas.map(c => c.uid), // Por defecto todas visibles
}: TablaReutilizableProps<T>) => {
  // Hooks existentes
  const {
    valorFiltro,
    setValorFiltro,
    filtroEstado,
    setFiltroEstado,
    datosFiltrados,
  } = useFiltrado(datos, claveBusqueda);

  const { filasPorPagina, handleChangeFilasPorPagina } = useFilasPorPagina(5);
  const { paginaActual, setPaginaActual, totalPaginas, datosPaginados } =
    usePaginacion(datosFiltrados, filasPorPagina);

  // Nuevos hooks
  const { visibleColumns, setVisibleColumns } = useColumnasVisibles(initialVisibleColumns);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "id", // Columna por defecto para ordenar
    direction: "ascending", // Dirección por defecto
  });

  // Filtrar columnas visibles
  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columnas;
    return columnas.filter((col) => Array.from(visibleColumns).includes(col.uid));
  }, [visibleColumns, columnas]);

  // Ordenar datos
  const sortedItems = React.useMemo(() => {
    return [...datosPaginados].sort((a: T, b: T) => {
      const first = a[sortDescriptor.column as keyof T];
      const second = b[sortDescriptor.column as keyof T];

      // Comparación básica para strings/numbers
      const cmp = String(first).localeCompare(String(second));

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [datosPaginados, sortDescriptor]);

  return (
    <div className="min-w-[800px] flex flex-col gap-3 max-w-4xl mx-auto p-4 bg-white rounded-lg shadow"> {/* Mantenemos el min-w en el contenedor */}
      {/* Barra superior de controles - ESTRUCTURA CORREGIDA */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-center">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 items-center">
          <FiltrosTabla
            valorFiltro={valorFiltro}
            onCambiarBusqueda={setValorFiltro}
            onLimpiarBusqueda={() => setValorFiltro("")}
            opcionesEstado={opcionesEstado}
            filtroEstado={filtroEstado}
            onCambiarFiltroEstado={setFiltroEstado}
            placeholderBusqueda={placeholderBusqueda}
          />
          <FilasPorPagina
            filasPorPagina={filasPorPagina}
            onChange={handleChangeFilasPorPagina}
          />
        </div>
        <div className="flex gap-3 items-center">
          <SelectorColumnas
            columnas={columnas}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
          />
          <Button
            color="success"
            size="sm"
            endContent={<PlusIcon size={16} />}
            onPress={onCrearNuevo}
            className="self-end text-white"
          >
            Agregar
          </Button>
          {onRegistroMasivo !== undefined && (
            <Button
              color="success"
              size="sm"
              endContent={<PlusIcon size={16} />}
              onPress={onRegistroMasivo}
              className="self-end text-white"
            >
              Registro masivo
            </Button>
          )}
          {renderReporteAction && renderReporteAction(datos)}
        </div>
      </div>

      {/* Tabla con estilos */}
      <div className="overflow-auto">
        <Table
          aria-label="Tabla reutilizable"
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg"
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
                className="bg-gray-100 text-left font-semibold text-gray-700 py-3 px-4"
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <p className="text-gray-500 text-sm mb-2">No se encontraron registros</p>
                <Button size="sm" variant="flat" onPress={onCrearNuevo}>
                  Crear nuevo registro
                </Button>
              </div>
            }
          >
            {sortedItems.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                {(columnKey) => (
                  <TableCell className="py-3 px-4 border-b text-gray-700">
                    {columnKey === "status" && item.status ? (
                      <Chip>{item.status}</Chip>
                    ) : (
                      renderCell(item, columnKey)
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <PaginacionTabla
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onCambiarPagina={setPaginaActual}
      />
    </div>
  );
};