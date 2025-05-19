from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from apps.finanzas.api.serializers.serializerActividades import SerializerActividades
from apps.finanzas.api.models.actividades import Actividades
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.mail import send_mail
from django.conf import settings

class ViewActividades(ModelViewSet):
    serializer_class = SerializerActividades
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Si el usuario es admin o staff, devuelve todas las actividades
        if user.is_superuser or user.is_staff:
            return Actividades.objects.all()

        # Si no, devuelve solo sus actividades
        return Actividades.objects.filter(fk_Usuario=user)

    def perform_create(self, serializer):
        actividad = serializer.save()

        if actividad.fk_Usuario is not None:
            try:
                ubicacion_info = ""
                if actividad.fk_Plantacion:
                    plantacion = actividad.fk_Plantacion
                    era_info = ""
                    if plantacion.fk_Era:
                        era_info = (
                            f"\nEra: {plantacion.fk_Era.tipo}"
                            f"\nLote: {plantacion.fk_Era.fk_lote.nombre if plantacion.fk_Era.fk_lote else 'No especificado'}"
                        )
                    ubicacion_info = (
                        f"\nCultivo: {str(plantacion.fk_Cultivo) if plantacion.fk_Cultivo else 'No especificado'}"
                        f"{era_info}"
                    )
                elif actividad.fk_Cultivo:
                    ubicacion_info = f"\nCultivo: {str(actividad.fk_Cultivo)}"

                mensaje = (
                    f"Tienes una nueva actividad asignada:\n\n"
                    f"Título: {actividad.titulo}\n"
                    f"Descripción: {actividad.descripcion}\n"
                    f"Fecha: {actividad.fecha.strftime('%d/%m/%Y') if actividad.fecha else 'No especificada'}\n"
                    f"Tipo: {actividad.fk_TipoActividad.nombre if actividad.fk_TipoActividad else 'No especificado'}\n"
                    f"Estado: {actividad.get_estado_display()}"
                    f"{ubicacion_info}"
                )

                # Enviar correo
                email = actividad.fk_Usuario.correoElectronico
                send_mail(
                    subject=f"Nueva actividad: {actividad.titulo}",
                    message=mensaje,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=False,
                )

                # Notificación WebSocket
                channel_layer = get_channel_layer()
                if channel_layer is not None:
                    user_group = f"notificaciones_{actividad.fk_Usuario.id}"
                    async_to_sync(channel_layer.group_send)(
                        user_group,
                        {
                            "type": "send_notification",
                            "message": mensaje,
                            "email": email
                        }
                    )

            except Exception as e:
                print(f"Error general en el envío de notificación: {e}")
