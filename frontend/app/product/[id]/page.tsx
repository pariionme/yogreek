"use client";
import { useCart } from '@/app/cart-provider';
import { productApi } from "@/services/api";
import { Product } from "@/types";
import { Check, Minus, Plus, Search, ShoppingBag, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id?.toString();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem, items } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (!productId) return;
        const data = await productApi.getProductById(productId);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError("Product not found");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!product) return;
      try {
        const all = await productApi.getAllProducts();
        const related = Array.isArray(all)
          ? all.filter((p: Product) => p.id !== product.id && p.category === product.category).slice(0, 3)
          : [];
        setRelatedProducts(related);
      } catch {}
    };
    fetchRelated();
  }, [product]);

  useEffect(() => {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  }, [items]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#FFFBF0] flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/all" className="bg-[#A0C0FF] hover:bg-[#80A0FF] text-white py-2 px-6 rounded-full">
          Browse Products
        </Link>
      </div>
    );
  }

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const addToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
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
          <Link href="/" className="text-[#7B3FE4] hover:underline flex items-center">
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
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>
      {/* Main product section */}
      <div className="container mx-auto py-8 px-4 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 flex justify-center items-center">
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            className="w-full max-w-md h-80 object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-[#4A3728] mb-4">{product.name}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <div className="mb-6">
            {/* Features if available */}
            {(product as any).features && Array.isArray((product as any).features) && (
              <>
                {((product as any).features as string[]).map((feature, index) => (
                  <div key={index} className="flex items-center mb-1">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="mb-2 text-gray-600">{(product as any).weight || ""}</div>
          <div className="text-xl font-bold mb-6">{product.price} THB</div>
          <div className="flex items-center gap-4 mb-6">
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
              className="px-6 py-2 bg-[#A0C0FF] hover:bg-[#80A0FF] text-white rounded-full transition-colors flex items-center"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add to cart
            </button>
          </div>
        </div>
      </div>
      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto py-8 px-4">
          <h2 className="text-xl font-bold mb-4">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <div key={rel.id} className="border-2 border-[#E8E0FF] rounded-lg p-4 bg-white">
                <Link href={`/product/${rel.id}`}>{rel.name}</Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
} 