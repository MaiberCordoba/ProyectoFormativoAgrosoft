import { useState, ChangeEvent } from "react";
import ModalComponent from "@/components/Modal";
import { Input, Checkbox } from "@heroui/react";
import { usePostUsers } from "../hooks/usePostUsers";

interface CrearUsersModalProps {
  onClose: () => void;
}

interface UserFormState {
  identificacion: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  telefono: string;
  correoElectronico: string;
  password: string;
  admin: boolean;
}

export const CrearUsersModal = ({ onClose }: CrearUsersModalProps) => {
  const [userData, setUserData] = useState<UserFormState>({
    identificacion: "",
    nombre: "",
    apellidos: "",
    fechaNacimiento: "",
    telefono: "",
    correoElectronico: "",
    password: "",
    admin: false
  });

  const { mutate, isPending } = usePostUsers();

  // Maneja cambios en inputs normales
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, field: keyof Omit<UserFormState, 'admin'>) => {
    setUserData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  // Maneja cambio específico del checkbox
  const handleAdminChange = (isChecked: boolean) => {
    setUserData(prev => ({
      ...prev,
      admin: isChecked
    }));
  };

  const handleSubmit = () => {
    if (!userData.identificacion || !userData.nombre || 
        !userData.correoElectronico || !userData.password) {
      console.log("Por favor, completa los campos requeridos.");
      return;
    }

    mutate(userData, {
      onSuccess: () => {
        onClose();
        setUserData({
          identificacion: "",
          nombre: "",
          apellidos: "",
          fechaNacimiento: "",
          telefono: "",
          correoElectronico: "",
          password: "",
          admin: false
        });
      }
    });
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Usuario"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit
        },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Identificación"
          type="number"
          value={userData.identificacion}
          onChange={(e) => handleInputChange(e, 'identificacion')}
          required
        />

        <Input
          label="Nombre"
          type="text"
          value={userData.nombre}
          onChange={(e) => handleInputChange(e, 'nombre')}
          required
        />

        <Input
          label="Apellidos"
          type="text"
          value={userData.apellidos}
          onChange={(e) => handleInputChange(e, 'apellidos')}
        />

        <Input
          label="Fecha de Nacimiento"
          type="date"
          value={userData.fechaNacimiento}
          onChange={(e) => handleInputChange(e, 'fechaNacimiento')}
        />

        <Input
          label="Teléfono"
          type="tel"
          value={userData.telefono}
          onChange={(e) => handleInputChange(e, 'telefono')}
        />

        <Input
          label="Correo Electrónico"
          type="email"
          value={userData.correoElectronico}
          onChange={(e) => handleInputChange(e, 'correoElectronico')}
          required
        />

        <Input
          label="Contraseña"
          type="password"
          value={userData.password}
          onChange={(e) => handleInputChange(e, 'password')}
          required
        />

        <div className="flex items-center mt-2">
          <Checkbox
            isSelected={userData.admin}
            onValueChange={handleAdminChange}
          >
            ¿Es administrador?
          </Checkbox>
        </div>
      </div>
    </ModalComponent>
  );
};