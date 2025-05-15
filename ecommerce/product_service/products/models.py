from django.db import models

class Product(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    category = models.CharField(max_length=50)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.IntegerField(null=True, blank=True)
    updated_by = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.name
    
class Order(models.Model):
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    order_status = models.CharField(max_length=20)
    customer_id = models.IntegerField()  # อ้างอิง user_id จาก user_service
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=100, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=30, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    postcode = models.CharField(max_length=20, null=True, blank=True)
    
    def __str__(self):
        return f"Order {self.id} by user_id {self.customer_id}"

class ProductOrder(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} (Order {self.order.id})"

class Payment(models.Model):
    customer_id = models.IntegerField()  # อ้างอิง user_id จาก user_service
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    payment_method = models.CharField(max_length=30)
    paid_at = models.DateTimeField(null=True, blank=True)
    payment_status = models.CharField(max_length=20)

    def __str__(self):
        return f"Payment {self.id} for Order {self.order.id}"

class Shipping(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='shippings')
    shipping_method = models.CharField(max_length=50)
    shipped_at = models.DateTimeField(null=True, blank=True)
    shipping_status = models.CharField(max_length=20)
    shipping_address = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"Shipping {self.id} for Order {self.order.id}"