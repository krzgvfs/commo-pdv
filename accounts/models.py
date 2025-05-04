from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class CustomUser(AbstractUser):
    cpf = models.CharField(max_length=11, unique=True, null=True, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)