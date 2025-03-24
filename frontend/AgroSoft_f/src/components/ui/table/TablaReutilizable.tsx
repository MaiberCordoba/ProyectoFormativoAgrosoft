import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { useFiltrado } from "../../../hooks/useFiltrado";
import { useFilasPorPagina } from "../../../hooks/useFilasPorPagina";
import { usePaginacion } from "../../../hooks/usePaginacion";
import { FiltrosTabla } from "./FiltrosTabla";
import { FilasPorPagina } from "./filasPorPagina";
import { PaginacionTabla } from "./PaginacionTabla";
import ButtonGlobal from "../boton";

interface TablaReutilizableProps<T extends { [key: string]: any }> {
  datos: T[];
  columnas: { name: string; uid: string; sortable?: boolean }[];
  claveBusqueda: keyof T;
  opcionesEstado?: { uid: string; nombre: string }[];
  renderCell: (item: T, columnKey: React.Key) => React.ReactNode;
  onCrearNuevo: () => void;
  placeholderBusqueda?: string;
}

export const TablaReutilizable = <T extends { [key: string]: any }>({
  datos,
  columnas,
  claveBusqueda,
  opcionesEstado,
  renderCell,
  onCrearNuevo,
  placeholderBusqueda = "Buscar...",
}: TablaReutilizableProps<T>) => {
  // Hooks existentes...
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

  return (
    <div className="flex flex-col gap-2 max-w-4xl mx-auto -mt-4"> {/* Reducido gap-4 a gap-2 */}
      {/* Contenedor superior compacto */}
      <div className="flex justify-between items-center gap-2 mb-1"> {/* Reducido gap y añadido mb-1 */}
        <div className="flex items-center gap-2 flex-1"> {/* Contenedor flexible para alinear filtros */}
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

        <ButtonGlobal 
          color="success" 
          variant="flat" 
          onPress={onCrearNuevo}
          className="shrink-0" /* Evita que el botón se encoja */
        >
          Agregar
        </ButtonGlobal>
      </div>

      {/* Tabla con margen superior reducido */}
      <div className="mt-1"> {/* Reducido espacio superior */}
        <Table aria-label="Tabla reutilizable" className="border-separate border-spacing-0">
          <TableHeader columns={columnas}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
                className="py-2" /* Reduce padding en headers */
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={"No se encontraron datos"}>
            {datosPaginados.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                {(columnKey) => (
                  <TableCell className="py-2"> {/* Reduce padding en celdas */}
                    {renderCell(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginación con margen superior reducido */}
      <div className="mt-1"> {/* Reducido espacio superior */}
        <PaginacionTabla
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          onCambiarPagina={setPaginaActual}
        />
      </div>
    </div>
  );
};