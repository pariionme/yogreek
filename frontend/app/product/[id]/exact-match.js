"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, Search, Check, Minus, Plus } from "lucide-react"

export default function ProductPage({ params }) {
  const router = useRouter()
  const productId = params.id

  const product = {
    id: productId,
    name: "Matcha Blueberry Greek yogurt",
    description:
      "กรีกโยเกิร์ตรสมัทฉะ + บลูเบอร์รี่ คุณภาพพรีเมี่ยม สีเขียวสดจากมัทฉะแท้ผสมผสานกับความหอมหวานของบลูเบอร์รี่ ทานง่ายอร่อยได้ประโยชน์ เหมาะสำหรับผู้รักสุขภาพที่ต้องการโปรตีนสูง",
    weight: "150 g",
    price: "180.00",
    image:
      "https://ceremonymatcha.com/cdn/shop/articles/Bildschirmfoto_2022-05-18_um_15.05.06.jpg?crop=center&height=600&v=1652879988&width=600",
    features: ["High protein Low fat", "Commercial grade", "Freshness delivery"],
  }

  const [quantity, setQuantity] = useState(1)

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const addToCart = () => {
    console.log(`Added ${quantity} ${product.name} to cart`)

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
      weight: product.weight,
    }

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")

    const existingItemIndex = existingCart.findIndex(item => item.id === product.id)

    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += quantity
    } else {
      existingCart.push(cartItem)
    }

    localStorage.setItem("cart", JSON.stringify(existingCart))
  }

  return (
    <main className="min-h-screen bg-[#FFFBF0]">
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

      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 max-w-md mx-auto">
            <div className="border-4 border-[#E8D0FF] rounded-3xl p-4 bg-white">
              <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-auto rounded-xl" />
            </div>
          </div>

          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold text-[#4A3728] mb-4">{product.name}</h1>

            <p className="text-gray-700 mb-4 text-sm">{product.description}</p>

            <div className="mb-6">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-center mb-1">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mb-2 text-gray-600 text-sm">{product.weight}</div>
            <div className="text-xl font-bold mb-6">{product.price} THB</div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                <button onClick={decreaseQuantity} className="px-3 py-1 bg-gray-100 hover:bg-gray-200">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4">{quantity}</span>
                <button onClick={increaseQuantity} className="px-3 py-1 bg-gray-100 hover:bg-gray-200">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={addToCart}
                className="px-6 py-2 bg-[#A0C0FF] hover:bg-[#80A0FF] text-white rounded-full transition-colors"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

