import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import apiClient from "@/api/apiClient";
import { TiempoActividadControl } from "../../types";
import { useGetUsers } from "@/modules/Users/hooks/useGetUsers";
import { addToast } from "@heroui/toast";
import ModalComponent from "@/components/Modal"; // Tu Modal global
import { useDisclosure as useHistorialDisclosure } from "@heroui/react";
import HistorialPagosModal from "./HistorialPagosModal";
import { TriangleAlert, TriangleAlertIcon } from "lucide-react";

interface TablaPagosProps {
  onUsuarioChange?: (usuarioId: string) => void;
}

const TablaPagos: React.FC<TablaPagosProps> = ({ onUsuarioChange }) => {
  const [registros, setRegistros] = useState<TiempoActividadControl[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [usuarioId, setUsuarioId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [pendingRequests, setPendingRequests] = useState<Set<number>>(
    new Set()
  );

  // Modal para confirmar cambio de estado de pago individual
  const {
    isOpen: isConfirmModalOpen,
    onOpen: onConfirmModalOpen,
    onClose: onConfirmModalClose,
  } = useDisclosure();
  const [selectedPayment, setSelectedPayment] = useState<{
    id: number;
    nuevoEstado: "PENDIENTE" | "PAGADO";
  } | null>(null);

  // Modal para confirmar pago masivo "Pagar Todo Pendiente"
  const {
    isOpen: isConfirmPagarTodoModalOpen,
    onOpen: onConfirmPagarTodoModalOpen,
    onClose: onConfirmPagarTodoModalClose,
  } = useDisclosure();

  // Modal para Historial de Pagos
  const {
    isOpen: isHistorialModalOpen,
    onOpen: onHistorialModalOpen,
    onClose: onHistorialModalClose,
  } = useHistorialDisclosure();

  const {
    data: usuarios = [],
    isLoading: loadingUsuarios,
    error: errorUsuarios,
  } = useGetUsers();

  useEffect(() => {
    const url = usuarioId
      ? `/tiempoActividadesControles/?usuario_id=${usuarioId}`
      : "/tiempoActividadesControles/";
    setLoading(true);
    apiClient
      .get<TiempoActividadControl[]>(url)
      .then((response) => {
        setRegistros(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar registros:", err);
        setError("No se pudieron cargar los registros");
        setLoading(false);
      });
  }, [usuarioId]);

  const handleMarcarPagoConfirm = useCallback(
    (id: number, nuevoEstado: "PENDIENTE" | "PAGADO") => {
      if (
        nuevoEstado === "PENDIENTE" &&
        registros.find((reg) => reg.id === id)?.estado_pago === "PAGADO"
      ) {
        addToast({
          title: "Acción Restringida",
          description:
            "No se puede cambiar el estado de un pago a 'Pendiente' una vez que está 'Pagado'.",
          color: "danger",
        });
        return;
      }
      setSelectedPayment({ id, nuevoEstado });
      onConfirmModalOpen();
    },
    [onConfirmModalOpen, registros]
  );

  const confirmChangePaymentStatus = useCallback(async () => {
    if (!selectedPayment) return;

    const { id, nuevoEstado } = selectedPayment;
    onConfirmModalClose();

    if (pendingRequests.has(id)) return;

    setPendingRequests((prev) => new Set(prev).add(id));

    setRegistros((prevRegistros) =>
      prevRegistros.map((reg) =>
        reg.id === id ? { ...reg, estado_pago: nuevoEstado } : reg
      )
    );

    try {
      const response = await apiClient.patch<TiempoActividadControl>(
        `/tiempoActividadesControles/${id}/marcar-pago/`,
        { estado_pago: nuevoEstado }
      );
      setRegistros((prevRegistros) =>
        prevRegistros.map((reg) => (reg.id === id ? response.data : reg))
      );
      addToast({
        title: "Éxito",
        description: "Estado de pago actualizado correctamente",
        color: "success",
      });
    } catch (error) {
      console.error("Error al marcar pago:", error);
      setRegistros((prevRegistros) =>
        prevRegistros.map((reg) =>
          reg.id === id
            ? {
                ...reg,
                estado_pago: nuevoEstado === "PAGADO" ? "PENDIENTE" : "PAGADO",
              }
            : reg
        )
      );
      addToast({
        title: "Error",
        description: "Error al actualizar el estado del pago",
        color: "danger",
      });
    } finally {
      setPendingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      setSelectedPayment(null);
    }
  }, [pendingRequests, selectedPayment, onConfirmModalClose]);

  // Nueva función para iniciar el flujo de confirmación de "Pagar Todo"
  const handlePagarTodoConfirm = () => {
    if (!usuarioId) {
      addToast({
        title: "Denegado",
        description: "Por favor selecciona un usuario para pagar.",
        color: "warning",
      });
      return;
    }
    // Abrir el modal de confirmación para "Pagar Todo"
    onConfirmPagarTodoModalOpen();
  };

  // Función que se ejecuta si se confirma el "Pagar Todo"
  const confirmPagarTodo = async () => {
    onConfirmPagarTodoModalClose(); // Cerrar el modal de confirmación

    try {
      const response = await apiClient.post<{
        message: string;
        total_pagado: number;
      }>("/pagar-todo-pendiente/", { usuario_id: usuarioId });
      addToast({
        title: "Éxito",
        description: response.data.message,
        color: "success",
      });
      // Recargar registros después del pago masivo
      const url = `/tiempoActividadesControles/?usuario_id=${usuarioId}`;
      const newData = await apiClient.get<TiempoActividadControl[]>(url);
      setRegistros(newData.data);
    } catch (error) {
      console.error("Error al pagar todo:", error);
      addToast({
        title: "Error",
        description: "Error al realizar el pago masivo",
        color: "danger",
      });
    }
  };

  const renderCell = (
    item: TiempoActividadControl,
    columnKey: keyof TiempoActividadControl | "tipo" | "acciones"
  ) => {
    switch (columnKey) {
      case "usuario":
        return (
          <span>
            {item.actividad?.usuario?.nombre}{" "}
            {item.actividad?.usuario?.apellidos}
            {item.control?.usuario?.nombre} {item.control?.usuario?.apellidos}
          </span>
        );
      case "fecha":
        return new Date(item.fecha).toLocaleDateString();
      case "valorTotal":
        return `$${item.valorTotal}`;
      case "tipo":
        return item.fk_actividad ? "Actividad" : "Control";
      case "estado_pago":
        return (
          <Chip
            color={item.estado_pago === "PAGADO" ? "success" : "warning"}
            size="sm"
          >
            {item.estado_pago}
          </Chip>
        );
      case "acciones":
        const isPaid = item.estado_pago === "PAGADO";
        return (
          <Button
            size="sm"
            color={isPaid ? "warning" : "success"}
            onPress={() =>
              handleMarcarPagoConfirm(item.id, isPaid ? "PENDIENTE" : "PAGADO")
            }
            className="h-9"
            isDisabled={pendingRequests.has(item.id) || isPaid}
          >
            {isPaid ? "Ya Pagado" : "Marcar Pagado"}
          </Button>
        );
      default:
        return String(item[columnKey as keyof TiempoActividadControl]);
    }
  };

  const columns = [
    { uid: "usuario", name: "Usuario", sortable: true },
    { uid: "fecha", name: "Fecha", sortable: true },
    { uid: "valorTotal", name: "Valor Total", sortable: true },
    { uid: "tipo", name: "Tipo" },
    { uid: "estado_pago", name: "Estado", sortable: true },
    { uid: "acciones", name: "Acciones" },
  ];

  return (
    <div className="w-full max-w-[1075px] flex flex-col gap-3 mx-auto p-4 bg-white rounded-lg shadow mt-6">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {errorUsuarios && (
        <div className="text-red-500 mb-4">Error al cargar usuarios</div>
      )}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <div className="w-full sm:w-[200px]">
          <Select
            label="Filtrar por usuario"
            placeholder={
              loadingUsuarios ? "Cargando usuarios..." : "Selecciona un usuario"
            }
            selectedKeys={usuarioId ? [usuarioId] : []}
            onSelectionChange={(keys) => {
              const newUsuarioId = Array.from(keys)[0]?.toString() ?? "";
              setUsuarioId(newUsuarioId);
              onUsuarioChange?.(newUsuarioId);
            }}
            size="sm"
            className="h-9"
            isDisabled={loadingUsuarios}
          >
            {usuarios.map((user) => (
              <SelectItem key={user.id}>
                {`${user.nombre} ${user.apellidos}`}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="w-full sm:w-auto flex gap-3">
          {/* Botón para Pagar Todo Pendiente - Ahora abre el modal de confirmación */}
          <Button
            size="sm"
            color="success"
            onPress={handlePagarTodoConfirm}
            className="text-white h-9"
            isDisabled={!usuarioId}
          >
            Pagar Todo Pendiente
          </Button>

          {/* Botón para Historial de Pagos */}
          <Button
            size="sm"
            color="success"
            onPress={onHistorialModalOpen}
            className="text-white h-9"
          >
            Ver Historial de Pagos
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table aria-label="Tabla de Pagos" className="min-w-[600px]">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "acciones" ? "center" : "start"}
                allowsSorting={column.sortable}
                className="bg-[#e6f1ed]"
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={registros}
            emptyContent={loading ? "Cargando..." : "No hay registros"}
          >
            {(item) => (
              <TableRow
                key={item.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {(columnKey) => (
                  <TableCell className="py-3 px-4 border-b text-gray-700">
                    {renderCell(
                      item,
                      columnKey as
                        | keyof TiempoActividadControl
                        | "tipo"
                        | "acciones"
                    )}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Confirmación para cambio de estado individual */}
      <ModalComponent
        isOpen={isConfirmModalOpen}
        onClose={onConfirmModalClose}
        title="Confirmar Cambio de Estado"
        footerButtons={[
          {
            label: "Confirmar",
            color:
              selectedPayment?.nuevoEstado === "PAGADO" ? "success" : "danger",
            onClick: confirmChangePaymentStatus,
          },
        ]}
      >
        <div className="flex flex-col items-center justify-center p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded-lg text-center">
          {/* Icono de advertencia importado y centrado */}
          <TriangleAlertIcon className=" mb-4" color="orange" size={80} />{" "}
          {/* Tamaño más grande y margen inferior */}
          <p className="text-sm font-medium">
            ¡Atención! Estás a punto de marcar el pago pendiente para este
            usuario como PAGADO. Esta acción es irreversible. ¿Estás
            completamente seguro de proceder?
          </p>
        </div>
      </ModalComponent>

      {/* Nuevo Modal de Confirmación para "Pagar Todo Pendiente" */}
      <ModalComponent
        isOpen={isConfirmPagarTodoModalOpen}
        onClose={onConfirmPagarTodoModalClose}
        title="Confirmar Pago Masivo"
        footerButtons={[
          {
            label: "Sí, Pagar Todo",
            color: "success",
            onClick: confirmPagarTodo,
          },
        ]}
      >
        <div className="flex flex-col items-center justify-center p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded-lg text-center">
          {/* Icono de advertencia importado y centrado */}
          <TriangleAlertIcon className=" mb-4" color="orange" size={80} />{" "}
          {/* Tamaño más grande y margen inferior */}
          <p className="text-sm font-medium">
            ¡Atención! Estás a punto de marcar TODOS los pagos pendientes para
            este usuario como PAGADOS. Esta acción es irreversible. ¿Estás
            completamente seguro de proceder?
          </p>
        </div>
      </ModalComponent>

      {/* Modal del Historial de Pagos */}
      <HistorialPagosModal
        isOpen={isHistorialModalOpen}
        onClose={onHistorialModalClose}
      />
    </div>
  );
};

export default TablaPagos;
