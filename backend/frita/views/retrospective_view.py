import json
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseNotFound
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from frita.controllers import retrospective_controller
from frita.models import Retrospective


@csrf_exempt
@require_POST
def create_retrospective(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    try:
        data = json.loads(request.body)

        retro = retrospective_controller.create_retrospective(
            project_id=data.get("project_id"),
            retro_type=data.get("retro_type") # ex.: 'easy_as_pie'
        )

        return JsonResponse({
            "id": retro.id,
            "project": retro.project.id,
            "retro_type": retro.retro_type,
            "url": retro.url,
            "created_at": retro.created_at,
            "is_active": retro.is_active,
        }, status=201)

    except json.JSONDecodeError:
        return HttpResponseBadRequest("JSON inválido")
    except Exception as e:
        return HttpResponseBadRequest(str(e))


@require_GET
def get_retrospectives(request):
    try:
        retros = retrospective_controller.get_retrospectives()
        return JsonResponse(retros, safe=False, status=200)
    except Exception as e:
        return HttpResponseBadRequest(str(e))


@require_GET
def get_retrospective_id(request, id):
    try:
        r = retrospective_controller.get_retrospective_id(id)
        return JsonResponse({
            "id": r.id,
            "project": r.project.id,
            "retro_type": r.retro_type,
            "url": r.url,
            "participants": r.participants,
            "resume": r.resume,
            "created_at": r.created_at,
            "is_active": r.is_active,
        })
    except retrospective_controller.Retrospective.DoesNotExist:
        return HttpResponseNotFound("Retrospectiva não encontrada")


@csrf_exempt
def update_retrospective(request, id):
    if request.method not in ["PUT", "PATCH"]:
        return HttpResponseNotAllowed(["PUT", "PATCH"])

    try:
        data = json.loads(request.body)

        retro = retrospective_controller.update_retrospective(
            id=id,
            retro_type=data.get("retro_type"),
            url=data.get("url"),
            participants=data.get("participants"),
            resume=data.get("resume"),
            is_active=data.get("is_active"),
        )

        return JsonResponse({
            "id": retro.id,
            "project": retro.project.id,
            "retro_type": retro.retro_type,
            "url": retro.url,
            "participants": retro.participants,
            "resume": retro.resume,
            "created_at": retro.created_at,
            "is_active": retro.is_active,
        })

    except json.JSONDecodeError:
        return HttpResponseBadRequest("JSON inválido")
    except retrospective_controller.Retrospective.DoesNotExist:
        return HttpResponseNotFound("Retrospectiva não encontrada")
    except Exception as e:
        return HttpResponseBadRequest(str(e))


@csrf_exempt
def delete_retrospective(request, id):
    if request.method != "DELETE":
        return HttpResponseNotAllowed(["DELETE"])

    try:
        retrospective_controller.delete_retrospective(id)
        return JsonResponse({"status": "success", "message": "Retrospectiva deletada com sucesso"})

    except retrospective_controller.Retrospective.DoesNotExist:
        return HttpResponseNotFound("Retrospectiva não encontrada")


@require_GET
def view_public_retro(request, token):
    try:
        retro = Retrospective.objects.get(token=token)

        return JsonResponse({
            "project": retro.project,
            "retro_type": retro.retro_type,
            "participants": retro.participants,
            "resume": retro.resume,
            "created_at": retro.created_at,
            "is_active": retro.is_active,
        })

    except Retrospective.DoesNotExist:
        return HttpResponseNotFound("Retrospectiva não encontrada.")
    
@csrf_exempt
@require_POST
def add_participant(request, id):
    try:
        data = json.loads(request.body)
        participant_name = data.get("name")

        retro = retrospective_controller.add_participant_to_retro(id, participant_name)

        return JsonResponse({
            "status": "success",
            "participants": retro.participants
        }, status=200)

    except json.JSONDecodeError:
        return HttpResponseBadRequest("JSON inválido.")
    except ValueError as e:
        return HttpResponseBadRequest(str(e))
    except retrospective_controller.Retrospective.DoesNotExist:
        return HttpResponseNotFound("Retrospectiva não encontrada.")
    
@csrf_exempt
@require_POST
def remove_participant(request, id):
    try:
        data = json.loads(request.body)
        participant_name = data.get("name")

        retro = retrospective_controller.remove_participant_from_retro(id, participant_name)

        return JsonResponse({
            "status": "success",
            "participants": retro.participants
        }, status=200)

    except json.JSONDecodeError:
        return HttpResponseBadRequest("JSON inválido.")
    except ValueError as e:
        return HttpResponseBadRequest(str(e))
    except retrospective_controller.Retrospective.DoesNotExist:
        return HttpResponseNotFound("Retrospectiva não encontrada.")