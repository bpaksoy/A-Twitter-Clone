from django.contrib import admin
from .models import *

# Register your models here.


class ProfileInline(admin.StackedInline):
    model = Profile


class UserAdmin(admin.ModelAdmin):
    model = User
    # Just display username fields on admin page
    fields = ["username"]
    inlines = [ProfileInline]


# admin.site.unregister(User)

admin.site.register(User, UserAdmin)
admin.site.register(Tweet)
admin.site.register(Like)
admin.site.register(Profile)
