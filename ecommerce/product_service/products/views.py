from django.shortcuts import render
import requests
import datetime
# Create your views here.
from rest_framework import status, viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from .models import Product, Order, ProductOrder
from .serializers import ProductSerializer, ProductListSerializer, OrderSerializer, OrderCreateSerializer, ProductOrderSerializer

USER_SERVICE_URL = "http://user_service:8000/users/"

class IsAdminUser:
    def has_permission(self, request, view):
        return request.user and request.user.is_admin

class ProductListView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        # Filter products based on query parameters
        category = request.query_params.get('category', None)
        
        if category:
            products = Product.objects.filter(category=category).order_by('id')
        else:
            products = Product.objects.all().order_by('id')
        
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        # Only admin can create products
        if not request.user.is_admin:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        data = request.data.copy()
        data['created_by'] = request.user.id
        data['updated_by'] = request.user.id
        serializer = ProductSerializer(data=data)
        if serializer.is_valid():
            product = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductDetailView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, product_id):
        try:
            product = Product.objects.get(id=product_id)
            serializer = ProductSerializer(product)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, product_id):
        # Only admin can update products
        if not request.user.is_admin:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            product = Product.objects.get(id=product_id)
            data = request.data.copy()
            data['updated_by'] = request.user.id
            serializer = ProductSerializer(product, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, product_id):
        # Only admin can delete products
        if not request.user.is_admin:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            product = Product.objects.get(id=product_id)
            product.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

class ProductCategoryView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        # Get all unique categories
        categories = Product.objects.distinct('category')
        return Response({'categories': categories}, status=status.HTTP_200_OK)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('id')
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=False, methods=['get'])
    def active(self, request):
        products = Product.objects.filter(is_active=True).order_by('id')
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    permission_classes = [permissions.AllowAny]
    print("DEBUG: OrderViewSet loaded, permission_classes =", permission_classes)

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        # Integration Example: ดึงข้อมูลลูกค้าจาก user_service ด้วย customer_id
        customer_id = data.get('customer_id')
        if customer_id:
            try:
                resp = requests.get(f"{USER_SERVICE_URL}{customer_id}/")
                if resp.status_code == 200:
                    data['customer_info'] = resp.json() # ได้ข้อมูลลูกค้าจาก user_service
                else:
                    data['customer_info'] = None
            except Exception:
                data['customer_info'] = None
        return Response(data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        # สำคัญ: ใช้ OrderSerializer สำหรับ response แทนที่จะใช้ serializer เดียวกันกับที่ใช้ในการสร้าง
        response_serializer = OrderSerializer(order)
        headers = self.get_success_headers(serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class ProductOrderViewSet(viewsets.ModelViewSet):
    queryset = ProductOrder.objects.all()
    serializer_class = ProductOrderSerializer
    permission_classes = [permissions.AllowAny]

@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint for monitoring service status
    """
    return Response(
        {"status": "healthy"},
        status=status.HTTP_200_OK
    )
