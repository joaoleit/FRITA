from frita.views import views, retrospective_view, scrumaster_view, project_view, card_view
from django.urls import path

urlpatterns = [
    path('', views.exemplo_view, name='view'), # teste
    path('scrumasters/create/', scrumaster_view.create_scrumaster, name='create_scrumaster'),
    path('scrumasters/', scrumaster_view.get_scrumasters, name='get_scrumaster'),
    path('scrumasters/<int:id>', scrumaster_view.get_scrumaster_id, name='get_scrumaster'),
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
    path("retrospectives/resume/<int:retro_id>/", retrospective_view.generate_retro_resume, name="resume"),
    path("projects/create/", project_view.create_project, name="create_project"),
    path("projects/", project_view.get_projects, name="get_projects"),
    path("projects/<int:id>/", project_view.get_project_id, name="get_project"),
    path("projects/update/<int:id>/", project_view.update_project, name="update_project"),
    path("projects/delete/<int:id>/", project_view.delete_project, name="delete_project"),
    path("cards/create/", card_view.create_card, name="create_card"),
    path("cards/", card_view.get_cards, name="get_cards"),
    path("cards/<int:id>/", card_view.get_card_id, name="get_card"),
    path("cards/update/<int:id>/", card_view.update_card, name="update_card"),
    path("cards/delete/<int:id>/", card_view.delete_card, name="delete_card"),
]
