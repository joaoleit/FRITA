from frita.views import views, scrumaster_view
from django.urls import path

urlpatterns = [
    path('', views.exemplo_view, name='view'), # teste
    path('scrumasters/create/', scrumaster_view.create_scrumaster, name='create_scrumaster'),
    path('scrumasters/get/', scrumaster_view.get_scrumasters, name='get_scrumaster'),
    path('scrumasters/get/<int:id>', scrumaster_view.get_scrumaster_id, name='get_scrumaster'),
    path('scrumasters/update/<int:id>', scrumaster_view.update_scrumaster, name='update_scrumaster'),
    path('scrumasters/delete/<int:id>', scrumaster_view.delete_scrumaster, name='delete_scrumaster'),
]
