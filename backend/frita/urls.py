from frita.views import views
from django.urls import path

urlpatterns = [
    path('', views.exemplo_view, name='exemplo'),
]
