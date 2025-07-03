import { VentaCosecha } from "../../types";

interface ResumenPagoProps {
  ventaCosechas: VentaCosecha[];
  totalVenta: string;
}

export const ResumenPago = ({ ventaCosechas, totalVenta }: ResumenPagoProps) => {
  const totalDescuentos = ventaCosechas
    .reduce((sum, vc) => {
      const precioUnitario = Number(vc.precio_unitario);
      const cantidad = vc.cantidad;
      const descuento = Number(vc.descuento) / 100;
      return sum + precioUnitario * cantidad * descuento;
    }, 0)
    .toFixed(2);

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="font-semibold text-lg mb-2">Resumen de Pago</h3>
      <div className="space-y-2">
        <p>
          <strong>Subtotal:</strong>{" "}
          {(
            Number(totalVenta) + Number(totalDescuentos)
          ).toFixed(2)} COP
        </p>
        <p>
          <strong>Descuentos:</strong> -{totalDescuentos} COP
        </p>
        <p className="text-lg font-bold">
          <strong>Total:</strong> {totalVenta} COP
        </p>
      </div>
    </div>
  );
};