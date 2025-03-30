from django.contrib import admin
from django.utils.html import format_html
from .models import Product, Variant, Inventory

class VariantInline(admin.TabularInline):
    """Configuración inline para Variants en Product"""
    model = Variant
    extra = 1  # Número de forms vacíos para añadir
    fields = ('size', 'color', 'sku')
    show_change_link = True

class InventoryInline(admin.StackedInline):
    """Configuración inline para Inventory en Variant"""
    model = Inventory
    extra = 0
    fields = ('stock_quantity', 'updated_at')
    readonly_fields = ('updated_at',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Configuración del admin para Product"""
    list_display = ('name', 'category_display', 'gender_display', 'base_price', 'created_at')
    list_filter = ('category', 'gender', 'created_at')
    search_fields = ('name', 'description')
    #prepopulated_fields = {'slug': ('name',)}  # Si añades un campo slug
    inlines = [VariantInline]
    fieldsets = (
        (None, {
            'fields': ('name', 'description')
        }),
        ('Precio y Categorización', {
            'fields': ('base_price', 'category', 'gender')
        }),
    )

    def category_display(self, obj):
        return obj.get_category_display()
    category_display.short_description = 'Categoría'

    def gender_display(self, obj):
        return obj.get_gender_display()
    gender_display.short_description = 'Género'

@admin.register(Variant)
class VariantAdmin(admin.ModelAdmin):
    """Configuración del admin para Variant"""
    list_display = ('product_name', 'size', 'color', 'sku', 'inventory_status')
    list_filter = ('product__category', 'size', 'color')
    search_fields = ('product__name', 'sku')
    inlines = [InventoryInline]

    def product_name(self, obj):
        return obj.product.name
    product_name.short_description = 'Producto'
    product_name.admin_order_field = 'product__name'

    def inventory_status(self, obj):
        if hasattr(obj, 'inventory'):
            stock = obj.inventory.stock_quantity
            color = 'green' if stock > 10 else 'orange' if stock > 0 else 'red'
            return format_html(
                '<span style="color: {};">{} unidades</span>',
                color,
                stock
            )
        return "Sin inventario"
    inventory_status.short_description = 'Stock'

@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    """Configuración del admin para Inventory"""
    list_display = ('variant_info', 'stock_quantity', 'updated_at', 'stock_status')
    list_filter = ('stock_quantity', 'updated_at')
    readonly_fields = ('updated_at',)

    def variant_info(self, obj):
        return f"{obj.variant.product.name} - {obj.variant.size}/{obj.variant.color}"
    variant_info.short_description = 'Variante'

    def stock_status(self, obj):
        if obj.stock_quantity == 0:
            return format_html('<span style="color: red;">AGOTADO</span>')
        elif obj.stock_quantity < 5:
            return format_html('<span style="color: orange;">BAJO STOCK</span>')
        return format_html('<span style="color: green;">DISPONIBLE</span>')
    stock_status.short_description = 'Estado'