from django.db import models
from django.core.validators import MinValueValidator

class Product(models.Model):
    """
    Modelo principal para productos de calzado.
    Relacionado con Variant a través de ForeignKey.
    """
    class CategoryChoices(models.TextChoices):
        DEPORTIVO = 'deportivo', 'Deportivo'
        UTILITARIO = 'utilitario', 'Utilitario'

    class GenderChoices(models.TextChoices):
        HOMBRE = 'hombre', 'Hombre'
        MUJER = 'mujer', 'Mujer'
        UNISEX = 'unisex', 'Unisex'
        NIÑO = 'niño', 'Niño'

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    category = models.CharField(
        max_length=20,
        choices=CategoryChoices.choices
    )
    gender = models.CharField(
        max_length=10,
        choices=GenderChoices.choices
    )
    base_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

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