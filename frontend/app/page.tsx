"use client"
import { productApi } from "@/services/api";
import { Product } from "@/types";
import { Check, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./cart-provider";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const { addItem, items } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('Fetching products...');
        const data = await productApi.getAllProducts() as Product[];
        // Only show best selling products
        const bestSellingNames = [
          'Peanut butter Greek yogurt',
          'Strawberry Greek yogurt',
          'Matcha Blueberry Greek yogurt',
          'Biscoff Greek yogurt',
        ];
        const bestSelling = data.filter(p => bestSellingNames.includes(p.name));
        console.log('Products fetched successfully:', bestSelling);
        setProducts(bestSelling);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        if (err instanceof Error) {
          setError(`Failed to load products: ${err.message}`);
        } else {
          setError('Failed to load products. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image_url || "/placeholder.svg"
    });
    setShowCartNotification(true);
    setTimeout(() => setShowCartNotification(false), 1500);
  };

  return (
    <main className="min-h-screen bg-[#FFFBF0]">
      {/* Cart notification */}
      {showCartNotification && (
        <div className="fixed top-4 right-4 bg-green-100 text-green-800 p-4 rounded-lg shadow-lg z-50 flex items-center">
          <Check className="w-5 h-5 mr-2" />
          Product added to cart!
        </div>
      )}
      {/* Header */}
      <header className="container mx-auto p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-12 mr-4">
            <img src="/logo.png" alt="YO! GREEK Logo" className="h-full object-contain" />
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
          <Link href="/register" className="text-[#C3D4ED] font-medium underline">
            Register
          </Link>
          <Link href="/cart" className="text-[#D8B0FF] relative">
            <ShoppingCart className="w-6 h-6" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {items.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-[#D8D0F0]">
        <div className="container mx-auto flex">
          <Link href="/" className="py-3 px-6 font-medium text-center flex-1 border-b-2 border-black">
            Home
          </Link>
          <Link href="/all" className="py-3 px-6 font-medium text-center flex-1">
            All product
          </Link>
          <Link href="/fruits" className="py-3 px-6 font-medium text-center flex-1">
            With fruits
          </Link>
          <Link href="/sweets" className="py-3 px-6 font-medium text-center flex-1">
            Sweets
          </Link>
        </div>
      </nav>

      {/* Hero Image */}
      <div className="w-full">
        <img
          src="https://backend.paleorobbie.com/static/db/plr/files/grass%20fed%20Greek%20yogurt%20Thailand,egE6z7lA6XA=.jpg"
          alt="Yogurt with berries"
          className="w-full h-64 object-cover"
        />
      </div>

      {/* Best Selling Section */}
      <section className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="bg-[#E8E0FF] px-6 py-2 rounded-full">
            <h2 className="text-xl font-bold">Best Selling</h2>
          </div>
          <Link href="/all" className="text-[#9370DB] flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-1"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7B3FE4]"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border-2 border-[#E8E0FF] rounded-lg p-4 bg-white">
                <Link href={`/product/${product.id}`}>
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                  />
                </Link>
                <h3 className="font-medium text-lg">{product.name}</h3>
                <div className="text-sm text-gray-600 mb-1">{(product as any).weight || ""}</div>
                <div className="font-bold mb-3">{product.price} THB</div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-[#A0C0FF] hover:bg-[#80A0FF] text-white py-2 px-4 rounded-full transition-colors"
                >
                  Add to cart
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
} 