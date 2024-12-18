from rest_framework import serializers
from .models import Usuarios
from django.contrib.auth.hashers import make_password

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = ['nome', 'email', 'senha', 'nivel_acesso', 'status']

    def validate_senha(self, value):
        # Criptografa a senha antes de 
        return make_password(value)
