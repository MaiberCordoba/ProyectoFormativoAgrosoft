import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { addToast } from "@heroui/react";
import apiClient from '@/api/apiClient';
import ModalComponent from '@/components/Modal';

interface RegistroMasivoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistroMasivoModal: React.FC<RegistroMasivoModalProps> = ({ isOpen, onClose }) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Plantilla actualizada con solo 3 campos
  const usuariosTemplate = [
    { nombre: 'Ej: Carlos', apellido: 'Ej: Rojas', identificacion: 123456789 },
    { nombre: 'Ej: Ana', apellido: 'Ej: Méndez', identificacion: 987654321 }
  ];

  const handleSeleccionarArchivo = () => {
    inputFileRef.current?.click();
  };

  const handleArchivoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('archivo', archivo);

    try {
      // Asegúrate de que esta ruta coincida con tu backend
      const response = await apiClient.post('usuarios/carga-masiva/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Respuesta del servidor:', response.data);
      
      // Mensaje basado en la nueva estructura de respuesta
      const successMessage = response.data.errores > 0
        ? `Registro parcial: ${response.data.exitosos} éxitos, ${response.data.errores} errores`
        : `¡Éxito! ${response.data.exitosos} usuarios registrados`;

      addToast({
        title: response.data.errores > 0 ? "Advertencia" : "Éxito",
        description: successMessage,
        timeout: 5000,
        color: response.data.errores > 0 ? "warning" : "success",
      });

      // Mostrar detalles de errores si existen
      if (response.data.errores > 0 && response.data.detalle_errores) {
        console.error('Errores detallados:', response.data.detalle_errores);
        
        // Opcional: Mostrar un toast adicional con el primer error
        const primerError = response.data.detalle_errores[0];
        addToast({
          title: "Error en fila",
          description: `Fila ${primerError.fila}: ${primerError.errores}`,
          timeout: 6000,
          color: "danger",
        });
      }

      onClose();
    } catch (error: any) {
      console.error('Error al enviar el archivo:', error);
      
      // Manejo mejorado de errores
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.mensaje 
        || "Error desconocido al procesar el archivo";

      addToast({
        title: "Error",
        description: errorMessage,
        timeout: 5000,
        color: "danger",
      });
    } finally {
      setIsLoading(false);
      // Limpiar input para permitir nueva selección
      if (inputFileRef.current) inputFileRef.current.value = '';
    }
  };

  const exportarAExcel = () => {
    try {
      // Solo exportar los 3 campos necesarios
      const hoja = usuariosTemplate.map(user => ({
        nombre: user.nombre,
        apellido: user.apellido,
        identificacion: user.identificacion
      }));

      const libro = XLSX.utils.book_new();
      const hojaExcel = XLSX.utils.json_to_sheet(hoja);
      XLSX.utils.book_append_sheet(libro, hojaExcel, 'Usuarios');
      XLSX.writeFile(libro, 'plantilla_registro_usuarios.xlsx');
      
      addToast({
        title: "Plantilla descargada",
        description: "El archivo de plantilla se descargó correctamente",
        timeout: 3000,
        color: "success",
      });
    } catch (error) {
      console.error("Error al exportar Excel:", error);
      addToast({
        title: "Error",
        description: "No se pudo generar la plantilla",
        timeout: 3000,
        color: "danger",
      });
    }
  };

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      title="Registro Masivo de Usuarios"
      footerButtons={[]}
    >
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          El archivo Excel debe contener solo estas 3 columnas:
        </p>
        <ul className="list-disc pl-5 text-sm">
          <li><strong>nombre</strong> (texto)</li>
          <li><strong>apellido</strong> (texto)</li>
          <li><strong>identificacion</strong> (número)</li>
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleSeleccionarArchivo}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg font-semibold ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 text-black'
          } transition-all duration-300`}
        >
          {isLoading ? 'Subiendo...' : 'Subir Excel'}
        </button>

        <input
          type="file"
          accept=".xlsx, .xls"
          ref={inputFileRef}
          onChange={handleArchivoChange}
          className="hidden"
          disabled={isLoading}
        />

        <button
          onClick={exportarAExcel}
          className="px-4 py-2 bg-blue-600 text-black font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          Descargar Plantilla
        </button>
      </div>

      {isLoading && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Procesando archivo, por favor espera...</p>
        </div>
      )}
    </ModalComponent>
  );
};

export default RegistroMasivoModal;