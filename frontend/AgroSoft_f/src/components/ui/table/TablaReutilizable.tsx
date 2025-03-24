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
  opcionesEstado, // Ahora es opcional
  renderCell,
  onCrearNuevo,
  placeholderBusqueda = "Buscar por nombre...",
}: TablaReutilizableProps<T>) => {
  // Hook de filtrado
  const {
    valorFiltro,
    setValorFiltro,
    filtroEstado,
    setFiltroEstado,
    datosFiltrados,
  } = useFiltrado(datos, claveBusqueda);

  // Hook de filas por página
  const { filasPorPagina, handleChangeFilasPorPagina } = useFilasPorPagina(5);

  // Hook de paginación
  const { paginaActual, setPaginaActual, totalPaginas, datosPaginados } =
    usePaginacion(datosFiltrados, filasPorPagina);

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto">
      
      <div className="flex justify-between items-center gap-4">
        
        <FiltrosTabla
          valorFiltro={valorFiltro}
          onCambiarBusqueda={setValorFiltro}
          onLimpiarBusqueda={() => setValorFiltro("")}
          opcionesEstado={opcionesEstado} // Opcional
          filtroEstado={filtroEstado}
          onCambiarFiltroEstado={setFiltroEstado}
          placeholderBusqueda={placeholderBusqueda}
        />

   
        <ButtonGlobal color="success" variant="flat" onPress={onCrearNuevo}>
          Agregar
        </ButtonGlobal>
      </div>

     
      <FilasPorPagina
        filasPorPagina={filasPorPagina}
        onChange={handleChangeFilasPorPagina}
      />

  
      <Table aria-label="Tabla reutilizable">
        <TableHeader columns={columnas}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No se encontraron datos"}>
          {datosPaginados.map((item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>

   
      <PaginacionTabla
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onCambiarPagina={setPaginaActual}
      />
    </div>
  );
};