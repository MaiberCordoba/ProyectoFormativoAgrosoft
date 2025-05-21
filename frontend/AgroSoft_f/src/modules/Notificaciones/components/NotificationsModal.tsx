// components/NotificationsModal.tsx
import { Bell, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotificaciones } from "../hooks/useNotification";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { notificaciones, marcarLeida, marcarTodasLeidas } = useNotificaciones();

  if (!isOpen) return null;

  const unreadCount = notificaciones.filter((n) => !n.is_read).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end pt-16">
      <div
        className="fixed inset-0 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-50 w-full max-w-sm bg-white rounded-l-lg shadow-xl h-[calc(100vh-4rem)] flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-sena-green text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell size={20} />
            <h3 className="font-semibold">Notificaciones</h3>
            {unreadCount > 0 && (
              <span className="ml-2 bg-white text-sena-green text-xs font-bold rounded-full px-2 py-0.5">
                {unreadCount} nuevas
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                marcarTodasLeidas();
              }}
              className="text-xs hover:underline"
            >
              Marcar todas
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[#25a902]"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {notificaciones.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No hay notificaciones
            </div>
          ) : (
            notificaciones.map((notification) => (
              <div
                key={notification.id}
                onClick={() => marcarLeida(notification.id)}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.is_read ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <h4
                    className={`font-medium ${
                      !notification.is_read ? "text-sena-green" : "text-gray-700"
                    }`}
                  >
                    {notification.title}
                  </h4>
                  {!notification.is_read && (
                    <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mt-1.5"></span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-2">{notification.created_at}</p>
              </div>
            ))
          )}
        </div>
        <div className="p-3 border-t border-gray-200 text-center bg-gray-50">
          <Link
            to="/notificaciones"
            className="text-sm text-sena-green hover:underline font-medium"
            onClick={onClose}
          >
            Ver todas las notificaciones
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;