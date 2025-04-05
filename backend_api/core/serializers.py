# users/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Product, Variant, Inventory
from rest_framework import serializers
from django.contrib.auth.models import Group, Permission
from .models import User  # Asegúrate de importar tu modelo User personalizado
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import generics, permissions, status

User = get_user_model()

class GroupSerializer(serializers.ModelSerializer):
    """Serializador para grupos de usuarios.
    Muestra solo información básica del grupo para evitar exponer datos sensibles.
    """
    class Meta:
        model = Group
        fields = ['id', 'name']

class PermissionSerializer(serializers.ModelSerializer):
    """Serializador para permisos de usuario.
    Incluye el código de nombre (codename) que se usa para verificar permisos programáticamente.
    """
    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename']

class UserSerializer(serializers.ModelSerializer):
    """Serializador principal para usuarios con todas las funcionalidades necesarias:
    - Registro de nuevos usuarios con validación de contraseña
    - Visualización segura de información de usuario
    - Manejo de grupos y permisos
    """
    groups = GroupSerializer(many=True, read_only=True)
    user_permissions = PermissionSerializer(many=True, read_only=True)
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        help_text="Contraseña del usuario (se almacenará hasheada)"
    )
    password_confirmation = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        help_text="Repita la misma contraseña para verificación"
    )

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
            'password',
            'password_confirmation',
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'date_joined': {'read_only': True},
        }

    def validate(self, data):
        """Validación personalizada que:
        1. Verifica que las contraseñas coincidan
        2. Elimina el campo de confirmación antes de guardar (no se almacena)
        3. Aplica otras validaciones estándar del modelo
        """
        # Verificar coincidencia de contraseñas
        if data['password'] != data['password_confirmation']:
            raise serializers.ValidationError(
                {'password_confirmation': "Las contraseñas no coinciden"}
            )
        
        # Eliminar campo de confirmación (no se guarda en la base de datos)
        data.pop('password_confirmation')
        
        return data

    def create(self, validated_data):
        """Crea un nuevo usuario asegurando que:
        1. La contraseña se hashea correctamente
        2. Se siguen todas las validaciones
        3. Se respeta el workflow estándar de Django
        """
        # Hashear la contraseña automáticamente
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Actualiza un usuario existente manejando correctamente:
        1. El hasheo de contraseña si se modifica
        2. La preservación de otros campos
        """
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)

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
    """
    Serializador para autenticar usuarios mediante email y contraseña.
    
    Campos requeridos:
    - email (validado como formato de correo electrónico)
    - password (texto plano, se hashea automáticamente al verificar)
    
    Flujo:
    1. Valida el formato del email.
    2. Autentica al usuario con las credenciales.
    3. Si falla, devuelve un error claro.
    """
    email = serializers.CharField(required=True)
    password = serializers.CharField(
        required=True,
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )

    def validate(self, attrs):
        """Valida las credenciales y devuelve el objeto User si son correctas."""
        email = attrs.get('email')
        password = attrs.get('password')

        # Validación básica del formato del email
        try:
            validate_email(email)
        except DjangoValidationError:
            raise serializers.ValidationError(
                {"email": "Formato de email inválido."},
                code='invalid_email'
            )
        print("Email recibido:", email)
        print("Password recibido:", password)  # ¡No lo hagas en producción!
        print("Usuario existe:", User.objects.filter(email=email).exists())
        
        # Autenticación con Django
        user = authenticate(
            request=self.context.get('request'),
            email=attrs.get('email'),
            password=attrs.get('password')
        )
        print("Usuario autenticado:", user)  # Agrega esto
        print("Usuario activo:", user.is_active if user else "No user")  # Y esto

        if not user:
            raise serializers.ValidationError(
                {"error": "Credenciales incorrectas. Verifica tu email y/o contraseña."},
                code='authentication_failed'
            )

        # Guardar el usuario en validated_data
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



# class UserCreateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = [
#             'username',
#             'password',
#             'email',
#             'first_name',
#             'last_name',
#             # Campos básicos para creación
#         ]
#         extra_kwargs = {
#             'password': {'write_only': True}
#         }

#     def create(self, validated_data):
#         user = User.objects.create_user(**validated_data)
# 