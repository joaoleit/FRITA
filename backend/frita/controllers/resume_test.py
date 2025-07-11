from frita.models import Retrospective, Project, Card
from controllers.retrospective_controller import generate_retro_resume
from frita.models import RetroType 

# ⚠️ Ajuste o ID do seu projeto real
project = Project.objects.first()

# Cria uma retrospectiva de teste do tipo WNSI
retro = Retrospective.objects.create(
    project=project,
    retro_type=RetroType.WNSI,
    is_active=True
)

# Cria alguns cards válidos para WNSI
Card.objects.create(retro=retro, type="well", content="O time colaborou muito bem.", author="João")
Card.objects.create(retro=retro, type="not so well", content="Tivemos problemas de comunicação.", author="Maria")
Card.objects.create(retro=retro, type="new ideas", content="Fazer reuniões diárias mais curtas.", author="Ana")

# Gera o resumo com o Gemini
retro = generate_retro_resume(retro.id)

# Exibe o resumo gerado
print("\nResumo da retrospectiva:")
print(retro.resume)
