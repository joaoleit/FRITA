import json
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseNotFound
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from frita.controllers import card_controller
from frita.models import Card


@csrf_exempt
@require_POST
def create_card(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    try:
        data = json.loads(request.body)

        card = card_controller.create_card(
            retro_id=data.get("retro_id"),
            author=data.get("author"),
            content = data.get("content"),
            type = data.get("type")
        )

        return JsonResponse({
            "card_id": card.id,
            "author": card.author,
            "content": card.content,
            "type": card.type,
            "created_at": card.created_at,
        }, status=201)

    except json.JSONDecodeError:
        return HttpResponseBadRequest("JSON inválido")
    except Exception as e:
        return HttpResponseBadRequest(str(e))
    
@require_GET
def get_cards(request):
    try:
        retros = card_controller.get_cards()
        return JsonResponse(retros, safe=False, status=200)
    except Exception as e:
        return HttpResponseBadRequest(str(e))
    
@require_GET
def get_card_id(request, id):
    try:
        c = card_controller.get_card_id(id)
        return JsonResponse({
            "id": c.id,
            "retro": c.retro.id,
            "author": c.author,
            "content": c.content,
            "type": c.type,
            "created_at": c.created_at,
        })
    except card_controller.card.DoesNotExist:
        return HttpResponseNotFound("Card não encontrado")
    
@csrf_exempt
def update_card(request, id):
    if request.method not in ["PUT", "PATCH"]:
        return HttpResponseNotAllowed(["PUT", "PATCH"])

    try:
        data = json.loads(request.body)
        c = card_controller.update_card(
            id=id,
            author=data.get("author"),
            content=data.get("content"),
            type=data.get("type")
        )

        return JsonResponse({
            "id": c.id,
            "author": c.author,
            "content": c.content,
            "type": c.type,
            "created_at": c.created_at
        })

    except json.JSONDecodeError:
        return HttpResponseBadRequest("JSON inválido")
    except card_controller.Card.DoesNotExist:
        return HttpResponseNotFound("Card não encontrado.")
    except Exception as e:
        return HttpResponseBadRequest(str(e))
    
@csrf_exempt
def delete_card(request, id):
    if request.method != "DELETE":
        return HttpResponseNotAllowed(["DELETE"])

    try:
        card_controller.delete_card(id)
        return JsonResponse({
            "status": "success",
            "message": "Card deletado com sucesso"
        })

    except card_controller.Card.DoesNotExist:
        return HttpResponseNotFound("Card não encontrado.")
