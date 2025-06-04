import React, { useState } from "react";
import ModalComponent from "@/components/Modal";

import { Input, Select, SelectItem, Switch } from "@heroui/react";
import { User } from "../types";
import { usePatchUsers } from "../hooks/usePatchUsers";

interface EditarUserModalProps {
  user: User; // El usuario que se está editando
  onClose: () => void; // Función para cerrar el modal
}

const EditarUserModal: React.FC<EditarUserModalProps> = ({ user, onClose }) => {
  const [userData, setUserData] = useState({
    identificacion: user.identificacion.toString(),
    nombre: user.nombre,
    apellidos: user.apellidos,
    telefono: user.telefono,
    correoElectronico: user.correoElectronico,
    estado: user.estado,
    admin: user.admin,
    rol: user.rol,
  });

  const { mutate, isPending } = usePatchUsers();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof userData
  ) => {
    setUserData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    mutate(
      {
        id: user.id,
        data: {
          ...userData,
          identificacion: Number(userData.identificacion),
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleRoleChange = (selectedKey: string) => {
    setUserData((prev) => ({
      ...prev,
      rol: selectedKey,
    }));
  };

  const handleEstadoSwitchChange = (isSelected: boolean) => {
    setUserData((prev) => ({
      ...prev,
      estado: isSelected ? "activo" : "inactivo",
    }));
  };

  const roles = [
    { key: "admin", label: "admin" },
    { key: "instructor", label: "instructor" },
    { key: "pasante", label: "pasante" },
    { key: "aprendiz", label: "aprendiz" },
    { key: "visitante", label: "visitante" },
  ];

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Usuario"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "solid",
          onClick: handleSubmit,
        },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          size="sm"
          label="Identificación"
          type="number"
          value={userData.identificacion}
          onChange={(e) => handleInputChange(e, "identificacion")}
          required
        />

        <Input
          label="Nombre"
          type="text"
          size="sm"
          value={userData.nombre}
          onChange={(e) => handleInputChange(e, "nombre")}
          required
        />

        <Input
          label="Apellidos"
          type="text"
          size="sm"
          value={userData.apellidos}
          onChange={(e) => handleInputChange(e, "apellidos")}
        />

        <Input
          label="Teléfono"
          type="tel"
          size="sm"
          value={userData.telefono}
          onChange={(e) => handleInputChange(e, "telefono")}
        />

        <Input
          label="Correo Electrónico"
          type="email"
          size="sm"
          value={userData.correoElectronico}
          onChange={(e) => handleInputChange(e, "correoElectronico")}
          required
        />

        <Select
          label="rol"
          size="sm"
          selectedKeys={userData.rol ? [userData.rol] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0] as string;
            handleRoleChange(selectedKey);
          }}
        >
          {roles.map((rol) => (
            <SelectItem key={rol.key}>{rol.label}</SelectItem>
          ))}
        </Select>

        <Switch
          size="sm"
          isSelected={userData.estado === "activo"}
          onValueChange={handleEstadoSwitchChange}
        >
          Usuario Activo
        </Switch>
      </div>
    </ModalComponent>
  );
};

export default EditarUserModal;
