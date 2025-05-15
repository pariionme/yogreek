"use client"

import { orderApi } from '@/services/api'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useCart } from "../cart-provider"

type ShippingMethod = "delivery" | "pickup"
type PaymentMethod = "card" | "cash"

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

interface OrderResponse {
  id: string;
  // Add other response fields as needed
}

interface OrderRequest {
  items: {
    product_id: string;
    quantity: number;
    price: string;
  }[];
  shipping_address: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  };
  payment_method: PaymentMethod;
  shipping_method: ShippingMethod;
  total_amount: string;
}

export default function CheckoutPage() {
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("delivery")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });
  const { items, clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleShippingChange = (method: ShippingMethod) => {
    setShippingMethod(method)
  }

  const handlePaymentChange = (method: PaymentMethod) => {
    setPaymentMethod(method)
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + Number.parseFloat(item.price.toString()) * item.quantity,
    0
  );
  const shippingCost = shippingMethod === "delivery" ? 80 : 0;
  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all required fields");
      return;
    }

    if (shippingMethod === "delivery" && (!formData.address || !formData.city || !formData.zipCode)) {
      alert("Please fill in all shipping address details for delivery");
      return;
    }

    try {
      // Create order details object
      const orderDetails = {
        orderNumber: `ORD-${Date.now()}`,
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes from now
        shippingAddress: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address || "Pickup",
          city: formData.city || "Pickup",
          zipCode: formData.zipCode || "Pickup",
        },
        paymentMethod: paymentMethod,
        status: "processing",
        shipping: shippingMethod,
      };

      // Store order details in sessionStorage
      sessionStorage.setItem("orderDetails", JSON.stringify(orderDetails));
      
      // Store cart items in sessionStorage
      sessionStorage.setItem("orderCartItems", JSON.stringify(items));

      // Create order in the backend
      const orderData: OrderRequest = {
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price.toString()
        })),
        shipping_address: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode
        },
        payment_method: paymentMethod,
        shipping_method: shippingMethod,
        total_amount: total.toString()
      };

      console.log("Sending order data:", orderData);
      // เพิ่มการตรวจสอบฟิลด์ที่จำเป็น
      if (!orderData.items || orderData.items.length === 0) {
        throw new Error("Order must have at least one item");
      }

      if (!orderData.shipping_address || !orderData.shipping_address.name) {
        throw new Error("Shipping address is required");
      }

      if (!orderData.payment_method) {
        throw new Error(  "Payment method is required");
        }

      if (!orderData.shipping_method) {
        throw new Error("Shipping method is required");
      }

      if (!orderData.total_amount) {
        throw new Error("Total amount is required");
      }

      
      try {
        const response = await orderApi.createOrder(orderData);
        console.log("API Response:", response);
        
        if (response) {
          // ถ้ามี response แต่อาจจะเป็น empty object
          const orderId = response.id || `temp-${Date.now()}`; // ใช้ temporary ID ถ้าไม่มี id
        sessionStorage.setItem("orderId", orderId);

          // ถ้าเป็น empty object แต่ order สร้างสำเร็จ (status 201)
          // บันทึกข้อมูลอื่นๆ ที่จำเป็น
          const orderDetails = {
            id: orderId,
            status: "processing",
            // ข้อมูลอื่นๆ ตามที่ต้องการ
            items: orderData.items,
            shipping_address: orderData.shipping_address,
            payment_method: orderData.payment_method,
            shipping_method: orderData.shipping_method,
            total_amount: orderData.total_amount
  };
          sessionStorage.setItem("tempOrderDetails", JSON.stringify(orderDetails));

          // Clear cart
          clearCart();

          // Navigate to order status page
          window.location.href = `/order-status?orderId=${orderId}`;
        } else {
          throw new Error("No response received");
        }
      } catch (apiError) {
        console.error("Error creating order (API Error):", apiError);
        alert(apiError instanceof Error ? `Error: ${apiError.message}` : "There was an error processing your order. Please try again.");     
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert(error instanceof Error ? `Error: ${error.message}` : "There was an error processing your order. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FFFBF0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7B3FE4]"></div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#FFFBF0] flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="mb-6">Add some products to your cart before checking out.</p>
        <Link 
          href="/all" 
          className="bg-[#A0C0FF] hover:bg-[#80A0FF] text-white py-2 px-6 rounded-full"
        >
          Browse Products
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#FFFBF0] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="absolute top-6 left-6 text-[#7B3FE4] hover:underline flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to home
        </Link>

        <h1 className="text-4xl font-black text-center mb-10">CHECKOUT</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer Details Section */}
          <div className="bg-[#C9D6F0] p-6 rounded-3xl border-4 border-[#FFECB3]">
            <h2 className="text-xl font-bold mb-4">Details</h2>

            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div>
                  <label htmlFor="name" className="block mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-full bg-[#FFFDE0] border border-[#FFECB3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-full bg-[#FFFDE0] border border-[#FFECB3]"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-full bg-[#FFFDE0] border border-[#FFECB3]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required={shippingMethod === "delivery"}
                  disabled={shippingMethod === "pickup"}
                  className="w-full px-4 py-3 rounded-full bg-[#FFFDE0] border border-[#FFECB3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label htmlFor="city" className="block mb-1">
                    City
                  </label>
                  <div className="relative">
                    <select
                      id="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required={shippingMethod === "delivery"}
                      disabled={shippingMethod === "pickup"}
                      className="w-full px-4 py-3 rounded-full bg-[#FFFDE0] border border-[#FFECB3] appearance-none"
                    >
                      <option value="">Select a city</option>
                      <option value="bangkok">Bangkok</option>
                      <option value="chiangmai">Chiang Mai</option>
                      <option value="phuket">Phuket</option>
                      <option value="pattaya">Pattaya</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="zipCode" className="block mb-1">
                    Post Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required={shippingMethod === "delivery"}
                    disabled={shippingMethod === "pickup"}
                    className="w-full px-4 py-3 rounded-full bg-[#FFFDE0] border border-[#FFECB3]"
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-[#C3D4ED] border-2 border-[#FFF2BE] px-8 py-3 font-bold text-lg hover:bg-yellow-200 transition-colors"
                >
                  PLACE ORDER
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary Section */}
          <div className="bg-[#E8D0FF] p-6 rounded-3xl border-4 border-[#FFECB3]">
            <h2 className="text-xl font-bold mb-4">Your order</h2>

            <div className="flex justify-between border-b border-gray-300 pb-2 mb-4">
              <div className="font-medium">PRODUCT</div>
              <div className="font-medium">SUBTOTAL</div>
            </div>

            <div className="max-h-60 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-lg overflow-hidden mr-3">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div>{item.price.toString()} × {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-medium">฿ {(Number.parseFloat(item.price.toString()) * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-between border-b border-gray-300 pb-2 mb-4">
              <div className="font-medium">SUBTOTAL</div>
              <div className="font-medium">฿ {subtotal.toFixed(2)}</div>
            </div>

            <div className="mb-6">
              <div className="font-medium mb-2">Shipping</div>
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="delivery"
                  name="shipping"
                  checked={shippingMethod === "delivery"}
                  onChange={() => handleShippingChange("delivery")}
                  className="mr-2"
                />
                <label htmlFor="delivery" className="flex-1">
                  Delivery (฿ 80.00)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="pickup"
                  name="shipping"
                  checked={shippingMethod === "pickup"}
                  onChange={() => handleShippingChange("pickup")}
                  className="mr-2"
                />
                <label htmlFor="pickup" className="flex-1">
                  Pickup (Free)
                </label>
              </div>
            </div>

            <div className="mb-6">
              <div className="font-medium mb-2">Payment Method</div>
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="card"
                  name="payment"
                  checked={paymentMethod === "card"}
                  onChange={() => handlePaymentChange("card")}
                  className="mr-2"
                />
                <label htmlFor="card" className="flex-1">
                  Credit Card
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="cash"
                  name="payment"
                  checked={paymentMethod === "cash"}
                  onChange={() => handlePaymentChange("cash")}
                  className="mr-2"
                />
                <label htmlFor="cash" className="flex-1">
                  Cash on Delivery
                </label>
              </div>
            </div>

            <div className="flex justify-between py-4 font-bold text-lg">
              <span>TOTAL</span>
              <span>฿ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 