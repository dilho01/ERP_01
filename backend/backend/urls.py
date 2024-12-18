from django.urls import path, include
from django.contrib import admin
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
from config import views  # Import correto do módulo views de config

urlpatterns = [
    # JWT Authentication URLs
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('usuarios/', views.UsuarioCreateAPIView.as_view(), name='usuario-create'),

    # Config API URLs
    path("api/config/", include("config.urls")),
    path('logout/', views.logout, name='logout'),
    path('config-painel-admin/', admin.site.urls),
    
]

# Adicionar rotas para arquivos de mídia durante o desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
