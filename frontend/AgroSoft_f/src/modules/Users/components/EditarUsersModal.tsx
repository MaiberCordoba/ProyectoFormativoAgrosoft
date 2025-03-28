import React, { useState } from 'react';
import ModalComponent from '@/components/Modal';

import { Input, Checkbox } from '@heroui/react';
import { User } from '../types';
import { usePatchUsers } from '../hooks/usePatchUsers';

interface EditarUserModalProps {
  user: User; // El usuario que se está editando
  onClose: () => void; // Función para cerrar el modal
}

const EditarUserModal: React.FC<EditarUserModalProps> = ({ user, onClose }) => {
  const [userData, setUserData] = useState({
    identificacion: user.identificacion.toString(),
    nombre: user.nombre,
    apellidos: user.apellidos,
    fechaNacimiento: user.fechaNacimiento,
    telefono: user.telefono,
    correoElectronico: user.correoElectronico,
    admin: user.admin
  });

  const { mutate, isPending } = usePatchUsers();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof userData) => {
    setUserData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleAdminChange = (isChecked: boolean) => {
    setUserData(prev => ({
      ...prev,
      admin: isChecked
    }));
  };

  const handleSubmit = () => {
    mutate(
      {
        id: user.id,
        data: {
          ...userData,
          identificacion: Number(userData.identificacion)
        }
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Usuario"
      footerButtons={[
        {
          label: isPending ? 'Guardando...' : 'Guardar',
          color: 'success',
          variant: 'light',
          onClick: handleSubmit,
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

export default EditarUserModal;