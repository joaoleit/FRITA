from frita.views import views, retrospective_view, scrumaster_view
from django.urls import path

urlpatterns = [
    path('', views.exemplo_view, name='view'), # teste
    path('scrumasters/create/', scrumaster_view.create_scrumaster, name='create_scrumaster'),
    path('scrumasters/get/', scrumaster_view.get_scrumasters, name='get_scrumaster'),
    path('scrumasters/get/<int:id>', scrumaster_view.get_scrumaster_id, name='get_scrumaster'),
    path('scrumasters/update/<int:id>', scrumaster_view.update_scrumaster, name='update_scrumaster'),
    path('scrumasters/delete/<int:id>', scrumaster_view.delete_scrumaster, name='delete_scrumaster'),
    path("retrospectives/create/", retrospective_view.create_retrospective, name="create_retrospective"),
    path("retrospectives/get/", retrospective_view.get_retrospectives, name="get_retrospectives"),
    path("retrospectives/get/<int:id>/", retrospective_view.get_retrospective_id, name="get_retrospective"),
    path("retrospectives/update/<int:id>/", retrospective_view.update_retrospective, name="update_retrospective"),
    path("retrospectives/delete/<int:id>/", retrospective_view.delete_retrospective, name="delete_retrospective"),
    path("retrospectives/public/<uuid:token>/", retrospective_view.view_public_retro, name="public_retro"),
    path("retrospectives/<int:id>/add_participant/", retrospective_view.add_participant, name="add_participant"),
    path("retrospectives/<int:id>/remove_participant/", retrospective_view.remove_participant, name="remove_participant"),
]
