from frita.models import Project, ScrumMaster

def create_project(name, creator_id):
    if not name or not creator_id:
        raise ValueError("Nome e ID do Scrum Master são obrigatórios.")

    try:
        creator = ScrumMaster.objects.get(id=creator_id)
    except ScrumMaster.DoesNotExist:
        raise ValueError("Scrum Master não encontrado.")

    project = Project.objects.create(name=name, creator=creator)
    return project

def get_projects(creator_id):
    projects = Project.objects.filter(creator_id=creator_id)
    if not projects:
        raise ValueError("Nenhum projeto encontrado.")

    return [
        {
            "id": p.id,
            "name": p.name,
            "creator_id": p.creator.id,
            "creator_name": p.creator.name,
            "created_at": p.created_at,
        }
        for p in projects
    ]

def get_project_by_id(id):
    return Project.objects.get(id=id)

def update_project(id, name=None):
    project = Project.objects.get(id=id)
    if name:
        project.name = name
    project.save()
    return project

def delete_project(id):
    project = Project.objects.get(id=id)
    project.delete()
