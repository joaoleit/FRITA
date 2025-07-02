from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class RetroType(models.TextChoices):
    WNSI = 'well/not_so_well/new_ideas', 'Well/Not so Well/New Ideas'
    EASY_AS_PIE = 'easy_as_pie', 'Easy As Pie'
    OPEN_THE_BOX = 'open_the_box', 'Open the Box'


class ScrumMaster(AbstractUser):
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    created_at = models.DateField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return f"{self.name}: {self.email}"
    

class Project(models.Model):
    name = models.CharField(max_length=100)
    creator = models.ForeignKey(ScrumMaster, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Retrospective(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    retro_type = RetroType.choices
    url = models.CharField(max_length=255) # url que leva pra retro
    token = models.UUIDField(default=uuid.uuid4, unique=True, null=True, editable=False)
    participants = models.JSONField(default=list) # nomes dos participantes
    resume = models.TextField() # resumo da retro
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField()

    def __str__(self):
        return self.retro_type, self.url

class Card(models.Model):
    retro = models.ForeignKey(Retrospective, on_delete=models.CASCADE)
    author = models.CharField(max_length=255, default='Anonymous') 
    content = models.TextField() # descrição do card
    type = models.CharField(max_length=50) # tipo de card pra cada tipo de retro: recycle, new idea, etc
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.type, self.author