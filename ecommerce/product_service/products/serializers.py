from rest_framework import serializers
from .models import Product, Order, ProductOrder, Payment, Shipping

class ProductSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock', 'category', 'image', 'image_url', 'created_at', 'updated_at', 'created_by', 'updated_by']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by', 'updated_by']

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class ProductListSerializer(serializers.Serializer):
    products = ProductSerializer(many=True)

class ProductOrderSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source='product', write_only=True)

    class Meta:
        model = ProductOrder
        fields = ['id', 'product', 'product_id', 'quantity', 'unit_price']

class OrderSerializer(serializers.ModelSerializer):
    product_orders = ProductOrderSerializer(source='productorder_set', many=True, read_only=True)
    shipping_address = serializers.SerializerMethodField()
    shipping_method = serializers.SerializerMethodField()
    payment_method = serializers.SerializerMethodField()
    name = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField()
    city = serializers.CharField()
    postcode = serializers.CharField()

    order_number = serializers.CharField(source='id')
    order_date = serializers.DateTimeField(source='created_at')
    estimated_delivery = serializers.SerializerMethodField()
    items = ProductOrderSerializer(source='productorder_set', many=True, read_only=True)
    status = serializers.CharField(source='order_status')
    total_amount = serializers.CharField(source='total_price')

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'order_date', 'estimated_delivery',
            'shipping_address', 'shipping_method', 'payment_method',
            'name', 'email', 'phone', 'city', 'postcode',
            'status', 'total_amount', 'items',
            
            'total_price', 'order_status', 'customer_id', 'created_at', 'product_orders'
        ]
        read_only_fields = ['id', 'created_at', 'product_orders', 'items']

    def get_shipping_address(self, obj):
        shipping = obj.shippings.first()
        return shipping.shipping_address if shipping else None

    def get_shipping_method(self, obj):
        shipping = obj.shippings.first()
        return shipping.shipping_method if shipping else None

    def get_payment_method(self, obj):
        payment = obj.payments.first()
        return payment.payment_method if payment else None

    def get_estimated_delivery(self, obj):
        # คำนวณเวลาที่คาดว่าจะจัดส่ง (เช่น 30 นาทีหลังจากสร้าง order)
        if obj.created_at:
            import datetime
            return (obj.created_at + datetime.timedelta(minutes=30)).isoformat()
        return None

class OrderCreateSerializer(serializers.Serializer):
    items = serializers.ListField(child=serializers.DictField(), write_only=True)
    shipping_address = serializers.DictField(write_only=True)
    payment_method = serializers.CharField(write_only=True)
    shipping_method = serializers.CharField(write_only=True)
    total_amount = serializers.CharField(write_only=True)

    def create(self, validated_data):
        items = validated_data.pop('items')
        shipping_address = validated_data.pop('shipping_address')
        payment_method = validated_data.pop('payment_method')
        shipping_method = validated_data.pop('shipping_method')
        total_amount = validated_data.pop('total_amount')

        customer_id = 1
        order = Order.objects.create(
            total_price=total_amount,
            order_status='pending',
            customer_id=customer_id,
            name=shipping_address.get('name'),
            email=shipping_address.get('email'),
            phone=shipping_address.get('phone'),
            city=shipping_address.get('city'),
            postcode=shipping_address.get('zipCode'),
        )
        for item in items:
            ProductOrder.objects.create(
                order=order,
                product_id=item['product_id'],
                quantity=item['quantity'],
                unit_price=item.get('price', 0)
            )
        Payment.objects.create(
            customer_id=customer_id,
            order=order,
            payment_method=payment_method,
            payment_status='pending',
        )
        Shipping.objects.create(
            order=order,
            shipping_method=shipping_method,
            shipping_status='pending',
            shipping_address=shipping_address.get('address', ''),
        )
        order.refresh_from_db()
        return order