from django.db import models

def upload_to_background(instance, filename):
    return "system/background.png"

def upload_to_logo(instance, filename):
    return "system/logo.png"

def upload_to_favicon(instance, filename):
    return "system/favicon.ico"

class SystemConfig(models.Model):
    logo = models.ImageField(upload_to=upload_to_logo, null=True, blank=True)
    background_image = models.ImageField(upload_to=upload_to_background, null=True, blank=True)
    favicon = models.ImageField(upload_to=upload_to_favicon, null=True, blank=True)
    def save(self, *args, **kwargs):
        # Apagar arquivos antigos
        if self.pk:
            old_instance = SystemConfig.objects.get(pk=self.pk)
            if old_instance.logo and old_instance.logo != self.logo:
                old_instance.logo.delete(save=False)
            if old_instance.background_image and old_instance.background_image != self.background_image:
                old_instance.background_image.delete(save=False)
            if old_instance.favicon and old_instance.favicon != self.favicon:
                old_instance.favicon.delete(save=False)
        super().save(*args, **kwargs)
        
        from django.db import models
from django.contrib.auth.hashers import make_password

class Usuarios(models.Model):
    id = models.AutoField(primary_key=True)  # ID como chave primária
    nome = models.CharField(max_length=50)  # Nome do usuário
    email = models.EmailField(unique=True)  # Email único
    senha = models.CharField(max_length=255)  # Senha criptografada
    nivel_acesso = models.IntegerField()  # Relacionado via tabela intermediária (ver abaixo)
    data_criacao = models.DateTimeField(auto_now_add=True)  # Timestamp automático
    ultimo_login = models.DateTimeField(null=True, blank=True)  # Último login
    status = models.CharField(max_length=20, default='Ativo')  # Status do usuário

    def __str__(self):
        return self.nome


class NiveisAcesso(models.Model):
    nivel_id = models.CharField(max_length=10, primary_key=True)  # Chave primária
    descricao = models.CharField(max_length=100)  # Descrição do nível de acesso

    def __str__(self):
        return self.descricao


class UsuarioNivelAcesso(models.Model):
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE)  # FK para usuários
    nivel_acesso = models.ForeignKey(NiveisAcesso, on_delete=models.CASCADE)  # FK para níveis de acesso

    class Meta:
        unique_together = (("usuario", "nivel_acesso"),)  # Chave composta

    def __str__(self):
        return f"{self.usuario.nome} - {self.nivel_acesso.descricao}"


class Log(models.Model):
    id = models.AutoField(primary_key=True)  # ID como chave primária
    id_usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE)  # FK para usuários
    descricao = models.TextField()  # Descrição do log
    data = models.DateTimeField()  # Data do log
    coluna_alterada = models.CharField(max_length=255, null=True, blank=True)  # Nome da coluna alterada
    valor_antigo = models.TextField(null=True, blank=True)  # Valor antigo
    valor_novo = models.TextField(null=True, blank=True)  # Valor novo

    def __str__(self):
        return f"Log {self.id} - Usuário {self.id_usuario}"


class RecuperacaoSenha(models.Model):
    id = models.AutoField(primary_key=True)  # ID como chave primária
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE)  # FK para usuários
    codigo_recuperacao = models.CharField(max_length=6)  # Código de recuperação
    data_pedido = models.DateTimeField()  # Data do pedido
    usado = models.BooleanField(default=False)  # Se o código foi usado

    def __str__(self):
        return f"Código {self.codigo_recuperacao} - Usuário {self.usuario.nome}"
