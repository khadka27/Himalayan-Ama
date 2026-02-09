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
      const { data } = await axiosInstance.post("/api/v1/auth/login", {
        email,
        password
      });

      if (data.success || data.status) {
        if (data.token) {
          Cookies.set("auth_token", data.token, { expires: 30 })
        }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-200 flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-slate-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      {/* Login card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/50">
          {/* Logo/Branding */}
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl md:text-4xl text-slate-900 mb-2 font-bold tracking-tight">Himalayan Ama</h1>
            <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Admin Portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-slate-500">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@himalayanama.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                required
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-slate-500">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  <span className="text-xs font-bold uppercase">Show</span>
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-widest"
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
