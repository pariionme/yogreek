"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, ShoppingCart, Search } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState([])
  const [shippingMethod, setShippingMethod] = useState("delivery")
  const [paymentMethod, setPaymentMethod] = useState("card")

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
  }, [])

  const handleShippingChange = (method) => {
    setShippingMethod(method)
  }

  const handlePaymentChange = (method) => {
    setPaymentMethod(method)
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + parseFloat(item.price) * item.quantity
    }, 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const shippingCost = shippingMethod === "delivery" ? 80 : 0
    return subtotal + shippingCost
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert("Order placed successfully!")
    localStorage.removeItem("cart")
    router.push("/order-success")
  }

  return (
    <main className="min-h-screen bg-[#FFFBF0]">
      {/* Header */}
      <header className="container mx-auto p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center">
          <Link href="/" className="h-12 mr-4">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_7817.jpg-VZG4cretlG6LCUFlsdYLthGxid07NG.jpeg"
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

      {/* Navigation */}
      <nav className="bg-[#D8D0F0]">
        <div className="container mx-auto flex">
          <Link href="/" className="py-3 px-6 font-medium text-center flex-1">
            Home
          </Link>
          <Link href="/all" className="py-3 px-6 font-medium text-center flex-1">
            All product
          </Link>
          <Link href="/sweets" className="py-3 px-6 font-medium text-center flex-1">
            With fruits
          </Link>
        </div>
      </nav>

      {/* Checkout Content */}
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-black text-center mb-10">CHECKOUT</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer Details Section */}
          <div className="bg-[#C9D6F0] p-6 rounded-3xl border-4 border-[#FFECB3]">
            <h2 className="text-xl font-bold mb-4">Details</h2>

            <form className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block mb-1">First name</label>
                  <input type="text" id="firstName" className="w-full px-4 py-3 rounded-full bg-[#FFFDE0] border border-[#FFECB3]" required />
                </div>
                <div>
                  <label htmlFor="lastName" className="block mb-1">Last name</label>
                  <input type="text" id="lastName" className="w-full px-4 py-3 rounded-full bg-[#FFFDE0] border border-[#FFECB3]" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block mb-1">Phone</label>
                  <input type="tel" id="phone" className="w-full px-4 py-3 rounded-full bg-[#FFFDE0] border border-[#FFECB3]" required />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-1">Email Address</label>
                  <input type="email" id="email" className="w-full px-4 py-3 rounded-full bg-[#FFFDE0] border border-[#FFECB3]" required />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block mb-1">Address</label>
                <input type="text" id="address" className="w-full px-4 py-3 rounded-full bg-[#FFFDE0] border border-[#FFECB3]" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label htmlFor="city" className="block mb-1">City</label>
                  <div className="relative">
                    <select id="city" className="w-full px-4 py-3 rounded-full bg-[#FFFDE0] border border-[#FFECB3] appearance-none" required>
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
                  <label htmlFor="postcode" className="block mb-1">Post Code</label>
                  <input type="text" id="postcode" className="w-full px-4 py-3 rounded-full bg-[#FFFDE0] border border-[#FFECB3]" required />
                </div>
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

            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-lg overflow-hidden mr-3">
                      <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>{item.price} × {item.quantity}</div>
                  </div>
                  <div className="font-medium">฿ {(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-lg overflow-hidden mr-3">
                    <img
                      src="https://ceremonymatcha.com/cdn/shop/articles/Bildschirmfoto_2022-05-18_um_15.05.06.jpg?crop=center&height=600&v=1652879988&width=600"
                      alt="Matcha Blueberry Greek yogurt"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>150.00 × 2</div>
                </div>
                <div className="font-medium">฿ 300.00</div>
              </div>
            )}

            <div className="flex justify-between border-b border-gray-300 pb-2 mb-4">
              <div className="font-medium">SUBTOTAL</div>
              <div className="font-medium">฿ {cartItems.length > 0 ? calculateSubtotal().toFixed(2) : "300.00"}</div>
            </div>

            <div className="mb-6">
              <div className="font-medium mb-2">Shipping</div>
              <div className="flex items-center mb-2">
                <input type="radio" id="delivery" name="shipping" checked={shippingMethod === "delivery"} onChange={() => handleShippingChange("delivery")} className="mr-2" />
                <label htmlFor="delivery" className="flex justify-between w-full"><span>Delivery</span><span>฿ 80.00</span></label>
              </div>
              <div className="flex items-center">
                <input type="radio" id="pickup" name="shipping" checked={shippingMethod === "pickup"} onChange={() => handleShippingChange("pickup")} className="mr-2" />
                <label htmlFor="pickup">Pick up at the store</label>
              </div>
            </div>

            <div className="flex justify-between border-b border-gray-300 pb-2 mb-6">
              <div className="font-bold">Total</div>
              <div className="font-bold">
                ฿ {cartItems.length > 0 ? calculateTotal().toFixed(2) : shippingMethod === "delivery" ? "380.00" : "300.00"}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-2">
                <input type="radio" id="card" name="payment" checked={paymentMethod === "card"} onChange={() => handlePaymentChange("card")} className="mr-2" />
                <label htmlFor="card">Credit/Debit card</label>
              </div>
              <div className="flex items-center mb-2">
                <input type="radio" id="banking" name="payment" checked={paymentMethod === "banking"} onChange={() => handlePaymentChange("banking")} className="mr-2" />
                <label htmlFor="banking">Mobile Banking</label>
              </div>
              <div className="flex items-center">
                <input type="radio" id="promptpay" name="payment" checked={paymentMethod === "promptpay"} onChange={() => handlePaymentChange("promptpay")} className="mr-2" />
                <label htmlFor="promptpay">Promptpay</label>
              </div>
            </div>

            <div className="flex justify-center">
              <button onClick={handleSubmit} className="bg-[#333333] text-white px-6 py-3 rounded-full font-medium hover:bg-black transition-colors">
                Place order
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
