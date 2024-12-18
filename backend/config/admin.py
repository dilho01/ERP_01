from django.contrib import admin
from .models import SystemConfig
from .models import Usuarios, NiveisAcesso, UsuarioNivelAcesso, Log, RecuperacaoSenha


@admin.register(Usuarios)
class UsuariosAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'email', 'nivel_acesso', 'data_criacao', 'ultimo_login', 'status')
    list_filter = ('status', 'nivel_acesso')
    search_fields = ('nome', 'email')
    ordering = ('-data_criacao',)


@admin.register(NiveisAcesso)
class NiveisAcessoAdmin(admin.ModelAdmin):
    list_display = ('nivel_id', 'descricao')
    search_fields = ('descricao',)


@admin.register(UsuarioNivelAcesso)
class UsuarioNivelAcessoAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'nivel_acesso')
    search_fields = ('usuario__nome', 'nivel_acesso__descricao')


@admin.register(Log)
class LogAdmin(admin.ModelAdmin):
    list_display = ('id', 'id_usuario', 'descricao', 'data', 'coluna_alterada')
    list_filter = ('data',)
    search_fields = ('descricao', 'id_usuario__nome', 'coluna_alterada')


@admin.register(RecuperacaoSenha)
class RecuperacaoSenhaAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'codigo_recuperacao', 'data_pedido', 'usado')
    list_filter = ('usado',)
    search_fields = ('usuario__nome', 'codigo_recuperacao')


admin.site.register(SystemConfig)
