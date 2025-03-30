from django.db import models
from django.core.validators import MinValueValidator
from django.utils.translation import gettext_lazy as _


class Product(models.Model):
    """
    Modelo principal para productos (calzado y ropa).
    Contiene los atributos comunes a todos los productos.
    """
    
    class ProductType(models.TextChoices):
        """Tipos de productos disponibles en el sistema"""
        FOOTWEAR = 'FOOT', _('Calzado')
        CLOTHING = 'CLOT', _('Ropa')
    
    class Category(models.TextChoices):
        """Categorías principales de productos"""
        # Categorías para calzado
        SPORTS = 'SPORT', _('Deportivo')
        WORK = 'WORK', _('Utilitario')
        # Categorías para ropa
        TOPS = 'TOPS', _('Camisetas')
        BOTTOMS = 'BOT', _('Pantalones')
        OUTERWEAR = 'OUT', _('Abrigos')
    
    class Gender(models.TextChoices):
        """Géneros objetivo para los productos"""
        MALE = 'M', _('Hombre')
        FEMALE = 'F', _('Mujer')
        UNISEX = 'U', _('Unisex')
        KIDS = 'K', _('Niños')
    
    # Campos básicos
    name = models.CharField(
        max_length=100,
        verbose_name=_('Nombre del producto'),
        help_text=_('Nombre descriptivo del producto')
    )
    
    description = models.TextField(
        verbose_name=_('Descripción'),
        blank=True,
        help_text=_('Detalles técnicos y características')
    )
    
    product_type = models.CharField(
        max_length=4,
        choices=ProductType.choices,
        verbose_name=_('Tipo de producto'),
        help_text=_('Seleccione si es calzado o ropa')
    )
    
    category = models.CharField(
        max_length=5,
        choices=Category.choices,
        verbose_name=_('Categoría'),
        help_text=_('Categoría principal del producto')
    )
    
    gender = models.CharField(
        max_length=1,
        choices=Gender.choices,
        verbose_name=_('Género'),
        help_text=_('Público objetivo del producto')
    )
    
    base_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name=_('Precio base'),
        help_text=_('Precio en la moneda local')
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Fecha de creación')
    )
    
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('Activo'),
        help_text=_('Indica si el producto está disponible')
    )

    class Meta:
        verbose_name = _('Producto')
        verbose_name_plural = _('Productos')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['product_type', 'category']),
            models.Index(fields=['gender']),
        ]

    def __str__(self):
        return f"{self.name} ({self.get_product_type_display()})"
    
    class Variant(models.Model):
        """
        Modelo para variantes de productos (tallas, colores, etc.).
        Maneja las diferentes versiones de un mismo producto.
        """
    
    class SizeSystem(models.TextChoices):
        """Sistemas de tallas para diferentes tipos de productos"""
        # Para calzado
        EU = 'EU', _('Europeo')
        US = 'US', _('Americano')
        UK = 'UK', _('Británico')
        # Para ropa
        XS = 'XS', _('Extra Small')
        S = 'S', _('Small')
        M = 'M', _('Medium')
        L = 'L', _('Large')
        XL = 'XL', _('Extra Large')
    
    product = models.ForeignKey(
        "Product",
        related_name='variants',
        on_delete=models.CASCADE,
        verbose_name=_('Producto'),
        help_text=_('Producto al que pertenece esta variante')
    )
    
    size_system = models.CharField(
        max_length=2,
        choices=SizeSystem.choices,
        verbose_name=_('Sistema de tallas'),
        help_text=_('Sistema de medición para esta variante')
    )
    
    size = models.CharField(
        max_length=10,
        verbose_name=_('Talla'),
        help_text=_('Talla específica según el sistema seleccionado')
    )
    
    color = models.CharField(
        max_length=30,
        verbose_name=_('Color'),
        help_text=_('Color principal de la variante')
    )
    
    sku = models.CharField(
        max_length=50,
        unique=True,
        verbose_name=_('SKU'),
        help_text=_('Código único de inventario')
    )
    
    image_urls = models.JSONField(
        default=list,
        blank=True,
        verbose_name=_('Imágenes'),
        help_text=_('URLs de imágenes para esta variante específica')
    )

    class Meta:
        verbose_name = _('Variante')
        verbose_name_plural = _('Variantes')
        unique_together = ['product', 'size_system', 'size', 'color']
        ordering = ['product', 'size_system', 'size']

    def __str__(self):
        return f"{self.product.name} - {self.get_size_system_display()} {self.size} ({self.color})"