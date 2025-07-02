from frita.models import ScrumMaster
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from django.core.validators import validate_email

def create_scrumaster(name, email, password):
    if not all([name, email, password]):
        raise ValueError("Todos os campos são obrigatórios.")
    
    if ScrumMaster.objects.filter(email=email).exists():
        raise ValueError("Este email já foi cadastrado.")
    
    try:
        validate_email(email)
    except ValidationError:
        raise ValueError("Formato de email inválido.")
    
    if len(password) < 6:
        raise ValueError("A senha precisa ter no mínimo 6 caracteres.")

    master = ScrumMaster.objects.create(
        name=name,
        email=email,
        password=make_password(password),
    )

    return master

def get_scrumaster_id(id):
    return ScrumMaster.objects.get(id=id)

def get_scrumasters():
    masters = ScrumMaster.objects.all()
    if not masters:
        raise ValueError(f"Não há Scrum Masters cadastrados")

    lst = []
    for master in masters:
        m = {
            "id": master.id,
            "master": master.name,
            "email": master.email,
            "created_at": master.created_at
        }

        lst.append(m)
    
    return lst


def update_scrumaster(id, name=None, email=None, password=None):
    master = ScrumMaster.objects.get(id=id)

    if name:
        master.name = name
    if email:
        master.email = email
    if password:
        master.password = make_password(password)

    master.save()

    return master


def delete_scrumaster(id):
    user = ScrumMaster.objects.get(id=id)
    user.delete()