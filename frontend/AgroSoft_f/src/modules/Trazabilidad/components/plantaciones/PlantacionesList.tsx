import React, { useState } from "react";
import { useGetPlantaciones } from "../../hooks/plantaciones/useGetPlantaciones";
import { useEditarPlantaciones } from "../../hooks/plantaciones/useEditarPlantaciones";
import { useCrearPlantaciones } from "../../hooks/plantaciones/useCrearPlantaciones";
import { useEliminarPlantaciones } from "../../hooks/plantaciones/useEliminarPlantaciones";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarPlantacionModal from "./EditarPlantacionesModal";
import { CrearPlantacionModal } from "./CrearPlantacionesModal";
import EliminarPlantacionModal from "./EliminarPlantaciones";
import { Plantaciones } from "../../types";

import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { ReportePdfPlantaciones } from "./ReportePdfPlantaciones";
import { Download } from "lucide-react";

export function PlantacionesList() {
  const { data, isLoading, error } = useGetPlantaciones();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    PlantacionesEditada,
    handleEditar,
  } = useEditarPlantaciones();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearPlantaciones();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    PlantacionesEliminada,
    handleEliminar,
  } = useEliminarPlantaciones();

  // Estado para mostrar/ocultar previsualización PDF
  const [showPreview, setShowPreview] = useState(false);

  const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      cultivo: {
        id: 0,
        nombre: "",
        activo: false,
        especies: {
          id: 0,
          nombre: "",
          descripcion: "",
          tiempocrecimiento: "",
          tiposEspecie: { id: 0, nombre: "", descripcion: "", img: "" },
          fk_tipoespecie: 0,
        },
        fk_Especie: 0,
      },
      semillero: null,
      eras: {
        id: 0,
        tipo: "",
        fk_lote: {
          id: 0,
          nombre: "",
          descripcion: "",
          latI1: 0,
          longI1: 0,
          latS1: 0,
          longS1: 0,
          latI2: 0,
          longI2: 0,
          latS2: 0,
          longS2: 0,
          estado: null,
        },
        latI1: 0,
        longI1: 0,
        latS1: 0,
        longS1: 0,
        latI2: 0,
        longI2: 0,
        latS2: 0,
        longS2: 0,
      },
      unidades: 0,
      fechaSiembra: "",
      creado: "",
      fk_semillero: null,
      fk_Cultivo: 0,
      fk_Era: 0,
    });
  };

  const columnas = [
    { name: "Cultivo", uid: "cultivo", sortable: true },
    { name: "Semillero", uid: "semillero", sortable: false },
    { name: "Unidades", uid: "unidades", sortable: true },
    { name: "Fecha Siembra", uid: "fechaSiembra", sortable: true },
    { name: "Era - Lote", uid: "eras", sortable: true },
    { name: "Acciones", uid: "acciones", sortable: false },
  ];

  const renderCell = (item: Plantaciones, columnKey: React.Key) => {
    switch (columnKey) {
      case "cultivo":
        return <span>{item.cultivo?.nombre || "Sin nombre"}</span>;
      case "semillero":
        return (
          <span>
            {item.semillero
              ? `Semillero: ${item.semillero.cultivo?.nombre || "Sin nombre"}`
              : "Sin semillero"}
          </span>
        );
      case "unidades":
        return <span>{item.unidades ?? "N/A"}</span>;
      case "fechaSiembra":
        return (
          <span>
            {item.fechaSiembra
              ? new Date(item.fechaSiembra).toLocaleDateString("es-CO")
              : "N/A"}
          </span>
        );
      case "eras":
        return (
          <span>
            {item.eras?.tipo ? (
              <>
                {item.eras.tipo}
                {" - "}
                {item.eras.Lote?.nombre ?? "Sin lote"}
              </>
            ) : (
              `Era ${item.eras?.id ?? "N/A"}`
            )}
          </span>
        );
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return (
          <span>{String(item[columnKey as keyof Plantaciones] ?? "N/A")}</span>
        );
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las plantaciones</p>;

  const datosConCultivoNombre = (data || []).map((item) => ({
    ...item,
    cultivoNombre: item.cultivo?.nombre?.toLowerCase() || "",
  }));

  return (
    <div className="p-4 space-y-4">
      <TablaReutilizable
        datos={datosConCultivoNombre}
        columnas={columnas}
        claveBusqueda="cultivoNombre"
        placeholderBusqueda="Buscar por cultivo"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
        renderReporteAction={(data) => (
          <>
            {/* Botón para mostrar la previsualización */}
            <button
              onClick={() => setShowPreview(true)}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors mr-2"
              title="Mostrar previsualización"
            >
              👁️
            </button>

            <PDFDownloadLink
              document={<ReportePdfPlantaciones plantaciones={data} />}
              fileName="reporte_plantaciones.pdf"
            >
              {({ loading }) => (
                <button
                  className="p-2 rounded-full hover:bg-red-100 transition-colors"
                  title="Descargar reporte"
                >
                  {loading ? (
                    <Download className="h-4 w-4 animate-spin text-blue-500" />
                  ) : (
                    <Download className="h-5 w-5 text-red-600" />
                  )}
                </button>
              )}
            </PDFDownloadLink>
          </>
        )}
      />

      {/* Mostrar previsualización solo cuando showPreview sea true */}
      {showPreview && (
        <div className="border rounded mt-4 relative">
          <h2 className="text-sm font-semibold px-2 py-1 bg-gray-100 flex justify-between items-center">
            Vista previa del PDF
            <button
              onClick={() => setShowPreview(false)}
              className="text-red-500 font-bold px-2 hover:text-red-700"
              title="Cerrar previsualización"
            >
              ❌
            </button>
          </h2>
          <PDFViewer width="100%" height={600}>
            <ReportePdfPlantaciones plantaciones={data || []} />
          </PDFViewer>
        </div>
      )}

      {isEditModalOpen && PlantacionesEditada && (
        <EditarPlantacionModal
          plantacion={PlantacionesEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearPlantacionModal onClose={closeCreateModal} onCreate={() => {}} />
      )}

      {isDeleteModalOpen && PlantacionesEliminada && (
        <EliminarPlantacionModal
          plantacion={PlantacionesEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
