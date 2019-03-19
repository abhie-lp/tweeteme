from . import forms
from django.views.generic.edit import CreateView
from django.contrib.auth.models import User


class RegisterView(CreateView):
    form_class = forms.RegisterForm
    success_url = "/tweet/"
    template_name = "accounts/register.html"
