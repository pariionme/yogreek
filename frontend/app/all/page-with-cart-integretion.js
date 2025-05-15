"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, Search } from "lucide-react"

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} weight
 * @property {string} price
 * @property {string} image
 */

/**
 * @typedef {Product & { quantity: number }} CartItem
 */

export default function AllProductsPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState([])

  /** @param {Product} product */
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === product.id)

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += 1
        return updatedItems
      } else {
        return [...prevItems, { ...product, quantity: 1 }]
      }
    })
  }

  return (
    <main className="min-h-screen bg-[#FFFBF0]">
      <header className="container mx-auto p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-12 mr-4">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_7817.jpg-VZG4cretlG6LCUFlsdYLthGxid07NG.jpeg"
              alt="YO! GREEK Logo"
              className="h-full object-contain"
            />
          </div>
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
          <Link href="/cart" className="text-[#D8B0FF] relative">
            <ShoppingCart className="w-6 h-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#7B3FE4] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </Link>
        </div>
      </header>

      <nav className="bg-[#D8D0F0]">
        <div className="container mx-auto flex">
          <Link href="/" className="py-3 px-6 font-medium text-center flex-1">
            Home
          </Link>
          <Link href="/all" className="py-3 px-6 font-medium text-center flex-1 border-b-2 border-black">
            All product
          </Link>
          <Link href="/sweets" className="py-3 px-6 font-medium text-center flex-1">
            With fruits
          </Link>
        </div>
      </nav>

      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">All Products</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allProducts.map((product) => (
            <div key={product.id} className="border-2 border-[#E8E0FF] rounded-lg p-4 bg-white">
              <div className="mb-3">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <h3 className="font-medium text-lg">{product.name}</h3>
              <div className="text-sm text-gray-600 mb-1">{product.weight}</div>
              <div className="font-bold mb-3">{product.price} THB</div>
              <button
                onClick={() => addToCart(product)}
                className="w-full bg-[#A0C0FF] hover:bg-[#80A0FF] text-white py-2 px-4 rounded-full transition-colors"
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

const allProducts = [
  {
    id: 1,
    name: "Chocolate Greek yogurt",
    weight: "100 g",
    price: "120.00",
    image: "https://www.daisybeet.com/wp-content/uploads/2024/01/Homemade-Greek-Yogurt-13.jpg",
  },
  {
    id: 2,
    name: "Strawberry Cheesecake Greek yogurt",
    weight: "130 g",
    price: "130.00",
    image: "https://www.walderwellness.com/wp-content/uploads/2022/02/Peanut-Butter-Greek-Yogurt-Walder-Wellness-2.jpg",
  },
  {
    id: 3,
    name: "Banana Greek yogurt",
    weight: "160 g",
    price: "120.00",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8qQ5nykmhb0UVn23P7ScZUT_5Vm3mDxpm1Q&s",
  },
  {
    id: 4,
    name: "Matcha Blueberry Greek yogurt",
    weight: "150 g",
    price: "180.00",
    image:
      "https://ceremonymatcha.com/cdn/shop/articles/Bildschirmfoto_2022-05-18_um_15.05.06.jpg?crop=center&height=600&v=1652879988&width=600",
  },
  {
    id: 5,
    name: "Mango Greek yogurt",
    weight: "130 g",
    price: "130.00",
    image: "https://placeholder.svg?height=200&width=200",
  },
  {
    id: 6,
    name: "Blueberry Greek yogurt",
    weight: "120 g",
    price: "150.00",
    image: "https://placeholder.svg?height=200&width=200",
  },
  {
    id: 7,
    name: "Apple Cinnamon Greek yogurt",
    weight: "150 g",
    price: "140.00",
    image: "https://placeholder.svg?height=200&width=200",
  },
  {
    id: 8,
    name: "Biscoff Greek yogurt",
    weight: "130 g",
    price: "130.00",
    image: "https://placeholder.svg?height=200&width=200",
  },
]

