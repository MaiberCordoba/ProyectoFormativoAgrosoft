from django.urls import re_path
from .usersConsumer import UserConsumer

websocket_urlpatterns = [
    re_path(r"ws/user/(?P<user_id>\d+)/$", UserConsumer.as_asgi()),
]