import json
from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from frita.controllers import scrumaster_controller
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

@api_view(["POST"])
@permission_classes([])
def create_scrumaster(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    try:
        data = json.loads(request.body)
        master = scrumaster_controller.create_scrumaster(
            name=data.get("name"),
            email=data.get("email"),
            password=data.get("password"),
        )

        return Response(
            {
                "name": master.name,
                "email": master.email,
                "created_at": master.created_at,
            },
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_scrumasters(request):
    try:
        masters = scrumaster_controller.get_scrumasters()

        return Response(masters, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_scrumaster_id(request, id):

    try:
        master = scrumaster_controller.get_scrumaster_id(id)

        return Response(
            {
                "id": master.id,
                "name": master.name,
                "email": master.email,
                "created_at": master.created_at,
            }
        )

    except scrumaster_controller.ScrumMaster.DoesNotExist:
        return Response("Scrum Master não encontrado", status=status.HTTP_404_NOT_FOUND)

@api_view(["PUT", "PATCH"])
@permission_classes([IsAuthenticated])
def update_scrumaster(request, id):
    if request.method not in ["PUT", "PATCH"]:
        return HttpResponseNotAllowed(["PUT", "PATCH"])

    try:
        data = json.loads(request.body)
        master = scrumaster_controller.update_scrumaster(
            id,
            name=data.get("name"),
            email=data.get("email"),
        )

        return Response(
            {
                "id": master.id,
                "name": master.name,
                "email": master.email,
                "created_at": master.created_at,
            }
        )

    except json.JSONDecodeError:
        return Response("JSON inválido", status=status.HTTP_400_BAD_REQUEST)
    except scrumaster_controller.ScrumMaster.DoesNotExist:
        return Response("Scrum Master não encontrado", status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_scrumaster(request, id):
    if request.method != "DELETE":
        return HttpResponseNotAllowed(["DELETE"])

    try:
        scrumaster_controller.delete_scrumaster(id)
        return Response(
            {"status": "success", "message": "Scrum Master deletado com sucesso"}
        )

    except scrumaster_controller.ScrumMaster.DoesNotExist:
        return Response("Scrum Master não encontrado", status=status.HTTP_404_NOT_FOUND)
    

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_scrumaster_user(request):

    try:
        master = scrumaster_controller.get_scrumaster_id(request.user.id)

        return Response(
            {
                "id": master.id,
                "name": master.name,
                "email": master.email,
                "created_at": master.created_at,
            }
        )

    except scrumaster_controller.ScrumMaster.DoesNotExist:
        return Response("Scrum Master não encontrado", status=status.HTTP_404_NOT_FOUND)
