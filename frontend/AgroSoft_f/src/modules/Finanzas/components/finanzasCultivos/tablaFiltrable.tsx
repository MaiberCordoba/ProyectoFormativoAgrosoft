import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Input,
  Divider
} from '@heroui/react';
import { FiltroFecha } from '@/components/ui/filtroFecha';
import { FilasPorPagina } from '@/components/ui/table/filasPorPagina';
import { PaginacionTabla } from '@/components/ui/table/PaginacionTabla';
import { SearchCheckIcon } from 'lucide-react';



interface ColumnaTabla {
  key: string;
  label: string;
  permiteOrdenar?: boolean;
}

interface TablaFiltrableProps<T> {
  datos: T[];
  columnas: ColumnaTabla[];
  mostrarFiltroBusqueda?: boolean;
  mostrarFiltroFecha?: boolean;
  textoBusquedaPlaceholder?: string;
  renderFila: (item: T) => React.ReactNode;
  claveUnica: (item: T) => string;
}

export const TablaFiltrable = <T extends Record<string, any>>({
  datos,
  columnas,
  mostrarFiltroBusqueda = true,
  mostrarFiltroFecha = true,
  textoBusquedaPlaceholder = 'Buscar...',
  renderFila,
  claveUnica
}: TablaFiltrableProps<T>) => {
  // Estados para filtros
  const [paginaActual, setPaginaActual] = useState(1);
  const [filasPorPagina, setFilasPorPagina] = useState(5);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [rangoFechas, setRangoFechas] = useState({
    fechaInicio: null as string | null,
    fechaFin: null as string | null
  });

  // Filtrar datos
  const datosFiltrados = useMemo(() => {
    let resultado = [...datos];

    // Filtro por texto de búsqueda
    if (textoBusqueda) {
      const busqueda = textoBusqueda.toLowerCase();
      resultado = resultado.filter(item =>
        Object.values(item).some(
          val => val?.toString().toLowerCase().includes(busqueda)
      ));
    }

    // Filtro por fecha (si el objeto tiene propiedad fecha)
    if (mostrarFiltroFecha && (rangoFechas.fechaInicio || rangoFechas.fechaFin)) {
      resultado = resultado.filter(item => {
        if (!item.fecha) return true;
        
        const fechaItem = new Date(item.fecha);
        const cumpleInicio = !rangoFechas.fechaInicio || 
                         fechaItem >= new Date(rangoFechas.fechaInicio);
        const cumpleFin = !rangoFechas.fechaFin || 
                        fechaItem <= new Date(new Date(rangoFechas.fechaFin).setHours(23, 59, 59, 999));

        return cumpleInicio && cumpleFin;
      });
    }

    return resultado;
  }, [datos, textoBusqueda, rangoFechas, mostrarFiltroFecha]);

  // Paginación
  const totalPaginas = Math.ceil(datosFiltrados.length / filasPorPagina);
  const datosPagina = datosFiltrados.slice(
    (paginaActual - 1) * filasPorPagina,
    paginaActual * filasPorPagina
  );

  // Resetear paginación cuando cambian los filtros
  React.useEffect(() => {
    setPaginaActual(1);
  }, [textoBusqueda, rangoFechas, filasPorPagina]);

  const limpiarFiltroFecha = () => {
    setRangoFechas({ fechaInicio: null, fechaFin: null });
  };

  return (
    <div className="space-y-4">
      {/* Barra de filtros */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        {mostrarFiltroBusqueda && (
          <Input
            isClearable
            className="flex-1 min-w-[200px]"
            placeholder={textoBusquedaPlaceholder}
            startContent={<SearchCheckIcon className="text-default-400" />}
            value={textoBusqueda}
            onClear={() => setTextoBusqueda('')}
            onValueChange={setTextoBusqueda}
          />
        )}

        {mostrarFiltroFecha && (
          <FiltroFecha
            fechaInicio={rangoFechas.fechaInicio}
            fechaFin={rangoFechas.fechaFin}
            onChange={setRangoFechas}
            onLimpiar={limpiarFiltroFecha}
          />
        )}

        <FilasPorPagina
          filasPorPagina={filasPorPagina}
          onChange={setFilasPorPagina}
        />
      </div>

      <Divider />

      {/* Tabla */}
      <div className="overflow-auto max-h-[500px]">
        <Table aria-label="Tabla de datos">
          <TableHeader>
            {columnas.map(columna => (
              <TableColumn 
                key={columna.key}
                allowsSorting={columna.permiteOrdenar}
              >
                {columna.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {datosPagina.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnas.length} className="text-center py-4">
                  No se encontraron resultados
                </TableCell>
              </TableRow>
            ) : (
              datosPagina.map(item => (
                <React.Fragment key={claveUnica(item)}>
                  {renderFila(item)}
                </React.Fragment>
              ))
            )}
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