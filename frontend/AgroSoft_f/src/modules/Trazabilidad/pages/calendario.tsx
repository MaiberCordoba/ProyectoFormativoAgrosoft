import CalendarioActividades from "../../Trazabilidad/components/calendario/calendario";

export default function CalendarioPage() {
  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          backgroundColor: "#12A34A", // Color de fondo verde
          padding: "12px 24px",
          borderRadius: "8px",
          margin: "0 auto 20px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#FFFFFF", margin: 0 }}>
          Calendario de Actividades
        </h1>
      </div>
      <CalendarioActividades />
    </div>
  );
}
