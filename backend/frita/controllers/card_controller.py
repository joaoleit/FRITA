from frita.models import Retrospective, Card, validate_card_type

def create_card(retro_id, author, content, type):

    if not retro_id:
        raise ValueError("Campo obrigatório ausente: retro_id")
    
    try:
        retro = Retrospective.objects.get(id=retro_id)
    except retro.DoesNotExist:
        raise ValueError("A retrospectiva referenciada não foi encontrada.")

    card = Card.objects.create(
        retro=retro,
        author=author,
        content=content,
        type=type # conferir no model os tipos válidos
    )

    card.save()

    return card

def get_cards():
    cards = Card.objects.all()
    if not cards:
        raise Exception("Nenhum card encontrado.")

    lst = []
    for c in cards:
        lst.append({
            "id": c.id,
            "retro": c.retro.id,
            "author": c.author,
            "content": c.content,
            "type": c.type,
            "created_at": c.created_at,
        })
    return lst

def get_card_id(id):
    return Card.objects.get(id=id)

def update_card(id, author=None, content=None, type=None):
    card = Card.objects.get(id=id)
    if not card.retro.is_active:
        raise Exception("Cards de retrospectivas inativas não podem ser editados.")

    if author:
        card.author = author
    if content:
        card.content = content
    if type:
        validate_card_type(card)
        card.type = type

    card.save()
    return card

def delete_card(id):
    card = Card.objects.get(id=id)
    card.delete()