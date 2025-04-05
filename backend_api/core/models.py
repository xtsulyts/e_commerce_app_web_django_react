from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator

class User(AbstractUser):

    # ... tus campos personalizados ...
    # Configuración clave para autenticación por email
     # Agrega unique=True al campo email
    email = models.EmailField(unique=True, verbose_name='email address')
    USERNAME_FIELD = 'email'  # Usar email como identificador principal
    REQUIRED_FIELDS = ['username']  # Mantener username como campo requerido pero no para login

    
    class Meta:
        # Esta línea es crucial para evitar conflictos
        db_table = 'core_user'  # Nombre personalizado para la tabla
        # Asegurar que el email sea único
        # constraints = [
        #     models.UniqueConstraint(fields=['email'], name='unique_email')
        # ]

    # Agrega estos related_name únicos
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name="core_user_groups",  # Nombre único
        related_query_name="core_user",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="core_user_permissions",  # Nombre único
        related_query_name="core_user",
    )

class Product(models.Model):
    """
    Modelo que representa un producto de calzado en el sistema ecommerce.
    
    Atributos:
        name (CharField): Nombre del producto (max 100 caracteres)
        description (TextField): Descripción detallada (opcional)
        category (CharField): Categoría del calzado (choices: DEPORTIVO, UTILITARIO)
        gender (CharField): Género objetivo (choices: HOMBRE, MUJER, UNISEX, NIÑO)
        base_price (DecimalField): Precio base (validado para ser ≥ 0)
        created_at (DateTimeField): Fecha de creación (auto-generada)
    
    Relaciones:
        variants (ForeignKey): Relación uno-a-muchos con el modelo Variant
    """
    
    class CategoryChoices(models.TextChoices):
        """Opciones predefinidas para categorías de calzado"""
        DEPORTIVO = 'deportivo', 'Calzado Deportivo'
        UTILITARIO = 'utilitario', 'Calzado Utilitario'
    
    class GenderChoices(models.TextChoices):
        """Opciones predefinidas para género objetivo"""
        HOMBRE = 'hombre', 'Hombre'
        MUJER = 'mujer', 'Mujer'
        UNISEX = 'unisex', 'Unisex'
        NIÑO = 'niño', 'Niño'

    # Campos básicos
    name = models.CharField(
        max_length=100,
        verbose_name="Nombre del Producto",
        help_text="Nombre comercial del artículo (ej: 'Zapato Running XYZ')"
    )
    
    description = models.TextField(
        blank=True,
        verbose_name="Descripción",
        help_text="Detalles técnicos y características del producto"
    )
    
    category = models.CharField(
        max_length=20,
        choices=CategoryChoices.choices,
        verbose_name="Categoría",
        help_text="Tipo de calzado según su uso principal"
    )
    
    gender = models.CharField(
        max_length=10,
        choices=GenderChoices.choices,
        verbose_name="Género",
        help_text="Público objetivo del producto"
    )
    
    base_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name="Precio Base",
        help_text="Precio en la moneda local (debe ser ≥ 0)"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de Creación"
    )

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"
        ordering = ['-created_at', 'name']
        indexes = [
            models.Index(fields=['name'], name='product_name_idx'),
            models.Index(fields=['category', 'gender'], name='product_category_gender_idx'),
        ]

    def __str__(self):
        """Representación legible del producto"""
        return f"{self.name} ({self.get_category_display()})"

    @property
    def current_price(self):
        """Precio actual considerando descuentos (para futura implementación)"""
        return self.base_price
class Variant(models.Model):
    """
    Modelo para variantes de productos (tallas/colores).
    Relación uno-a-muchos con Product.
    """
    product = models.ForeignKey(
        Product,
        related_name='variants',
        on_delete=models.CASCADE
    )
    size = models.CharField(max_length=10)
    color = models.CharField(max_length=30)
    sku = models.CharField(max_length=50, unique=True)

    class Meta:
        unique_together = ['product', 'size', 'color']

    def __str__(self):
        return f"{self.product.name} - {self.size}/{self.color}"

class Inventory(models.Model):
    """
    Modelo para gestión de inventario.
    Relación uno-a-uno con Variant.
    """
    stock_quantity = models.IntegerField()
    low_stock_threshold = models.IntegerField(default=10)
    variant = models.OneToOneField(
        Variant,
        related_name='inventory',
        on_delete=models.CASCADE
    )
    stock_quantity = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)]
    )
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Inventory for {self.variant}"