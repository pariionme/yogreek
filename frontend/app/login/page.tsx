"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Basic validation
    if (!username || !password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    // In a real application, you would make an API call to authenticate
    // For now, we'll simulate a login with a timeout
    setTimeout(() => {
      // Demo login - in a real app, you would check credentials with your backend
      if (username === "demo" && password === "password") {
        // Store user info in localStorage or use a proper auth solution
        localStorage.setItem("user", JSON.stringify({ username }))
        router.push("/")
      } else {
        setError("Invalid username or password")
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center">
      <div className="relative w-full max-w-md p-8">
        {/* Improved pixel border effect */}
        <div className="absolute inset-0 bg-[#FFFDE0] border-4 border-[#FFD1DC] rounded-xl shadow-xl">
          <div className="absolute top-0 left-0 w-3 h-3 bg-[#FFFBF0] rounded-tl-xl"></div>
          <div className="absolute top-0 right-0 w-3 h-3 bg-[#FFFBF0] rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 bg-[#FFFBF0] rounded-bl-xl"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#FFFBF0] rounded-br-xl"></div>

          <div className="absolute top-0 left-3 right-3 h-3 bg-[#FFFBF0]"></div>
          <div className="absolute bottom-0 left-3 right-3 h-3 bg-[#FFFBF0]"></div>
          <div className="absolute left-0 top-3 bottom-3 w-3 bg-[#FFFBF0]"></div>
          <div className="absolute right-0 top-3 bottom-3 w-3 bg-[#FFFBF0]"></div>
        </div>

        {/* Login form container */}
        <div className="relative bg-[#FFFDE0] rounded-lg p-8 flex flex-col items-center">
          {/* Login splash image */}
          <div className="w-40 h-40 mb-6 relative flex items-center justify-center">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Login-O9M4SgWzifMHtugjSV89maZjlQ2Xd5.png"
              alt="Log In"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {error && (
            <div className="w-full mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-center">
              {error}
            </div>
          )}

          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-bold uppercase">
                USERNAME
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your username"
                className="w-full px-4 py-2 rounded-md bg-[#C8D6FF] text-gray-700 placeholder-gray-500"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-bold uppercase">
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="123yogurt456"
                className="w-full px-4 py-2 rounded-md bg-[#C8D6FF] text-gray-700 placeholder-gray-500"
                autoComplete="current-password"
              />
            </div>

            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-8 py-2 bg-[#C8B6FF] hover:bg-[#B8A6FF] rounded-full font-bold text-[#4A2B13] transition-colors ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "LOGGING IN..." : "LOG IN"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Back to home link */}
      <Link href="/" className="absolute top-6 left-6 text-[#7B3FE4] hover:underline flex items-center">
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
  )
} 