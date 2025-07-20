from frita.models import Project, ScrumMaster
from django.test import TestCase

class ModelsTestCase(TestCase):
    
    def setUp(self):
        ScrumMaster.objects.create(name="vinicius",email="vinicius@gmail.com",password="123")
        ScrumMaster.objects.create(name="joao",email="joao@gmail.com",password="123456")
        Project.objects.create(name="hi", creator =ScrumMaster.objects.get(name="vinicius"))

    def test_scrummaster(self):
        vini = ScrumMaster.objects.get(name="vinicius")
        self.assertEqual(vini.name, "vinicius")
        self.assertEqual(vini.email,"vinicius@gmail.com")
        self.assertEqual(vini.password,"123")
    
    def test_scrummaster_password_length(self):
        vini = ScrumMaster.objects.get(name="vinicius")
        self.assertGreaterEqual(len(vini.password), 6)
    
    def test_project(self):
        project = Project.objects.get(name="hi")
        self.assertEqual(project.name,"hi")
        self.assertEqual(project.creator,ScrumMaster.objects.get(name="joao"))
    
    def test_project_name_length(self):
        project = Project.objects.get(name="hi")
        self.assertLessEqual(len(project.name),100)

    

    
 

