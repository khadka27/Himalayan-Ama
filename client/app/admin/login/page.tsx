"use client"

import axiosInstance from "@/services/axios-instance"
import type React from "react"

import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"


export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/api/auth/login", {
        email,
        password
      });

      if (data.status) {
        Cookies.set("auth_token" , data.token, {expires: 30})
        toast.success(data.message || "Logged in")
        router.push("/admin/dashboard");
      } else {
        toast.info(data.message || "Error, please try again");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-cream via-sage-50 to-terracotta-100 flex items-center justify-center p-4 duration-200">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-sage-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-terracotta-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Login card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Logo/Branding */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl text-sage-900 mb-2">Himalayan Yogii</h1>
            {/* <p className="text-sage-600 text-sm">Admin Portal</p> */}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-sage-900 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@himalayanyogii.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-sage-200 bg-sage-50 text-sage-900 placeholder-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-sage-900 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-sage-200 bg-sage-50 text-sage-900 placeholder-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sage-600 duration-2000 hover:text-sage-900 transition"
                >
                  {/* {showPassword ? <EyeOff size={18} /> : <Eye size={18} />} */}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r mt-4 from-sage-600 to-sage-700 text-cream font-medium py-3 rounded-lg hover:from-sage-700 hover:to-sage-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-sage-200 text-center text-xs text-sage-600">
            <p>Protected Admin Area. Unauthorized access is prohibited.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
