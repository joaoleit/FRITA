# frita/views.py
from django.http import HttpResponse

def exemplo_view(request):
    return HttpResponse("FRITA funcionando!")
