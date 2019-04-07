from . import models

from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.contrib.auth.models import User


class RegisterForm(UserCreationForm):

    class Meta:
        model = User
        fields = "username", "email", "first_name", "last_name",

    def __init__(self, *args, **kwargs):
        super(RegisterForm, self).__init__(*args, **kwargs)
        self.fields["first_name"].required = True
        self.fields["last_name"].required = False
        self.fields["email"].required = True


class UserUpdateForm(UserChangeForm):

    new_password = forms.CharField(widget=forms.PasswordInput(
        attrs={"placeholder": "Minumum 5 characters",
               "class": "form-control"}
    ), required=False)
    repeat_password = forms.CharField(widget=forms.PasswordInput(
        attrs={"placeholder": "Enter above password",
               "class": "form-control"}
    ), required=False)
    password = None

    class Meta:
        model = User
        fields = "first_name", "last_name", "email", "new_password", "repeat_password",

    def __init__(self, *args, **kwargs):
        super(UserUpdateForm, self).__init__(*args, **kwargs)
        self.fields["first_name"].required = True
        self.fields["first_name"].widget.attrs = {"placeholder": "First Name",
                                                  "class": "form-control"}
        self.fields["last_name"].required = False
        self.fields["last_name"].widget.attrs = {"placeholder": "Last Name",
                                                 "class": "form-control"}
        self.fields["email"].required = True
        self.fields["email"].widget.attrs = {"placeholder": "Email",
                                             "class": "form-control"}

    def clean_new_password(self):
        new_pass = self.cleaned_data.get("new_password")
        if new_pass and len(new_pass) < 5:
            raise forms.ValidationError("Atleat 5 characters.")
        return new_pass

    def clean_repeat_password(self):
        new_password = self.cleaned_data.get("new_password")
        repeat_password = self.cleaned_data.get("repeat_password")

        if new_password and new_password != repeat_password:
            raise forms.ValidationError("Repeat password doesn't match.")
        return repeat_password


class ProfileUpdateForm(forms.ModelForm):

    class Meta:
        model = models.UserProfile
        fields = "profile_pic",

    def __init__(self, *args, **kwargs):
        super(ProfileUpdateForm, self).__init__(*args, **kwargs)
        self.fields["profile_pic"].required = False
        self.fields["profile_pic"].label = "Profile Picture"
        self.fields["profile_pic"].widget = forms.FileInput(
            attrs={"class": "form-control-file align-middle"}
        )
