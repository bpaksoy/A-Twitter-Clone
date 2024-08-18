from django import forms
from django.forms import ModelForm
from .models import Tweet


class NewTweetForm(ModelForm):
    content = forms.CharField(label="content", widget=forms.Textarea(
        attrs={'class': 'form-control text-justify', 'style': ' width: 600px; vertical-align: top'}))

    class Meta:
        model = Tweet
        fields = ['content']
