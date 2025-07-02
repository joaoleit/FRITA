from frita.views import views, retrospective_view
from django.urls import path

urlpatterns = [
    path('', views.exemplo_view, name='exemplo'),
    path("retrospectives/create/", retrospective_view.create_retrospective, name="create_retrospective"),
    path("retrospectives/get/", retrospective_view.get_retrospectives, name="get_retrospectives"),
    path("retrospectives/get/<int:id>/", retrospective_view.get_retrospective_id, name="get_retrospective"),
    path("retrospectives/update/<int:id>/", retrospective_view.update_retrospective, name="update_retrospective"),
    path("retrospectives/delete/<int:id>/", retrospective_view.delete_retrospective, name="delete_retrospective"),
    path("retrospectives/public/<uuid:token>/", retrospective_view.view_public_retro, name="public_retro"),
    path("retrospectives/<int:id>/add_participant/", retrospective_view.add_participant, name="add_participant"),
    path("retrospectives/<int:id>/remove_participant/", retrospective_view.remove_participant, name="remove_participant"),
]
