# users/views.py
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, UserLoginSerializer, UserSerializer, VariantSerializer, InventorySerializer, ProductSerializer
from .models import Product, Inventory, Variant
from django.contrib.auth import get_user_model
from rest_framework.decorators import action
from django.db import models 

# Obtenemos el modelo de usuario personalizado (o el default de Django)
User = get_user_model()
class RegisterAPIView(generics.CreateAPIView):
    """
    Endpoint para el registro de nuevos usuarios.

    Permite a un usuario registrarse en el sistema, creando una nueva cuenta
    y generando un token de autenticación para acceso inmediato.

    Flujo:
    1. Valida los datos del usuario (email, username, password, etc.).
    2. Crea el usuario en la base de datos.
    3. Genera (o obtiene) un token de autenticación asociado al usuario.
    4. Devuelve una respuesta con datos básicos del usuario y el token.

    Notas de seguridad:
    - Solo devuelve datos públicos del usuario (evita enviar información sensible).
    - Usa `AllowAny` porque cualquiera debe poder registrarse.
    - El password se maneja con hashing (lo hace Django internamente).

    Posibles mejoras futuras:
    - Implementar verificación por email.
    - Añadir rate limiting para evitar abuso.
    - Soporte para OAuth2/JWT en lugar de tokens simples.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        """
        Sobrescribe el método `perform_create` para personalizar la creación del usuario.
        
        Aquí se maneja:
        - La creación del usuario (save() del serializer).
        - La generación del token de autenticación.
        
        Separar esta lógica de `create` sigue las buenas prácticas de DRF.
        """
        user = serializer.save()  # Guarda el usuario (el serializer ya validó los datos)
        # Crea o obtiene un token para el nuevo usuario
        token, created = Token.objects.get_or_create(user=user)
        # Almacena el token en el objeto view para usarlo en la respuesta
        self.token = token

    def create(self, request, *args, **kwargs):
        """
        Maneja la lógica principal de creación y respuesta.

        1. Valida los datos con el serializer.
        2. Llama a `perform_create` para guardar el usuario y generar el token.
        3. Construye una respuesta con datos seguros del usuario + token.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # Valida los datos (400 si falla)
        self.perform_create(serializer)  # Llama a perform_create (crea usuario + token)

        # Serializa el usuario para la respuesta (podría ser un serializer diferente)
        user_data = UserSerializer(instance=serializer.instance).data

        return Response(
            {
                'user': user_data,
                'token': self.token.key,  # Token generado en perform_create
            },
            status=status.HTTP_201_CREATED,
        )
class LoginAPIView(generics.GenericAPIView):
    """
    Endpoint para autenticar usuarios y generar tokens.

    Método: POST
    Campos requeridos en el body:
    - email
    - password

    Respuestas:
    - 200 OK: Credenciales válidas → Devuelve usuario + token.
    - 400 Bad Request: Datos inválidos o credenciales incorrectas.
    """
    serializer_class = UserLoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        """
        Procesa el login:
        1. Valida los datos con UserLoginSerializer.
        2. Genera/recupera el token del usuario.
        3. Devuelve datos públicos del usuario + token.
        """
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)  # Lanza 400 si hay errores
        user = serializer.validated_data['user']  # Objeto User desde el serializer

        # Obtener o crear token (evita crear múltiples tokens por usuario)
        token, _ = Token.objects.get_or_create(user=user)
        print('token', token)

        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=status.HTTP_200_OK)
    
#VERSION SEGURA INTERFAZ DRF USA "SESIONES" PARA AUTENTICACION NO TOKEN
    
# class ProfileAPIView(generics.RetrieveUpdateAPIView):
#     serializer_class = UserSerializer
#     permission_classes = [permissions.IsAuthenticated]
    
#     def get_object(self):
#         return self.request.user


#VERSION PARA PRUEBAS NO USAR EN PRODUCCION
class ProfileAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = []  # Temporalmente sin autenticación
    
    def get_object(self):
        # Simula un usuario para pruebas (eliminar en producción)
        from django.contrib.auth import get_user_model
        return get_user_model().objects.first()  # Devuelve el primer usuario
    
class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet para el modelo Product.
    Permite todas las operaciones CRUD y endpoints adicionales.
    """
    queryset = Product.objects.prefetch_related('variants').all()
    
    def get_serializer_class(self):
        """Determina qué serializer usar según la acción"""
        if self.action in ['create', 'update', 'partial_update']:
            return ProductSerializer
        return ProductSerializer

    @action(detail=True, methods=['get'])
    def variants(self, request, pk=None):
        """Endpoint para obtener todas las variantes de un producto"""
        product = self.get_object()
        variants = product.variants.all()
        serializer = VariantSerializer(variants, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def inventory(self, request, pk=None):
        """Endpoint para obtener el inventario de todas las variantes de un producto"""
        product = self.get_object()
        inventory = Inventory.objects.filter(variant__product=product)
        serializer = InventorySerializer(inventory, many=True)
        return Response(serializer.data)

class VariantViewSet(viewsets.ModelViewSet):
    """
    ViewSet para el modelo Variant.
    Maneja operaciones CRUD para las variantes de productos.
    """
    queryset = Variant.objects.select_related('product', 'inventory').all()
    
    def get_serializer_class(self):
        """Determina qué serializer usar según la acción"""
        if self.action in ['create', 'update', 'partial_update']:
            return VariantSerializer
        return VariantSerializer

    @action(detail=True, methods=['get', 'put'])
    def stock(self, request, pk=None):
        """Endpoint especial para manejar el stock de una variante"""
        variant = self.get_object()
        
        if request.method == 'GET':
            serializer = InventorySerializer(variant.inventory)
            return Response(serializer.data)
            
        elif request.method == 'PUT':
            inventory = variant.inventory
            serializer = InventorySerializer(inventory, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

class InventoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet de solo lectura para el modelo Inventory.
    Permite consultar y filtrar inventario.
    """
    queryset = Inventory.objects.select_related('variant__product').all()
    serializer_class = InventorySerializer
    filterset_fields = ['stock_quantity', 'variant__product__category']
    
    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Endpoint especial para obtener items con stock bajo"""
        low_stock = self.get_queryset().filter(
            stock_quantity__lte=models.F('low_stock_threshold')
        )
        serializer = self.get_serializer(low_stock, many=True)
        return Response(serializer.data)