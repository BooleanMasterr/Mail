from django.shortcuts import render
from django.contrib.auth import get_user_model, login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db import IntegrityError
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import Email

# Create your views here.

User = get_user_model()


@login_required
def index(request):
    return render(request, "mail/index.html", {})


def register(request):

    if request.method == "POST":

        email = request.POST["email"]
        password = request.POST["password"]

        confirmation = request.POST["password2"]

        if password != confirmation:
            messages.error("Passwords did not match")
        else:

            try:
                user = User(email=email, username=email)
                user.set_password(password)
                user.save()
            except IntegrityError:
                messages.error(request, "Email is already taken")
                return HttpResponseRedirect(reverse("register"))

            login(request, user)
            return HttpResponseRedirect(reverse("index"))

    return render(request, "mail/register.html", {})


def login_(request):

    if request.method == "POST":
        email = request.POST["email"]
        password = request.POST["password"]

        user = authenticate(request, email=email, password=password)

        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            messages.error(request, "Invalid credentials")
            return HttpResponseRedirect(reverse("login"))

    return render(request, "mail/login.html", {})


@login_required
def logout_(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))


@login_required
def load_mail(request, mailbox):
    if mailbox == "inbox":
        emails = Email.objects.filter(
            user=request.user, recipients=request.user, archived=False
        )
    elif mailbox == "sent":
        emails = Email.objects.filter(user=request.user, sender=request.user)
    elif mailbox == "archive":
        emails = Email.objects.filter(
            user=request.user, recipients=request.user, archived=True
        )
    elif mailbox == "all":
        emails = Email.objects.filter(recipients=request.user)
    else:
        return JsonResponse({"error": "Invalid mailbox."}, status=400)

    emails = emails.order_by("-timestamp").all()
    return JsonResponse([email.serialize() for email in emails], safe=False)


@csrf_exempt
@login_required
def compose(request):

    # Composing a new email must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."})

    # Check recipient emails
    data = json.loads(request.body)
    data = data["body"]
    if data.get("recipients") == "":
        return JsonResponse({"error": "At least one recipient required"})
    else:
        emails = [email.strip() for email in data.get("recipients").split(",")]

        # Convert email addresses to users
        recipients = []
        for email in emails:
            try:
                user = User.objects.get(email=email)
                recipients.append(user)
            except User.DoesNotExist:
                return JsonResponse(
                    {"error": f"User with email {email} does not exist."}
                )

        # Get contents of email
        subject = data.get("subject", "")
        body = data.get("body", "")

        if subject == "":
            return JsonResponse({"error": "Email must have a subject"})

        # Create one email for each recipient, plus sender
        users = set()
        users.add(request.user)
        users.update(recipients)
        for user in users:
            email = Email(
                user=user,
                sender=request.user,
                subject=subject,
                body=body,
                read=user == request.user,
            )
            email.save()
            for recipient in recipients:
                email.recipients.add(recipient)
            email.save()

    return JsonResponse({"message": "Email sent successfully."})


@csrf_exempt
@login_required
def email(request, email_id):

    try:
        email_obj = Email.objects.get(pk=email_id)
    except Email.DoesNotExist:
        return JsonResponse({"error": "Email does not exist"})
    else:
        email_obj.read = True
        email_obj.save()

        if request.method == "PUT":
            data = json.loads(request.body)["body"]
            if data["archived"] is not None:
                email_obj.archived = data["archived"]
                email_obj.save()

    return JsonResponse(email_obj.serialize(), status=200)