"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import axiosInstance from "@/services/axios-instance"
import { toast } from "sonner"
import Loading from "../loading"
import Cookies from "js-cookie"

interface User {
  id: string
  name: string
  email: string
  created_at: string
  status: "active" | "inactive"
}

export function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "" })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const TOKEN = Cookies.get("auth_token")

  useEffect(() => {
    setIsLoading(true)
    const getUsers = async () => {
      const { data } = await axiosInstance.get("/api/users/admins", {
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      })
      setIsLoading(false)

      if (data.status) {
        setUsers(data.data);
      }
    }

    getUsers()
  }, [])

  const handleAddUser = async () => {
    if (!formData.email || !formData.name) toast.info("Fill in all details");
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post("/api/users/admin", {
        name: formData.name,
        email: formData.email,
      }, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      })

      if (data.status) {
        toast.success(data.message || "User added");
        const newUser: User = {
          id: Date.now().toString(),
          ...formData,
          created_at: new Date().toISOString().split("T")[0],
          status: "active",
        }
        setUsers([...users, newUser])
        setFormData({ name: "", email: "" })
        setShowForm(false)
      } else {
        toast.info(data.message || "User not added");
      }
    } catch (err) {
      const Err = err as Error;
      toast.error(Err.message)
    } finally {
      setIsLoading(false);
    }
  }

  const changeStatus = async (userId: string) => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post(`/api/users/${userId}/status`, {
        name: formData.name,
        email: formData.email,
      }, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      })

      if (data.status) {
        toast.success(data.message || "Status updated")
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
          ),
        )
      } else {
        toast.info(data.message || "Status not updated")
      }
    } catch (err) {
      const Err = err as Error;
      toast.error(Err.message)
    } finally {
      setIsLoading(false);
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <>
      {isLoading && <Loading color="rgba(0, 0, 0, 0.3)" />}

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-sage-900">Users Management</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition"
          >
            <Plus size={20} />
            Add User
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg border border-sage-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-600"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddUser}
                className="bg-sage-600 text-white px-6 py-2 rounded-lg hover:bg-sage-700 transition"
              >
                Add User
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-sage-200 text-sage-900 px-6 py-2 rounded-lg hover:bg-sage-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg border border-sage-200 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-sage-50 border-b border-sage-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Join Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-sage-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id} className={idx % 2 === 0 ? "bg-white" : "bg-sage-50"}>
                  <td className="px-6 py-4 text-sm font-medium text-sage-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-sage-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-sage-600">{formatDate(user.created_at)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${user.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {user.status === "active" ? "✓ Active" : "○ Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2 items-center">
                    {/* Professional Toggle Switch */}
                    <div className="relative inline-block w-11 h-6">
                      <input
                        type="checkbox"
                        checked={user.status === "active"}
                        onChange={() => changeStatus(user.id)}
                        className="sr-only peer"
                        id={`toggle-user-${user.id}`}
                      />
                      <label
                        htmlFor={`toggle-user-${user.id}`}
                        className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${user.status === "active" ? 'bg-sage-600' : 'bg-gray-300'}`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 bg-white rounded-full w-5 h-5 transition-all duration-300 shadow-sm transform ${user.status === "active" ? 'translate-x-5' : ''}`}
                        />
                      </label>
                    </div>
                    
                    <span className="text-xs text-sage-600 font-medium ml-2">
                      {user.status === "active" ? 'ON' : 'OFF'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}