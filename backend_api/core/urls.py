from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.documentation import include_docs_urls
#from rest_framework.schemas import get_schema_vie
from .views import (
    RegisterAPIView,
    LoginAPIView,
    ProfileAPIView,
    ProductViewSet,
    VariantViewSet,
    InventoryViewSet,
    
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'variants', VariantViewSet, basename='variant')
router.register(r'inventory', InventoryViewSet, basename='inventory')

urlpatterns = [
    path('api/', include(router.urls)),
    # Tus otras URLs personalizadas aquí (ej: usuarios)
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('profile/', ProfileAPIView.as_view(), name='profile'),
    path('docs/', include_docs_urls(title='E-commerce Shop API')),
    # path('docs/', include_docs_urls(
    #     title='Documentación API',
    #     public=True,
    #     schema_url='/'
    # )),
    
    #Schema CoreJSON (opcional)
    #path('schema/', get_schema_view),
]