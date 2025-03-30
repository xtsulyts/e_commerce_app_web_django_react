# users/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Product, Variant, Inventory
from rest_framework import serializers
from django.contrib.auth.models import Group, Permission
from .models import User  # Asegúrate de importar tu modelo User personalizado
from django.contrib.auth import get_user_model

User = get_user_model()

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename']

class UserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)
    user_permissions = PermissionSerializer(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'is_active',
            'is_staff',
            'is_superuser',
            'date_joined',
            'groups',
            'user_permissions',
            # Agrega aquí cualquier campo personalizado que tengas
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'date_joined': {'read_only': True},
        }

class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username',
            'password',
            'email',
            'first_name',
            'last_name',
            # Campos básicos para creación
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'email',
            'first_name',
            'last_name',
            'is_active',
            # Campos editables
        ]

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(
        required=True,
        help_text="Nombre de usuario o email"
    )
    password = serializers.CharField(
        required=True,
        style={'input_type': 'password'},
        trim_whitespace=False,
        help_text="Contraseña del usuario"
    )

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            # Permite login con username o email
            user = authenticate(
                request=self.context.get('request'),
                username=username,
                password=password
            )
            
            if not user:
                msg = _('No se puede acceder con las credenciales proporcionadas.')
                raise serializers.ValidationError(msg, code='authorization')
            
            if not user.is_active:
                msg = _('La cuenta está desactivada.')
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = _('Debe incluir "username" y "password".')
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs

class ProductSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(
        source='get_category_display', 
        read_only=True,
        help_text="Nombre legible de la categoría"
    )
    gender_display = serializers.CharField(
        source='get_gender_display',
        read_only=True,
        help_text="Nombre legible del género objetivo"
    )
    
    class Meta:
        model = Product
        fields = [
            'id', 
            'name', 
            'description',
            'category',
            'category_display',
            'gender',
            'gender_display',
            'base_price',
            'current_price',
            'created_at'
        ]
        read_only_fields = ['created_at', 'current_price']

class VariantSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source='product.name',
        read_only=True,
        help_text="Nombre del producto asociado"
    )
    
    class Meta:
        model = Variant
        fields = [
            'id',
            'product',
            'product_name',
            'size',
            'color',
            'sku'
        ]
        extra_kwargs = {
            'product': {'write_only': True}
        }

class InventorySerializer(serializers.ModelSerializer):
    variant_info = serializers.CharField(
        source='variant.__str__',
        read_only=True,
        help_text="Información de la variante"
    )
    
    class Meta:
        model = Inventory
        fields = [
            'id',
            'variant',
            'variant_info',
            'stock_quantity',
            'updated_at'
        ]
        read_only_fields = ['updated_at', 'variant_info']