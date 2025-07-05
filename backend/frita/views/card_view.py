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
            card_id=data.get("card_id"),
            author=data.get("author"),
            content = data.get("content"),
            type = data.get("type")
        )

        return JsonResponse({
            "card_id": card.project.id,
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
            "retro": c.project.id,
            "author": c.retro_type,
            "content": c.url,
            "type": c.participants,
            "created_at": c.created_at,
        })
    except card_controller.card.DoesNotExist:
        return HttpResponseNotFound("Card não encontrado")