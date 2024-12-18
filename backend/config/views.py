from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from .models import NiveisAcesso, SystemConfig, Usuarios, RecuperacaoSenha,NiveisAcesso, UsuarioNivelAcesso
from django.shortcuts import render, redirect,get_object_or_404
from django.contrib.auth.hashers import check_password
from django.contrib import messages
from django.http import HttpResponse, JsonResponse
from .models import Usuarios
from .serializers import UsuarioSerializer  # Criaremos abaixo
from rest_framework import status
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from django.utils.timezone import now
from django.core.mail import send_mail
import random
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods





def example_view(request):
    return HttpResponse("Configuração carregada corretamente.")

class SystemConfigView(APIView):
    parser_classes = [MultiPartParser]

    def get(self, request):
        # Retornar as configurações existentes
        config = SystemConfig.objects.first()
        if not config:
            return Response({"error": "Configurações não encontradas."}, status=404)
        return Response({
            "logo": request.build_absolute_uri(config.logo.url) if config.logo else None,
            "background_image": request.build_absolute_uri(config.background_image.url) if config.background_image else None,
            "favicon": request.build_absolute_uri(config.favicon.url) if config.favicon else None,
        })

    def post(self, request):
        # Atualizar ou criar as configurações
        config, _ = SystemConfig.objects.get_or_create()

        if "logo" in request.FILES:
            config.logo = request.FILES["logo"]
        if "background_image" in request.FILES:
            config.background_image = request.FILES["background_image"]
        if "favicon" in request.FILES:
            config.favicon = request.FILES["favicon"]

        config.save()

        return Response({
            "success": True,
            "logo": request.build_absolute_uri(config.logo.url) if config.logo else None,
            "background_image": request.build_absolute_uri(config.background_image.url) if config.background_image else None,
            "favicon": request.build_absolute_uri(config.favicon.url) if config.favicon else None,
        })
class RemoveConfigView(APIView):
    def delete(self, request):
        field = request.data.get("field")
        if not field:
            return Response({"error": "Campo não especificado."}, status=400)

        config = SystemConfig.objects.first()
        if not config:
            return Response({"error": "Nenhuma configuração encontrada."}, status=404)

        if hasattr(config, field):
            setattr(config, field, None)  # Remove o valor do campo
            config.save()
            return Response({"success": True, "message": f"{field} removido com sucesso!"})

        return Response({"error": "Campo inválido."}, status=400)
    
    
        return render(request, 'login.html')
    
    
    
def dashboard_administrador(request):
    if 'usuario_id' not in request.session:
        return redirect('login')  # Redireciona para a página de login se não estiver autenticado

 
    return render(request, 'login.html')
def logout(request):
    request.session.flush()
    return redirect('login')

class UsuarioCreateAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Usuário cadastrado com sucesso!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LoginAPIView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')  # Certifique-se de que o campo é 'email'
        senha = request.data.get('senha')  # Certifique-se de que o campo é 'senha'

        if not email or not senha:
            return Response({"error": "Email e senha são obrigatórios."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            usuario = Usuarios.objects.get(email=email)
            if check_password(senha, usuario.senha):
                if usuario.status != "Ativo":
                    return Response({"error": "Usuário inativo. Entre em contato com o administrador."}, status=status.HTTP_403_FORBIDDEN)

                # Gerar tokens JWT
                from rest_framework_simplejwt.tokens import RefreshToken
                refresh = RefreshToken.for_user(usuario)

                return Response({
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "message": "Login bem-sucedido!",
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Senha incorreta."}, status=status.HTTP_401_UNAUTHORIZED)
        except Usuarios.DoesNotExist:
            return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)


class SolicitarRecuperacaoSenhaAPIView(APIView):
    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"error": "Email é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            usuario = Usuarios.objects.get(email=email)

            # Gera um código aleatório de 6 dígitos
            codigo = f"{random.randint(100000, 999999)}"

            # Salva o código na tabela de recuperação
            RecuperacaoSenha.objects.create(
                usuario=usuario,
                codigo_recuperacao=codigo,
                data_pedido=now()
            )

            # Envia o código por e-mail
            send_mail(
                "Recuperação de Senha",
                f"Seu código de recuperação é: {codigo}. Ele é válido por 2 minutos.",
                "noreply@seusistema.com",  # Email do remetente
                [email],  # Email do destinatário
            )

            return Response({"message": "Código de recuperação enviado para o e-mail."})
        except Usuarios.DoesNotExist:
            return Response({"error": "Usuário não encontrado com este e-mail."}, status=status.HTTP_404_NOT_FOUND)
        
        
class ValidarCodigoRecuperacaoAPIView(APIView):
    def post(self, request):
        email = request.data.get("email")
        codigo = request.data.get("codigo")

        if not email or not codigo:
            return Response({"error": "Email e código são obrigatórios."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            usuario = Usuarios.objects.get(email=email)
            recuperacao = RecuperacaoSenha.objects.filter(
                usuario=usuario,
                codigo_recuperacao=codigo,
                usado=False,
                data_pedido__gte=now() - timedelta(minutes=2)
            ).first()

            if not recuperacao:
                return Response({"error": "Código inválido ou expirado."}, status=status.HTTP_400_BAD_REQUEST)

            # Código validado, agora pode redefinir a senha
            return Response({"message": "Código validado. Prossiga para redefinir a senha."})
        except Usuarios.DoesNotExist:
            return Response({"error": "Usuário não encontrado com este e-mail."}, status=status.HTTP_404_NOT_FOUND)
        
class RedefinirSenhaAPIView(APIView):
    def post(self, request):
        email = request.data.get("email")
        codigo = request.data.get("codigo")
        nova_senha = request.data.get("nova_senha")

        # Verifica se todos os campos estão presentes
        if not email or not codigo or not nova_senha:
            return Response({"error": "Email, código e nova senha são obrigatórios."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Buscar o usuário
            usuario = Usuarios.objects.get(email=email)

            # Verificar o código de recuperação
            recuperacao = RecuperacaoSenha.objects.filter(
                usuario=usuario,
                codigo_recuperacao=codigo,
                usado=False,  # O código não deve ter sido usado
                data_pedido__gte=now() - timedelta(minutes=2)  # Código deve estar dentro do prazo de 2 minutos
            ).first()

            if not recuperacao:
                return Response({"error": "Código inválido ou expirado."}, status=status.HTTP_400_BAD_REQUEST)

            # Atualizar a senha do usuário
            usuario.senha = make_password(nova_senha)
            usuario.save()

            # Marcar o código como usado
            recuperacao.usado = True
            recuperacao.save()

            return Response({"message": "Senha redefinida com sucesso."})
        except Usuarios.DoesNotExist:
            return Response({"error": "Usuário não encontrado com este e-mail."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Erro interno: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# ========================
# Listar Níveis de Acesso
# ========================
def listar_niveis_acesso(request):
    niveis = NiveisAcesso.objects.all().values('nivel_id', 'descricao')
    return JsonResponse(list(niveis), safe=False)



# ========================
# Gerenciamento de Permissões
# ========================

@csrf_exempt  # Para desativar CSRF (apenas em desenvolvimento)
@require_http_methods(["GET"])  # Garante que apenas GET é permitido
def listar_usuarios(request):
    usuarios = Usuarios.objects.all().values('id', 'nome', 'email', 'status')
    return JsonResponse(list(usuarios), safe=False)

def permissoes_usuario(request, usuario_id):
    usuario = get_object_or_404(Usuarios, id=usuario_id)
    todos_niveis = NiveisAcesso.objects.all()
    niveis_usuario = UsuarioNivelAcesso.objects.filter(usuario=usuario).values_list('nivel_acesso_id', flat=True)

    response = {
        "usuario": {"id": usuario.id, "nome": usuario.nome},
        "todos_niveis": [{"id": n.nivel_id, "descricao": n.descricao} for n in todos_niveis],
        "niveis_usuario": list(niveis_usuario),
    }
    return JsonResponse(response)

def salvar_permissoes(request, usuario_id):
    if request.method == "POST":
        usuario = get_object_or_404(Usuarios, id=usuario_id)
        try:
            niveis_selecionados = request.POST.getlist('niveis_acesso') or request.data.get('niveis_acesso', [])

            # Remove permissões antigas
            UsuarioNivelAcesso.objects.filter(usuario=usuario).delete()

            # Adiciona permissões novas
            for nivel_id in niveis_selecionados:
                nivel = get_object_or_404(NiveisAcesso, nivel_id=nivel_id)
                UsuarioNivelAcesso.objects.create(usuario=usuario, nivel_acesso=nivel)

            return JsonResponse({"status": "success", "message": "Permissões atualizadas com sucesso"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)