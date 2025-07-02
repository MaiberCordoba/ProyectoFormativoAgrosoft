from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from apps.finanzas.api.models.ventas import Ventas
from apps.finanzas.api.models.cosechaVenta import VentaCosecha
from apps.finanzas.api.models.cosechas import Cosechas
from apps.finanzas.api.models.unidadesMedida import UnidadesMedida
from apps.finanzas.api.serializers.serializerVentas import SerializerVentas
from decimal import Decimal
from django.utils import timezone

class ViewVentas(ModelViewSet):
    serializer_class = SerializerVentas
    permission_classes = [IsAuthenticated]
    queryset = Ventas.objects.all()

    def create(self, request, *args, **kwargs):
        print(f"Datos recibidos en POST: {request.data}")  # Depuración
        cosechas_data = request.data.get('cosechas', [])
        print(f"Tipo de datos de cosechas: {type(cosechas_data)}")  # Depuración
        for cosecha_data in cosechas_data:
            print(f"Tipo de cosecha: {type(cosecha_data.get('cosecha'))}, Valor: {cosecha_data.get('cosecha')}")
            print(f"Tipo de unidad_medida: {type(cosecha_data.get('unidad_medida'))}, Valor: {cosecha_data.get('unidad_medida')}")

        # Validar datos de cosechas
        if not cosechas_data:
            return Response({"error": "Debe incluir al menos una cosecha en la venta."}, status=status.HTTP_400_BAD_REQUEST)

        total = Decimal(0)
        venta = Ventas(
            numero_factura=self.generate_numero_factura(),
            usuario=request.user,
            fecha=timezone.now()
        )
        venta.save()
        print(f"Venta creada: {venta.id}")  # Depuración

        for cosecha_data in cosechas_data:
            try:
                cosecha = Cosechas.objects.get(id=cosecha_data['cosecha'])
                unidad_medida = UnidadesMedida.objects.get(id=cosecha_data['unidad_medida'])
                cantidad = cosecha_data['cantidad']
                descuento = Decimal(cosecha_data.get('descuento', 0))
                precio_unitario = Decimal(cosecha_data.get('precio_unitario', cosecha.precioUnidad))

                if cantidad <= 0:
                    raise ValueError("La cantidad debe ser mayor que cero.")
                if precio_unitario < 0:
                    raise ValueError("El precio unitario no puede ser negativo.")
                if descuento < 0 or descuento > 100:
                    raise ValueError("El descuento debe estar entre 0 y 100.")

                cantidad_en_base = cantidad * unidad_medida.equivalenciabase
                if cantidad_en_base > cosecha.cantidad_disponible:
                    raise ValueError(
                        f"La cantidad solicitada ({cantidad_en_base} g) excede la cantidad disponible ({cosecha.cantidad_disponible} g)."
                    )

                valor_total = Decimal(cantidad_en_base) * Decimal(precio_unitario) * (1 - Decimal(descuento) / 100)
                cosecha.cantidad_disponible -= cantidad_en_base
                cosecha.save()

                venta_cosecha = VentaCosecha(
                    venta=venta,
                    cosecha=cosecha,
                    cantidad=cantidad,
                    unidad_medida=unidad_medida,
                    precio_unitario=precio_unitario,
                    descuento=descuento,
                    valor_total=valor_total
                )
                venta_cosecha.save()
                total += valor_total
                print(f"VentaCosecha creada: {venta_cosecha.id}, valor_total: {valor_total}")  # Depuración

            except (Cosechas.DoesNotExist, UnidadesMedida.DoesNotExist, ValueError) as e:
                venta.delete()  # Revertir la creación de la venta si hay error
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        venta.valor_total = total
        venta.save()
        print(f"Venta actualizada con valor_total: {venta.valor_total}")  # Depuración

        serializer = self.get_serializer(venta)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def generate_numero_factura(self):
        today = timezone.now().date()
        prefix = f"V-{today.strftime('%Y%m%d')}-"
        last_venta = Ventas.objects.filter(numero_factura__startswith=prefix).order_by('-numero_factura').first()
        if last_venta:
            last_number = int(last_venta.numero_factura.split('-')[-1])
            new_number = last_number + 1
        else:
            new_number = 1
        return f"{prefix}{new_number:03d}"

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    def perform_update(self, serializer):
        serializer.save(usuario=self.request.user)