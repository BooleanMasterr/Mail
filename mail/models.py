from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# Create your models here.


class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None):

        if not email:
            raise ValueError("User must have email")

        user = self.model(email=self.normalize_email(email), username=username)
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, username, password):
        user = self.create_user(email=email, username=username, password=password)
        user.is_staff = True
        user.is_admin = True
        user.is_superuser = True

        user.save()

        return user


class User(AbstractBaseUser):
    email = models.EmailField(verbose_name="email", unique=True, max_length=80)
    username = models.CharField(max_length=80)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    REQUIRED_FIELDS = ['username']
    USERNAME_FIELD = "email"

    objects = UserManager()

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, perm):
        return self.is_admin

    def __str__(self):
        return self.email


class Email(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="emails")
    sender = models.ForeignKey(
        "User", on_delete=models.PROTECT, related_name="emails_sent"
    )
    recipients = models.ManyToManyField("User", related_name="emails_received")
    subject = models.CharField(max_length=255)
    body = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    archived = models.BooleanField(default=False)

    def serialize(self):
        return {
            "id": self.id,
            "sender": self.sender.email,
            "recipients": [user.email for user in self.recipients.all()],
            "subject": self.subject,
            "body": self.body,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "read": self.read,
            "archived": self.archived,
        }
