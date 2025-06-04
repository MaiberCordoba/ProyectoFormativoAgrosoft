import { useState, ChangeEvent } from "react";
import ModalComponent from "@/components/Modal";
import { Input, Checkbox, Select, SelectItem } from "@heroui/react";
import { usePostUsers } from "../hooks/usePostUsers";

interface CrearUsersModalProps {
  onClose: () => void;
}

interface UserFormState {
  id: number;
  identificacion: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  correoElectronico: string;
  password: string;
  rol: string;
  admin: boolean;
  estado: string;
}

const ROLES = [
  { value: "admin", label: "Administrador" },
  { value: "instructor", label: "Instructor" },
  { value: "pasante", label: "Pasante" },
  { value: "visitante", label: "visitante" },
];

export const CrearUsersModal = ({ onClose }: CrearUsersModalProps) => {
  const [userData, setUserData] = useState<UserFormState>({
    id: 0,
    identificacion: "",
    nombre: "",
    apellidos: "",
    telefono: "",
    correoElectronico: "",
    password: "",
    estado: "",
    rol:"",
    admin: false,
  });

  const { mutate, isPending } = usePostUsers();

  // Maneja cambios en inputs normales
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof Omit<UserFormState, "admin">
  ) => {
    setUserData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // Maneja cambio específico del checkbox
  const handleAdminChange = (isChecked: boolean) => {
    setUserData((prev) => ({
      ...prev,
      admin: isChecked,
    }));
  };

  const handleSubmit = () => {
    if (
      !userData.identificacion ||
      !userData.nombre ||
      !userData.correoElectronico ||
      !userData.password
    ) {
      console.log("Por favor, completa los campos requeridos.");
      return;
    }

    mutate(userData, {
      onSuccess: (data) => {
        onClose();
        setUserData({
          id: 0,
          identificacion: "",
          nombre: "",
          apellidos: "",
          telefono: "",
          correoElectronico: "",
          password: "",
          rol: "",
          estado: "",
          admin: false,
        });
      },
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
          variant: "solid",
          onClick: handleSubmit,
        },
      ]}
    >
      <Input
        label="Identificación"
        type="number"
        value={userData.identificacion}
        onChange={(e) => handleInputChange(e, "identificacion")}
        required
      />

      <Input
        label="Nombre"
        type="text"
        value={userData.nombre}
        onChange={(e) => handleInputChange(e, "nombre")}
        required
      />

      <Input
        label="Apellidos"
        type="text"
        value={userData.apellidos}
        onChange={(e) => handleInputChange(e, "apellidos")}
      />

      <Input
        label="Teléfono"
        type="tel"
        value={userData.telefono}
        onChange={(e) => handleInputChange(e, "telefono")}
      />

      <Input
        label="Correo Electrónico"
        type="email"
        value={userData.correoElectronico}
        onChange={(e) => handleInputChange(e, "correoElectronico")}
        required
      />

      <Input
        label="Contraseña"
        type="password"
        value={userData.password}
        onChange={(e) => handleInputChange(e, "password")}
        required
      />

      <Select
        isRequired
        label="Estado"
        selectedKeys={new Set([userData.estado])} // Muestra el valor actual
        onSelectionChange={(keys) => {
          const selectedValue = Array.from(keys)[0] as string;
          setUserData((prev) => ({
            ...prev,
            estado: selectedValue,
          }));
        }}
      >
        <SelectItem key="activo">Activo</SelectItem>
        <SelectItem key="inactivo">Inactivo</SelectItem>
      </Select>

       <Select
        isRequired
        label="Rol"
        selectedKeys={userData.rol ? new Set([userData.rol]) : new Set()}
        onSelectionChange={(keys) => {
          const selectedValue = Array.from(keys)[0] as string;
          setUserData((prev) => ({
            ...prev,
            rol: selectedValue,
          }));
        }}
      >
        {ROLES.map((role) => (
          <SelectItem key={role.value}>
            {role.label}
          </SelectItem>
        ))}
      </Select>
    </ModalComponent>
  );
};
