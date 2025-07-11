from frita.models import Retrospective, Project
from django.core.exceptions import ValidationError
from django.db import transaction
from dotenv import load_dotenv
from google import genai
import os

def create_retrospective(project_id, retro_type):

    if not all([project_id, retro_type]):
        raise ValueError("Campos obrigatórios ausentes.")
    
    with transaction.atomic():
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            raise ValueError("Projeto não encontrado.")

        retro = Retrospective.objects.create(
            project=project,
            retro_type=retro_type,
            is_active=True
        )
        # pra acessar a retro sem autenticação
        retro.url = f"http://localhost:8000/retrospectives/public/{retro.token}/"
        retro.save()

    return retro


def get_retrospectives():
    retros = Retrospective.objects.all()
    if not retros:
        raise Exception("Nenhuma retrospectiva encontrada.")

    lst = []
    for r in retros:
        lst.append({
            "id": r.id,
            "project": r.project.id,
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

    # Pega os cards relacionados
    cards = retro.card_set.all()
    if not cards:
        retro.resume = "Sem cards para gerar o resumo."
        retro.save()
        return retro

    # Monta o prompt baseado no conteúdo e tipo dos cards
    prompt = "Gere um resumo desta retrospectiva considerando os seguintes cards:\n\n"
    for card in cards:
        prompt += f"- [{card.type}] {card.content}\n"

    # Chama o Gemini usando o Client (forma que funcionou pra você)
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

    # Salva no campo resume
    retro.resume = resumo_gerado
    retro.save()
    return retro