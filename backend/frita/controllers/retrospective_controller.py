# se is_active da retro for false não deve ser possível editá-la
from frita.models import Retrospective, Project
from django.core.exceptions import ValidationError
from django.db import transaction

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
        retro.url = f"https://localhost:8000/retrospectives/public/{retro.token}/"
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
        raise Exception("Retrospectivas não ativas não podem ser editadas.")

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