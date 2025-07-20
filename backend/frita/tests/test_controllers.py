from frita.controllers import project_controller, scrumaster_controller
from frita.models import Project, ScrumMaster
from django.test import TestCase

class ControllerTestCase(TestCase):

    def setUp(self):
        ScrumMaster.objects.create(name="vinicius",email="vinicius@gmail.com",password="123")
        ScrumMaster.objects.create(name="joao",email="joao@gmail.com",password="123456")
        ScrumMaster.objects.create(name="matheus",email="matheus@gmail.com",password="123456")
        Project.objects.create(name="hi", creator =ScrumMaster.objects.get(name="vinicius"))
        Project.objects.create(name="hello", creator =ScrumMaster.objects.get(name="vinicius"))

    def test_get_scrummasters(self):
        masters = ScrumMaster.objects.all()
        list = scrumaster_controller.get_scrumasters()
        name_list =[]
        for master in masters:
            name = master.name
            name_list.append(name)
    
        if(len(list) != len(name_list)):
            self.assertFalse(True,"As listas nao sao iguais")

        for i in range(0,len(list)): 
            l = list[i]
            j = name_list[i]
            self.assertEqual([l['master']],[j])

    def test_get_projects(self):
        vini = ScrumMaster.objects.get(name="vinicius")
        projects = Project.objects.filter(creator_id=vini.id)
        list = project_controller.get_projects(vini.id)
        project_list = []
        for p in projects:
            id = p.id
            project_list.append(id)

        if(len(list) != len(project_list)):
            self.assertFalse(True,"As listas nao sao iguais")
        
        for i in range(0,len(list)):
            p = list[i]
            j = project_list[i]
            self.assertEqual([p['id']],[j])

    def test_update_scrumaster(self):
        maria = ScrumMaster.objects.create(name="maria",email="maria@gmail.com",password="123")
        angela = scrumaster_controller.update_scrumaster(maria.id,"angela","angela@gmail.com")

        self.assertEqual(angela.name,"angela")
        self.assertEqual(angela.email,"angela@gmail.com")
    
    def test_update_project(self):
        project =  Project.objects.create(name="world", creator =ScrumMaster.objects.get(name="vinicius"))
        updated_project = project_controller.update_project(project.id,"hello world")

        self.assertEqual(updated_project.name,"hello world")



