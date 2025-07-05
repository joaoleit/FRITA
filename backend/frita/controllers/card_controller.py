from frita.models import Card

def create_card(card_id, author, content, type):

    if not card_id:
        raise ValueError("Campo obrigatório ausente: card_id")
    
    try:
        card = card.objects.get(id=card_id)
    except card.DoesNotExist:
        raise ValueError("cardspectiva não encontrada.")

    card = Card.objects.create(
        card=card,
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
            "card": c.project.id,
            "author": c.card_type,
            "content": c.url,
            "type": c.participants,
            "created_at": c.created_at,
        })
    return lst

def get_card_id(id):
    return Card.objects.get(id=id)

def update_card(id, author=None, content=None, type=None):
    card = card.objects.get(id=id)
    if not card.is_active:
        raise Exception("Cards de retrospectivas inativas não podem ser editados.")

    if author:
        card.author = author
    if content:
        card.content = content
    if type:
        card.type = type

    card.save()
    return card

def delete_card(id):
    card = card.objects.get(id=id)
    card.delete()