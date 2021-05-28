from django.urls import path
from .views import index, register, login_, logout_, load_mail, compose, email

urlpatterns = [
    path("emails/<int:email_id>/", email, name="email-details"),
    path("mail/<str:mailbox>/", load_mail, name="mailbox"),
    path("compose/", compose, name="compose"),
    path("resgister/", register, name="register"),
    path("logout", logout_, name="logout"),
    path("login/", login_, name="login"),
    path("", index, name="index"),
    # re-render index for react-router-dom's urls
]
