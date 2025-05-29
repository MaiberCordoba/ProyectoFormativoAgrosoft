import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { es } from "date-fns/locale";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { Actividades } from "@/modules/Finanzas/types";
import { Controles } from "@/modules/Sanidad/types";

import "@/modules/Trazabilidad/components/calendario/calendario.css";

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
  locale: es,
});

const messages = {
  allDay: "Todo el día",
  previous: "Atrás",
  next: "Siguiente",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "",
  event: "Actividad",
  noEventsInRange: "No hay actividades en este rango",
  showMore: (total: number) => `+ Ver más (${total})`,
};

interface EventoCalendario {
  title: string;
  start: Date;
  end: Date;
  tipo: "actividad" | "control";
}

export default function CalendarioActividades() {
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [vistaActual, setVistaActual] = useState<View>("month");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No hay token disponible. Inicia sesión.");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const fetchActividades = fetch("http://127.0.0.1:8000/api/actividades/", { headers })
      .then((res) => {
        if (res.status === 401) throw new Error("No autorizado");
        return res.json();
      })
      .then((data: Actividades[]) =>
        data.map((actividad) => ({
          title: `Actividad: ${actividad.titulo} ${actividad.usuario ? "- " + actividad.usuario.nombre : ""}`,
          start: new Date(actividad.fecha + "T12:00:00"),
          end: new Date(actividad.fecha + "T12:00:00"),
          tipo: "actividad" as const,
        }))
      );

    const fetchControles = fetch("http://127.0.0.1:8000/api/controles/", { headers })
      .then((res) => {
        if (res.status === 401) throw new Error("No autorizado");
        return res.json();
      })
      .then((data: Controles[]) =>
        data.map((control) => ({
          title: `Control: ${control.descripcion} ${control.usuario ? "- " + control.usuario.nombre : ""}`,
          start: new Date(control.fechaControl + "T12:00:00"),
          end: new Date(control.fechaControl + "T12:00:00"),
          tipo: "control" as const,
        }))
      );

    Promise.all([fetchActividades, fetchControles])
      .then(([eventosActividades, eventosControles]) => {
        setEventos([...eventosActividades, ...eventosControles]);
      })
      .catch((err) => {
        console.error("Error cargando datos:", err);
        if (err.message === "No autorizado") {
          alert("Sesión expirada. Por favor inicia sesión nuevamente.");
        }
      });
  }, []);

  const handleSelectSlot = (slotInfo: { start: Date }) => {
    setFechaSeleccionada(slotInfo.start);
    setVistaActual("agenda");
  };

  const handleSelectEvent = (event: EventoCalendario) => {
    setFechaSeleccionada(event.start);
    setVistaActual("agenda");
  };

  const eventosFiltrados = fechaSeleccionada
    ? eventos.filter(
        (e) =>
          e.start.toDateString() === fechaSeleccionada.toDateString()
      )
    : eventos;

  const containerStyle: React.CSSProperties = {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    maxWidth: "1000px",
    margin: "0 auto",
    marginBottom: "25px",
  };

  const titleStyle: React.CSSProperties = {
    backgroundColor: "#327D45",
    color: "white",
    padding: "12px 20px",
    borderRadius: "8px",
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "22px",
    fontWeight: "bold",
  };

  const CustomEvent = ({ event }: { event: EventoCalendario }) => {
    const baseStyle: React.CSSProperties = {
      color: "white",
      borderRadius: "10px",
      padding: "4px 8px",
      fontSize: "0.8rem",
      fontWeight: 500,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      backgroundColor: event.tipo === "actividad" ? "#327D45" : "#325D7D",
    };

    return <div style={baseStyle}>{event.title}</div>;
  };

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>Calendario de Actividades y Controles</div>
      <Calendar
        localizer={localizer}
        events={eventosFiltrados}
        startAccessor="start"
        endAccessor="end"
        messages={messages}
        culture="es"
        style={{ height: 700 }}
        views={["month", "agenda"]}
        view={vistaActual}
        onView={(view) => setVistaActual(view)}
        date={fechaSeleccionada ?? new Date()}
        onNavigate={(date) => setFechaSeleccionada(date)}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        components={{
          event: CustomEvent,
          agenda: {
            event: CustomEvent,
            time: () => null,
          },
        }}
        dayPropGetter={() => ({
          style: {
            backgroundColor: "#f8fbff",
            border: "1px solid #e6e6e6",
          },
        })}
      />
    </div>
  );
}
