from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductListView, ProductDetailView, ProductCategoryView, ProductViewSet, OrderViewSet, ProductOrderViewSet, health_check

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'product-orders', ProductOrderViewSet, basename='productorder')

urlpatterns = [
    path('', include(router.urls)),
    path('products/list/', ProductListView.as_view(), name='product_list'),
    path('products/<str:product_id>/', ProductDetailView.as_view(), name='product_detail'),
    path('products/categories/', ProductCategoryView.as_view(), name='product_categories'),
    path('health/', health_check, name='health_check'),
]