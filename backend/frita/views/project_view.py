import json
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseNotFound, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from frita.controllers import project_controller

@csrf_exempt
@require_POST
def create_project(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    try:
        data = json.loads(request.body)
        project = project_controller.create_project(
            name=data.get("name"),
            creator_id=data.get("creator_id"),
        )

        return JsonResponse({
            "id": project.id,
            "name": project.name,
            "creator_id": project.creator.id,
            "created_at": project.created_at,
        }, status=201)

    except json.JSONDecodeError:
        return HttpResponseBadRequest("JSON inválido")
    except Exception as e:
        return HttpResponseBadRequest(str(e))

@require_GET
def get_projects(request):
    try:
        projects = project_controller.get_projects()
        return JsonResponse(projects, safe=False, status=200)
    except Exception as e:
        return HttpResponseBadRequest(str(e))

@require_GET
def get_project_id(request, id):
    try:
        p = project_controller.get_project_by_id(id)
        return JsonResponse({
            "id": p.id,
            "name": p.name,
            "creator_id": p.creator.id,
            "creator_name": p.creator.name,
            "created_at": p.created_at,
        })
    except project_controller.Project.DoesNotExist:
        return HttpResponseNotFound("Projeto não encontrado.")

@csrf_exempt
def update_project(request, id):
    if request.method not in ["PUT", "PATCH"]:
        return HttpResponseNotAllowed(["PUT", "PATCH"])

    try:
        data = json.loads(request.body)
        p = project_controller.update_project(id=id, name=data.get("name"))

        return JsonResponse({
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

@csrf_exempt
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
