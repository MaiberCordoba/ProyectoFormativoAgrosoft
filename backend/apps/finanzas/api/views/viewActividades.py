from rest_framework.viewsets import ModelViewSet
from apps.finanzas.api.serializers.serializerActividades import SerializerActividades
from apps.finanzas.api.models.actividades import Actividades
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.mail import send_mail
from django.conf import settings

class ViewActividades(ModelViewSet):
    queryset = Actividades.objects.all()
    serializer_class = SerializerActividades

    def perform_create(self, serializer):
        """Sobrescribimos la creación para enviar notificaciones."""
        actividad = serializer.save()
        
        if actividad.fk_Usuario is not None:
            try:
                # Obtener información de ubicación (cultivo o plantación)
                ubicacion_info = ""
                if actividad.fk_Plantacion:
                    # Caso con plantación
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
                    # Caso solo con cultivo
                    ubicacion_info = f"\nCultivo: {str(actividad.fk_Cultivo)}"

                # Construir mensaje detallado
                mensaje = (
                    f"Tienes una nueva actividad asignada:\n\n"
                    f"Título: {actividad.titulo}\n"
                    f"Descripción: {actividad.descripcion}\n"
                    f"Fecha: {actividad.fecha.strftime('%d/%m/%Y') if actividad.fecha else 'No especificada'}\n"
                    f"Tipo: {actividad.fk_TipoActividad.nombre if actividad.fk_TipoActividad else 'No especificado'}\n"
                    f"Estado: {actividad.get_estado_display()}"
                    f"{ubicacion_info}"
                )

                # Enviar notificación por correo
                email = actividad.fk_Usuario.correoElectronico
                try:
                    send_mail(
                        subject=f"Nueva actividad: {actividad.titulo}",
                        message=mensaje,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[email],
                        fail_silently=False,
                    )
                except Exception as e:
                    print(f"Error enviando email: {e}")

                # Enviar por WebSocket
                try:
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
                    print(f"Error enviando notificación WebSocket: {e}")

            except Exception as e:
                print(f"Error general en el envío de notificación: {e}")