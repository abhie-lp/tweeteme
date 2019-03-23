from . import forms
from django.views.generic.edit import CreateView
from django.urls import reverse_lazy


class RegisterView(CreateView):
    form_class = forms.RegisterForm
    success_url = reverse_lazy("user:login")
    template_name = "accounts/register.html"
