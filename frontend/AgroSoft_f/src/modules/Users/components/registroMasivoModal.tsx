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
  const [usuarios] = useState([
    { nombre: '', apellido: '', username: '', email: '', password: '' }
  ]);

  const handleSeleccionarArchivo = () => {
    inputFileRef.current?.click();
  };

  const handleArchivoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append('archivo', archivo);

    try {
      const response = await apiClient.post('usuarios/carga-masiva/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Respuesta del servidor:', response.data);

      addToast({
        title: "Éxito",
        description: "Archivo cargado correctamente.",
        timeout: 3000,
        color: "success",
      });

      onClose(); // Cerrar modal
    } catch (error: any) {
      console.error('Error al enviar el archivo:', error);

      addToast({
        title: "Error",
        description: error?.response?.data?.detail || "No se pudo cargar el archivo.",
        timeout: 3000,
        color: "danger",
      });
    }
  };

  const exportarAExcel = () => {
    try {
      const hoja = usuarios.map(({ nombre, apellido, username, email, password }) => ({
        nombre,
        apellido,
        username,
        email,
        password,
      }));

      const libro = XLSX.utils.book_new();
      const hojaExcel = XLSX.utils.json_to_sheet(hoja);
      XLSX.utils.book_append_sheet(libro, hojaExcel, 'Usuarios');
      XLSX.writeFile(libro, 'registro_usuarios.xlsx');
    } catch (error) {
      console.error("Error al exportar Excel:", error);

      addToast({
        title: "Error",
        description: "No se pudo exportar el Excel.",
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
      <div className="grid grid-cols-2 gap-4">
        {/* Botón para abrir el input de archivo */}
        <button
          onClick={handleSeleccionarArchivo}
          className="px-3 py-2 bg-green-600 text-black text-sm font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
        >
          Enviar Excel
        </button>

        {/* Input oculto para seleccionar archivo */}
        <input
          type="file"
          accept=".xlsx, .xls"
          ref={inputFileRef}
          onChange={handleArchivoChange}
          style={{ display: 'none' }}
        />

        {/* Botón para generar Excel */}
        <button
          onClick={exportarAExcel}
          className="px-3 py-2 bg-green-600 text-black text-sm font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
        >
          Generar Excel
        </button>
      </div>
    </ModalComponent>
  );
};

export default RegistroMasivoModal;
