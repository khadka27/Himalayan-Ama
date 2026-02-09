"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Lock, Check } from "lucide-react"
import { toast } from "sonner"
import axiosInstance from "@/services/axios-instance"
import Cookies from "js-cookie"

export function SettingsSection() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const TOKEN = Cookies.get("auth_token")

  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  })

  const updatePasswordStrength = (password: string) => {
    setPasswordStrength({
      hasLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    })
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.info("Please fill in all fields")
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }

    try {
      setIsLoading(true)
      const { data } = await axiosInstance.post(
        "/api/users/change-password",
        {
          current_password: formData.currentPassword,
          new_password: formData.newPassword,
        },
        { 
          headers: {
            'Authorization': `Bearer ${TOKEN}`
          } 
        },
      )

      if (data.status) {
        toast.success(data.message || "Password changed successfully")
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        setPasswordStrength({
          hasLength: false,
          hasUpperCase: false,
          hasLowerCase: false,
          hasNumber: false,
        })
      } else {
        toast.error(data.message || "Failed to change password")
      }
    } catch (err) {
      toast.error((err as Error).message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const allStrengthRequirements = Object.values(passwordStrength).every((req) => req)

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-2xl">
        {/* Centered card with shadow and proper spacing */}
        <div className="bg-gradient-to-br from-white to-sage-50 rounded-xl border border-sage-200 p-8 shadow-lg">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-sage-200">
            <div className="w-12 h-12 bg-gradient-to-br from-sage-500 to-sage-600 rounded-lg flex items-center justify-center">
              <Lock size={24} className="text-white" />
            </div>
            <div>
              {/* Removed duplicate title - only showing the form title */}
              <h3 className="text-xl font-semibold text-sage-900">Change Password</h3>
              <p className="text-sm text-sage-600">Update your password to keep your account secure</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-sage-900 mb-3">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  placeholder="Enter your current password"
                  className="w-full px-4 py-3 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent pr-12 transition bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-600 hover:text-sage-700 transition"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-sage-900 mb-3">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, newPassword: e.target.value })
                    updatePasswordStrength(e.target.value)
                  }}
                  placeholder="Enter your new password"
                  className="w-full px-4 py-3 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent pr-12 transition bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-600 hover:text-sage-700 transition"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {formData.newPassword && (
                <div className="mt-4 p-4 bg-sage-50 rounded-lg border border-sage-200">
                  <p className="text-xs font-semibold text-sage-700 mb-3">Password Requirements:</p>
                  <div className="space-y-2">
                    {[
                      { key: "hasLength", label: "At least 8 characters" },
                      { key: "hasUpperCase", label: "One uppercase letter" },
                      { key: "hasLowerCase", label: "One lowercase letter" },
                      { key: "hasNumber", label: "One number" },
                    ].map((req) => (
                      <div key={req.key} className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded border ${
                            passwordStrength[req.key as keyof typeof passwordStrength]
                              ? "bg-emerald-500 border-emerald-500"
                              : "border-sage-300 bg-white"
                          } flex items-center justify-center transition`}
                        >
                          {passwordStrength[req.key as keyof typeof passwordStrength] && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>
                        <span
                          className={`text-xs ${
                            passwordStrength[req.key as keyof typeof passwordStrength]
                              ? "text-emerald-700 font-medium"
                              : "text-sage-600"
                          }`}
                        >
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-sage-900 mb-3">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your new password"
                  className="w-full px-4 py-3 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent pr-12 transition bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-600 hover:text-sage-700 transition"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {formData.confirmPassword && (
                <div className="mt-2">
                  {formData.newPassword === formData.confirmPassword ? (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <Check size={16} />
                      <span className="text-xs font-medium">Passwords match</span>
                    </div>
                  ) : (
                    <div className="text-xs text-red-600">Passwords do not match</div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || !allStrengthRequirements || formData.newPassword !== formData.confirmPassword}
                className="w-full bg-gradient-to-r from-sage-600 to-sage-700 text-white py-3 rounded-lg hover:from-sage-700 hover:to-sage-800 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Change Password
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Security Tip:</strong> Use a strong password that combines uppercase, lowercase, numbers, and
              special characters. Never share your password with anyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}