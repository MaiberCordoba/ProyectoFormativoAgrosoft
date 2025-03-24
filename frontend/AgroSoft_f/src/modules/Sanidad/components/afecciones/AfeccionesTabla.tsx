import { Afecciones } from "../../types";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";

interface AfeccionesTablaProps {
  data: Afecciones[];
  onEditar: (afeccion: Afecciones) => void;
  onCrearNuevo: () => void;
  onEliminar: (afeccion: Afecciones) => void;
}

export function AfeccionesTabla({ data, onEditar, onCrearNuevo, onEliminar }: AfeccionesTablaProps) {
  // Definir las columnas de la tabla
  const columnas = [
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Descripción", uid: "descripcion" },
    { name: "Tipo afectacion", uid: "tipoPlaga" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Función para renderizar las celdas
  const renderCell = (item: Afecciones, columnKey: React.Key) => {
    switch (columnKey) {
      case "nombre":
        return <span>{item.nombre}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "tipoPlaga":
        // Verifica si tipoPlaga está definido y tiene la propiedad nombre
        return <span>{item.tipoPlaga?.nombre || "No definido"}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => onEditar(item)} // Pasa la función handleEditar
            onEliminar={() => onEliminar(item)}
          />
        );
      default:
        const value = item[columnKey as keyof Afecciones];
        // Verificamos si `value` es un objeto y tiene la propiedad `nombre`
        if (value && typeof value === "object" && "nombre" in value) {
          return <span>{value.nombre}</span>;
        }
        // Si no es un objeto, lo convertimos a un string
        return <span>{String(value)}</span>;
    }
  };

  return (
    <TablaReutilizable
      datos={data} // Pasa los datos de las afecciones
      columnas={columnas} // Pasa las columnas definidas
      claveBusqueda="nombre"  // Define la clave de búsqueda
      placeholderBusqueda="buscar por nombre" //placeholder de busqueda
      renderCell={renderCell} // Pasa la función para renderizar las celdas
      onCrearNuevo={onCrearNuevo} // Pasa la función para crear una nueva afección
    />
  );
}