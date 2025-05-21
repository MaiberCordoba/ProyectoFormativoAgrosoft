// pages/NotificationsPage.tsx
import { Bell, ChevronLeft, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/UseAuth";
import { useNotificaciones } from "../hooks/useNotification";

const NotificationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notificaciones, marcarLeida, marcarTodasLeidas } = useNotificaciones();

  // Redirigir al login si no hay usuario autenticado
  if (!user) {
    navigate("/login");
    return null;
  }

  const unreadCount = notificaciones.filter((n) => !n.is_read).length;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="flex items-center text-sena-green hover:text-green-700">
          <ChevronLeft size={20} />
          <span className="ml-1">Volver</span>
        </Link>
        <h1 className="text-2xl font-bold flex items-center">
          <Bell className="mr-2" /> Notificaciones
        </h1>
        <div className="w-8"></div> {/* Espaciador para alinear */}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-medium">
              {unreadCount > 0
                ? `${unreadCount} notificaciones no leídas`
                : "Todas las notificaciones leídas"}
            </span>
          </div>
          <button
            onClick={marcarTodasLeidas}
            className="flex items-center text-sm text-sena-green hover:text-green-700 disabled:opacity-50"
            disabled={unreadCount === 0}
          >
            <CheckCircle2 size={16} className="mr-1" />
            Marcar todas como leídas
          </button>
        </div>

        <div className="divide-y divide-gray-200">
          {notificaciones.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No hay notificaciones
            </div>
          ) : (
            notificaciones.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.is_read ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex justify-between">
                  <div className="flex items-start">
                    <div
                      className={`mt-1 mr-3 h-2 w-2 rounded-full ${
                        notification.notification_type === "message"
                          ? "bg-blue-500"
                          : notification.notification_type === "activity"
                          ? "bg-green-500"
                          : notification.notification_type === "control"
                          ? "bg-orange-500"
                          : "bg-purple-500" // Para 'system'
                      }`}
                    ></div>
                    <div>
                      <h3
                        className={`font-medium ${
                          !notification.is_read ? "text-sena-green" : "text-gray-700"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!notification.is_read && (
                    <button
                      onClick={() => marcarLeida(notification.id)}
                      className="text-xs text-sena-green hover:text-green-700"
                    >
                      Marcar como leída
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Mostrando {notificaciones.length} notificaciones
        </div>
        {/* Aquí podrías añadir paginación */}
      </div>
    </div>
  );
};

export default NotificationsPage;