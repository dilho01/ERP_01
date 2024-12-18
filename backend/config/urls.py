from django.urls import path
from .views import LoginAPIView, RedefinirSenhaAPIView, SolicitarRecuperacaoSenhaAPIView, SystemConfigView, RemoveConfigView, UsuarioCreateAPIView, ValidarCodigoRecuperacaoAPIView
from . import views

urlpatterns = [
    path("system-config/", SystemConfigView.as_view(), name="system-config"),
    path("system-config/remove", RemoveConfigView.as_view(), name="remove-config"),
    path('dashboard/', views.dashboard_administrador, name='dashboard_administrador'),
    path('usuarios/create/', UsuarioCreateAPIView.as_view(), name='usuario-create'),  # Altere para evitar conflito com a rota /usuarios/
    path('login/', LoginAPIView.as_view(), name='login'),
    path("recuperar-senha/", SolicitarRecuperacaoSenhaAPIView.as_view(), name="recuperar-senha"),
    path("validar-codigo/", ValidarCodigoRecuperacaoAPIView.as_view(), name="validar-codigo"),
    path("redefinir-senha/", RedefinirSenhaAPIView.as_view(), name="redefinir-senha"),
    
    path("usuarios/", views.listar_usuarios, name="listar_usuarios"),  # Essa será usada para listar os usuários
    path("niveis_acesso/", views.listar_niveis_acesso, name="listar_niveis_acesso"),
    path("usuarios/<int:usuario_id>/permissoes/", views.permissoes_usuario, name="permissoes_usuario"),
    path("usuarios/<int:usuario_id>/salvar/", views.salvar_permissoes, name="salvar_permissoes"),
]
