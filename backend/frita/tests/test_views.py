from django.test import TestCase, RequestFactory
from django.contrib.auth.models import AnonymousUser
from frita.views import project_view, scrumaster_view


class ViewsTestCase(TestCase):

    def setUp(self):
        self.factory = RequestFactory()

    def test_get_scrumaster_authentication(self):
        request = self.factory.get("get_scrumaster")
        request.user = AnonymousUser()

        result = scrumaster_view.get_scrumasters(request)
        self.assertEqual(result.status_code, 401, "Usuario não autorizado")

    def test_get_project_authentication(self):
        request = self.factory.get("get_scrumaster")
        request.user = AnonymousUser()

        result = project_view.get_projects(request)
        self.assertEqual(result.status_code, 401, "Usuario não autorizado")
