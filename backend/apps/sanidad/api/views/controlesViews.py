from rest_framework.viewsets import ModelViewSet
from apps.sanidad.api.serializers.controlesSerializer import ControlesModelSerializer
from apps.sanidad.api.models.controlesModel import Controles
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.mail import send_mail
from django.conf import settings

class ControleslModelViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = ControlesModelSerializer

    def get_queryset(self):
        user = self.request.user
        print(f"[DEBUG] Usuario autenticado: {user}")
        print(f"[DEBUG] is_staff: {user.is_staff}, is_superuser: {user.is_superuser}")

        if user.is_superuser or user.is_staff:
            qs = Controles.objects.all()
            print(f"[DEBUG] Admin o staff - controles totales: {qs.count()}")
            return qs

        qs = Controles.objects.filter(fk_Usuario=user)
        print(f"[DEBUG] Usuario normal - controles propios: {qs.count()}")
        return qs

    def perform_create(self, serializer):
        control = serializer.save()  # Guarda el control en la base de datos

        if control.fk_Usuario is not None:
            try:
                channel_layer = get_channel_layer()
                if channel_layer is None:
                    print("Error: No se pudo obtener el canal de WebSockets")
                    return

                user_group = f"controles_notificaciones_{control.fk_Usuario.id}"
                email = control.fk_Usuario.correoElectronico

                fecha_control = control.fechaControl.strftime("%d/%m/%Y")
                descripcion = control.descripcion

                afeccion_nombre = control.fk_Afeccion.fk_Plaga.nombre if control.fk_Afeccion and control.fk_Afeccion.fk_Plaga else "Sin especificar"

                tipo_afeccion = control.fk_Afeccion.fk_Plaga.fk_Tipo.nombre if (
                    control.fk_Afeccion and
                    control.fk_Afeccion.fk_Plaga and
                    control.fk_Afeccion.fk_Plaga.fk_Tipo
                ) else "Sin especificar"

                cultivo_nombre = ""
                if control.fk_Afeccion and control.fk_Afeccion.fk_Plantacion:
                    if control.fk_Afeccion.fk_Plantacion.fk_Cultivo:
                        especie = control.fk_Afeccion.fk_Plantacion.fk_Cultivo.fk_Especie.nombre if control.fk_Afeccion.fk_Plantacion.fk_Cultivo.fk_Especie else ""
                        variedad = control.fk_Afeccion.fk_Plantacion.fk_Cultivo.nombre
                        cultivo_nombre = f"{especie} {variedad}".strip()

                tipo_control = control.fk_TipoControl.nombre if control.fk_TipoControl else "Sin especificar"

                mensaje = (
                    f"Fecha de control: {fecha_control}\n\n"
                    f"Descripción: {descripcion}\n\n"
                    f"Afección: {afeccion_nombre}\n\n"
                    f"Tipo de afección: {tipo_afeccion}\n\n"
                    f"Cultivo: {cultivo_nombre if cultivo_nombre else 'Sin especificar'}\n\n"
                    f"Tipo de control: {tipo_control}"
                )

                notification_data = {
                    "message": mensaje,
                    "email": email
                }

                async_to_sync(channel_layer.group_send)(
                    user_group,
                    {
                        "type": "send_notification",
                        "message": notification_data["message"],
                        "email": email
                    }
                )

                try:
                    send_mail(
                        subject=f"Nuevo control asignado - {fecha_control}",
                        message=notification_data["message"],
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[email],
                        fail_silently=False,
                    )
                except Exception as e:
                    print(f"Error enviando email desde la vista: {e}")

            except Exception as e:
                print(f"Error enviando la notificación: {e}")
