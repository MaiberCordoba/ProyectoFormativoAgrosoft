import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { es } from "date-fns/locale";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { Actividades } from "@/modules/Finanzas/types";
import { Controles } from "@/modules/Sanidad/types";

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

  useEffect(() => {
    const fetchActividades = fetch("http://127.0.0.1:8000/api/actividades/")
      .then((res) => res.json())
      .then((data: Actividades[]) =>
        data.map((actividad) => ({
          title: `Actividad: ${actividad.titulo} ${actividad.usuario ? "- " + actividad.usuario.nombre : ""}`,
          start: new Date(actividad.fecha + "T12:00:00"),
          end: new Date(actividad.fecha + "T12:00:00"),
          tipo: "actividad" as const,
        }))
      );

    const fetchControles = fetch("http://127.0.0.1:8000/api/controles/")
      .then((res) => res.json())
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
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  return (
    <Calendar
      localizer={localizer}
      events={eventos}
      startAccessor="start"
      endAccessor="end"
      messages={messages}
      culture="es"
      style={{ height: 600 }}
      views={["month", "agenda"]}
      components={{
        agenda: {
          time: () => null,
        },
      }}
      eventPropGetter={(event) => {
        const backgroundColor = event.tipo === "actividad" ? "#12A34A" : "#06202B";
        return {
          style: {
            backgroundColor,
            color: "white",
            borderRadius: "5px",
            padding: "2px 5px",
          },
        };
      }}
      dayPropGetter={(date) => {
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        return {
          style: {
            backgroundColor: isWeekend ? "#f9fcff" : "#f9fcff",
            border: "1px solid #e0e0e0",
          },
        };
      }}
    />
  );
}
