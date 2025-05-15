"use client"

import { orderApi } from '@/services/api'
import { Search, ShoppingCart } from 'lucide-react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { productApi } from '@/services/api'

interface OrderItem {
  product_id: string;
  quantity: number;
  price: string;
  product?: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    description?: string;
    category?: string;
  };
}

type OrderStatus = "processing" | "preparing" | "ready" | "delivered";

interface OrderDetails {
  id: string;
  order_number: string;
  order_date: string;
  estimated_delivery: string;
  shipping_address: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  };
  payment_method: string;
  status: OrderStatus;
  shipping_method: string;
  items: OrderItem[];
  total_amount: string;
}

interface OrderApiResponse {
  id: string;
  order_number: string;
  order_date: string;
  created_at: string;
  estimated_delivery: string;
  shipping_address: string | undefined;
  payment_method: string;
  shipping_method: string;
  status: OrderStatus;
  total_amount: string;
  items: OrderItem[];
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  postcode?: string;
}

export default function OrderStatusPage() {
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("processing")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if window is defined (to avoid SSR issues)
        if (typeof window === 'undefined') {
          return; // ไม่ทำงานถ้ากำลังรันบน server
        }

        // รับ orderId จาก URL parameters ก่อน
        const searchParams = new URLSearchParams(window.location.search);
        const orderIdFromUrl = searchParams.get('orderId');
  
        // Get order ID from sessionStorage
        const orderId = orderIdFromUrl || sessionStorage.getItem("orderId");
        console.log("Using order ID:", orderId, "from", orderIdFromUrl ? "URL" : "sessionStorage");

        if (!orderId) {
          setError("No order ID found. Please place an order first.")
          setIsLoading(false)
          return
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        // Fetch order details from API
        const response = await orderApi.getOrderById(orderId)
        const orderData = response as unknown as OrderApiResponse
        console.log("Raw API Response:", response);
        console.log("Order Data:", orderData);
        console.log("Order Items:", orderData.items);

        if (!orderData || !orderData.items) {
          setError("Failed to fetch order details")
          setIsLoading(false)
          return
        }

        // Fetch product details for each item
        const itemsWithProducts = await Promise.all(
          orderData.items.map(async (item) => {
            try {
              console.log("Fetching product details for ID:", item.product_id);
              const product = await productApi.getProductById(item.product_id);
              console.log("Product details received:", product);
              return {
                ...item,
                product: {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image_url: product.image_url || "/placeholder.svg",
                  description: product.description,
                  category: product.category
                }
              };
            } catch (error) {
              console.error(`Error fetching product ${item.product_id}:`, error);
              return {
                ...item,
                product: {
                  id: `Product #${item.product_id}`,
                  name: `Product #${item.product_id}`,
                  price: 0,
                  image_url: "/placeholder.svg",
                  description: "",
                  category: ""
                }
              };
            }
          })
        );

        console.log("Items with products:", itemsWithProducts);

        // Map shipping_address object จาก field ต่างๆ ของ orderData
        const completeOrderDetails: OrderDetails = {
          id: orderData.id,
          order_number: orderData.order_number ?? "",
          order_date: new Date(orderData.created_at).toLocaleString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }),
          estimated_delivery: new Date(orderData.estimated_delivery).toLocaleString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          shipping_address: {
            name: orderData.name ?? "",
            email: orderData.email ?? "",
            phone: orderData.phone ?? "",
            address: orderData.shipping_address ?? "",
            city: orderData.city ?? "",
            zipCode: orderData.postcode ?? ""
          },
          payment_method: orderData.payment_method ?? "",
          status: orderData.status ?? "processing",
          shipping_method: orderData.shipping_method ?? "",
          items: itemsWithProducts,
          total_amount: orderData.total_amount ?? ""
        }

        console.log("Complete order details:", completeOrderDetails);
        setOrderDetails(completeOrderDetails)
        setOrderStatus(orderData.status)
      } catch (error) {
        console.error("Error fetching order details:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch order details")
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrderDetails()
  }, [router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "preparing":
        return "bg-yellow-100 text-yellow-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "delivered":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FFFBF0]">
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7B3FE4]"></div>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#FFFBF0]">
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="mb-8 text-red-600">{error}</p>
            <Link
              href="/"
              className="bg-[#A0C0FF] hover:bg-[#80A0FF] text-white py-3 px-6 rounded-full inline-block"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (!orderDetails) {
    return (
      <main className="min-h-screen bg-[#FFFBF0]">
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">No Order Found</h1>
            <p className="mb-8">We couldn't find your order details.</p>
            <Link
              href="/"
              className="bg-[#A0C0FF] hover:bg-[#80A0FF] text-white py-3 px-6 rounded-full inline-block"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#FFFBF0]">
      {/* Header */}
      <header className="container mx-auto p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center">
          <Link href="/" className="h-12 mr-4">
            <img
              src="/logo.png"
              alt="YO! GREEK Logo"
              className="h-full object-contain"
            />
          </Link>
        </div>

        <div className="relative flex-1 max-w-xl mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products ..."
              className="w-full py-2 pl-10 pr-4 bg-[#FFFDE0] rounded-full border border-[#FFECB3] focus:outline-none"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="text-[#7B3FE4] font-medium underline">
            Login
          </Link>
          <Link href="/cart" className="text-[#D8B0FF]">
            <ShoppingCart className="w-6 h-6" />
          </Link>
        </div>
      </header>

      {/* Order Content */}
      <div className="container mx-auto py-8 px-4">
        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-8 text-center">
          <h2 className="text-xl font-bold">Thank you for your order!</h2>
          <p>We've received your order and are processing it now.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Status Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Order Status</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-8">
                  <div className="relative flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#7B3FE4] flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Order Placed</p>
                      <p className="text-sm text-gray-500">{orderDetails.order_date}</p>
                    </div>
                  </div>
                  <div className="relative flex items-start">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${orderStatus === "preparing" ? "bg-[#7B3FE4]" : "bg-gray-200"} flex items-center justify-center`}>
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Preparing Your Order</p>
                      <p className="text-sm text-gray-500">Your items are being prepared</p>
                    </div>
                  </div>
                  <div className="relative flex items-start">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${orderStatus === "ready" ? "bg-[#7B3FE4]" : "bg-gray-200"} flex items-center justify-center`}>
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Ready for {orderDetails.shipping_method === "delivery" ? "Delivery" : "Pickup"}</p>
                      <p className="text-sm text-gray-500">Your order is ready</p>
                    </div>
                  </div>
                  <div className="relative flex items-start">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${orderStatus === "delivered" ? "bg-[#7B3FE4]" : "bg-gray-200"} flex items-center justify-center`}>
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Delivered</p>
                      <p className="text-sm text-gray-500">Order completed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4">Order Items</h3>
              <div className="space-y-4">
                {orderDetails.items && orderDetails.items.length > 0 ? (
                  orderDetails.items.map((item) => (
                    <div key={item.product_id} className="flex items-center gap-4 border-b border-gray-100 pb-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        {item.product?.image_url ? (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">
                          {item.product?.name || `Product #${item.product_id}`}
                        </h4>
                        {item.product?.description && (
                          <p className="text-sm text-gray-600 mt-1">{item.product.description}</p>
                        )}
                        <div className="mt-2 text-sm text-gray-600">
                          <p>Quantity: {item.quantity}</p>
                          <p>Price per item: {Number(item.price).toFixed(2)} THB</p>
                        </div>
                        <p className="text-[#7B3FE4] font-medium mt-2">
                          Total: {(Number(item.price) * item.quantity).toFixed(2)} THB
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(orderStatus)}`}>
                        {orderStatus}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No items found in this order
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Order Number</span>
                  <span className="font-medium">{orderDetails.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order Date</span>
                  <span className="font-medium">{orderDetails.order_date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="font-medium">{orderDetails.estimated_delivery || 'Not available'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Method</span>
                  <span className="font-medium capitalize">{orderDetails.shipping_method}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span className="font-medium capitalize">{orderDetails.payment_method}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total Amount</span>
                    <span>{orderDetails.total_amount} THB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-xl font-bold mb-4">Shipping Address</h3>
              <div className="space-y-2">
                <p>{orderDetails.shipping_address?.name || "-"}</p>
                <p>{orderDetails.shipping_address?.address || "-"}</p>
                <p>{orderDetails.shipping_address?.city || "-"}</p>
                <p>{orderDetails.shipping_address?.zipCode || "-"}</p>
                <p>Phone: {orderDetails.shipping_address?.phone || "-"}</p>
                <p>Email: {orderDetails.shipping_address?.email || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 
