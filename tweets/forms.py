from .models import Tweet
from django import forms


class TweetForm(forms.ModelForm):

    class Meta:
        model = Tweet
        fields = "content",
        labels = {"content": ""}
        widgets = {"content": forms.Textarea(attrs={
            "placeholder": "Your tweet",
            "class": "form-control form-group",
            "rows": 4,
            "oninput": "charsLeft(this);"
        })}
