import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";

interface TableComponentProps<T> {
  columns: { key: keyof T; label: string }[]; // Definimos las columnas de la tabla dinámicamente
  data: T[]; // Recibimos cualquier tipo de datos
}

const TableComponent = <T,>({ columns, data }: TableComponentProps<T>) => {
  return (
    <Table aria-label="Tabla dinámica">
      <TableHeader>
        {columns.map(column => (
          <TableColumn key={column.key as string}>{column.label}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map(column => (
              <TableCell key={`${rowIndex}-${column.key as string}`}>
                {String(row[column.key])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableComponent;
