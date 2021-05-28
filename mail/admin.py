from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model

from .models import Email

# Register your models here.


class UsrAdmin(UserAdmin):
    list_display = ("email", "is_active", "is_admin")
    filter_horizontal = ()
    fieldsets = ()
    readonly_fields = ("id",)
    list_filter = ()

admin.site.register(get_user_model(), UsrAdmin)
admin.site.register(Email)
