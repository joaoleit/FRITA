from frita.models import Retrospective, Project
from django.core.exceptions import ValidationError
from django.db import transaction
from dotenv import load_dotenv
from google import genai
import os
from django.utils.dateparse import parse_date

def create_retrospective(project_id, retro_type, name):

    if not all([project_id, retro_type]):
        raise ValueError("Campos obrigatórios ausentes.")
    
    with transaction.atomic():
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            raise ValueError("Projeto não encontrado.")

        retro = Retrospective.objects.create(
            name=name,
            project=project,
            retro_type=retro_type,
            is_active=True
        )
        # pra acessar a retro sem autenticação
        retro.url = f"http://localhost:8000/retrospectives/public/{retro.token}/"
        retro.save()

    return retro


def get_retrospectives(params):
    retros = Retrospective.objects.all().order_by("-created_at")

    name = params.get("name")
    if name:
        retros = retros.filter(name__icontains=name)

    project_id = params.get("project")
    if project_id:
        retros = retros.filter(project__id=project_id)

    retro_type = params.get("retro_type")
    if retro_type:
        retros = retros.filter(retro_type=retro_type)

    date_str = params.get("date")
    if date_str:
        try:
            date = parse_date(date_str)
            if date:
                retros = retros.filter(created_at__date=date)
        except Exception:
            pass

    if not retros:
        raise Exception("Nenhuma retrospectiva encontrada.")

    lst = []
    for r in retros:
        lst.append({
            "id": r.id,
            "name": r.name,
            "project": {"id": r.project.id, "name": r.project.name},
            "retro_type": r.retro_type,
            "url": r.url,
            "participants": r.participants,
            "resume": r.resume,
            "created_at": r.created_at,
            "is_active": r.is_active
        })
    return lst


def get_retrospective_id(id):
    return Retrospective.objects.get(id=id)


def update_retrospective(id, retro_type=None, participants=None, resume=None, is_active=None):
    retro = Retrospective.objects.get(id=id)
    if not retro.is_active:
        raise Exception("Retrospectivas inativas não podem ser editadas.")

    if retro_type:
        retro.retro_type = retro_type
    if participants is not None:
        retro.participants = participants
    if resume:
        retro.resume = resume
    if is_active is not None:
        retro.is_active = is_active

    retro.save()
    return retro


def delete_retrospective(id):
    retro = Retrospective.objects.get(id=id)
    retro.delete()


def add_participant_to_retro(retro_id, participant_name):
    try:
        retro = Retrospective.objects.get(id=retro_id)
    except Retrospective.DoesNotExist:
        raise ValueError("Retrospectiva não encontrada.")

    if participant_name in retro.participants:
        raise ValueError("Este nome já está sendo usado.")

    retro.participants.append(participant_name)
    retro.save()
    return retro


def remove_participant_from_retro(retro_id, participant_name):

    try:
        retro = Retrospective.objects.get(id=retro_id)
    except Retrospective.DoesNotExist:
        raise ValueError("Retrospectiva não encontrada.")

    if participant_name not in retro.participants:
        raise ValueError("Participante não encontrado na retrospectiva.")

    retro.participants.remove(participant_name)
    retro.save()
    return retro

def generate_retro_resume(retro_id):
    """
    Gera e salva o resumo da retrospectiva usando o Gemini.
    """
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.envs', '.gemini_api_key'))

    try:
        retro = Retrospective.objects.get(id=retro_id)
    except Retrospective.DoesNotExist:
        raise ValueError("Retrospectiva não encontrada.")
    
    if not retro.is_active:
        raise ValueError("A retrospectiva precisa ter sido finalizada para gerar um resumo.")

    # cards da retro
    cards = retro.card_set.all()
    if not cards:
        retro.resume = "Sem cards para gerar o resumo."
        retro.save()
        return retro

    # prompt pro conteúdo e tipo dos cards
    prompt = """
    Gere um resumo desta retrospectiva com base nos seguintes cards.
    É preciso incluir: total de cards separando por type, onde cada type
    representa uma coluna de um tipo de retrospectiva divertida (por exemplo
    a retrospectiva easy as pie) mas sem traduzir o nome do type, também os
    principais temas discutidos e os nomes dos participantes que contribuíram.

    NÃO use Markdown, NÃO use asteriscos, listas, títulos ou negrito.
    Apenas texto corrido, separado em parágrafos claros.
    """
    
    participants = retro.participants or []
    
    if participants:
        prompt += f"\nParticiparam desta retrospectiva: {', '.join(participants)}.\n"
    else:
        prompt += "\nNenhum participante foi registrado.\n"

    prompt += "\nCards:\n"
    
    for card in cards:
        prompt += f"- [{card.type}] {card.content}\n"

    # chama o gemini
    api_key = os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        resumo_gerado = response.text.strip() if response.text else "Resumo não gerado."
    except Exception as e:
        resumo_gerado = f"Erro ao gerar resumo: {str(e)}"

    # salva o resumo
    retro.resume = resumo_gerado
    retro.save()
    return retro