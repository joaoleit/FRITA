import json
from django.http import HttpResponseBadRequest
from django.http import HttpResponseNotAllowed
from django.http import HttpResponseNotFound
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
from controllers import scrumaster_controller

@csrf_exempt
def create_user(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    try:
        data = json.loads(request.body)
        master = scrumaster_controller.create_scrumaster(
            name=data.get("name"),
            email=data.get("email"),
            password=data.get("password"),
        )

        return JsonResponse(
            {
                "id": master.id,
                "name": master.name,
                "email": master.email,
                "created_at": master.created_at,
            },
            status=201,
        )

    except json.JSONDecodeError:
        return HttpResponseBadRequest("JSON inválido")
    except Exception as e:
        return HttpResponseBadRequest(str(e))

@require_GET
def get_user_id(request, id):

    try:
        master = scrumaster_controller.get_scrumaster_id(id)

        return JsonResponse(
            {
                "id": master.id,
                "name": master.name,
                "email": master.email,
                "created_at": master.created_at,
            }
        )

    except scrumaster_controller.ScrumMaster.DoesNotExist:
        return HttpResponseNotFound("Usuário não encontrado")

@csrf_exempt
def update_user(request, id):
    if request.method not in ["PUT", "PATCH"]:
        return HttpResponseNotAllowed(["PUT", "PATCH"])

    try:
        data = json.loads(request.body)
        master = scrumaster_controller.update_scrumaster(
            id,
            name=data.get("name"),
            email=data.get("email"),
            categories=data.get("categories"),
        )

        return JsonResponse(
            {
                "id": master.id,
                "name": master.name,
                "email": master.email,
                "created_at": master.created_at,
            }
        )

    except json.JSONDecodeError:
        return HttpResponseBadRequest("JSON inválido")
    except scrumaster_controller.ScrumMaster.DoesNotExist:
        return HttpResponseNotFound("Usuário não encontrado")
    except Exception as e:
        return HttpResponseBadRequest(str(e))

@csrf_exempt
def delete_user(request, id):
    if request.method != "DELETE":
        return HttpResponseNotAllowed(["DELETE"])

    try:
        scrumaster_controller.delete_scrumaster(id)
        return JsonResponse(
            {"status": "success", "message": "Usuário deletado com sucesso"}
        )

    except scrumaster_controller.ScrumMaster.DoesNotExist:
        return HttpResponseNotFound("Usuário não encontrado")