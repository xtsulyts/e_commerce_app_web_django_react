# users/views.py
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, UserLoginSerializer, UserSerializer, VariantSerializer, InventorySerializer, ProductSerializer
from .models import Product, Inventory, Variant
from rest_framework.decorators import action

class RegisterAPIView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Crear token de autenticación
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)

class LoginAPIView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': UserProfileSerializer(user).data,
            'token': token.key
        })

class ProfileAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
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