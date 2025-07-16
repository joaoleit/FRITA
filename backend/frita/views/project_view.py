import json
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseNotFound, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from frita.controllers import project_controller
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_project(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    try:
        data = json.loads(request.body)
        project = project_controller.create_project(
            name=data.get("name"),
            creator_id=request.user.id,
        )

        return Response({
            "id": project.id,
            "name": project.name,
            "creator_id": project.creator.id,
            "created_at": project.created_at,
        }, status=status.HTTP_201_CREATED)

    except json.JSONDecodeError:
        return HttpResponseBadRequest("JSON inválido")
    except Exception as e:
        return HttpResponseBadRequest(str(e))

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_projects(request):
    try:
        projects = project_controller.get_projects(request.user.id)
        return Response(projects, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_project_id(request, id):
    try:
        p = project_controller.get_project_by_id(id)
        return Response({
            "id": p.id,
            "name": p.name,
            "creator_id": p.creator.id,
            "creator_name": p.creator.name,
            "created_at": p.created_at,
        }, status=status.HTTP_200_OK)
    except project_controller.Project.DoesNotExist:
        return Response("Projeto não encontrado.", status=status.HTTP_404_NOT_FOUND)

@api_view(["PUT", "PATCH"])
@permission_classes([IsAuthenticated])
def update_project(request, id):
    if request.method not in ["PUT", "PATCH"]:
        return HttpResponseNotAllowed(["PUT", "PATCH"])

    try:
        data = json.loads(request.body)
        p = project_controller.update_project(id=id, name=data.get("name"))

        return Response({
            "id": p.id,
            "name": p.name,
            "creator_id": p.creator.id,
            "created_at": p.created_at,
        })

    except json.JSONDecodeError:
        return HttpResponseBadRequest("JSON inválido")
    except project_controller.Project.DoesNotExist:
        return HttpResponseNotFound("Projeto não encontrado.")
    except Exception as e:
        return HttpResponseBadRequest(str(e))

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_project(request, id):
    if request.method != "DELETE":
        return HttpResponseNotAllowed(["DELETE"])

    try:
        project_controller.delete_project(id)
        return JsonResponse({
            "status": "success",
            "message": "Projeto deletado com sucesso"
        })

    except project_controller.Project.DoesNotExist:
        return HttpResponseNotFound("Projeto não encontrado.")
