"use client"

import { useEffect, useState } from "react"
import { Plus, User as UserIcon, Shield, Mail, Calendar, Trash2, CheckCircle, XCircle } from "lucide-react"
import axiosInstance from "@/services/axios-instance"
import { toast } from "sonner"
import Loading from "../loading"
import Cookies from "js-cookie"
import Swal from "sweetalert2"

interface User {
  _id: string
  userName: string
  email: string
  role: string
  isActive: boolean
  approved: boolean
  createdAt: string
}

export function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ userName: "", email: "", password: "", role: "admin" })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const TOKEN = Cookies.get("auth_token")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const { data } = await axiosInstance.get("/api/v1/user", {
        headers: { Authorization: `Bearer ${TOKEN}` }
      })

      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddUser = async () => {
    if (!formData.email || !formData.userName || !formData.password) {
      toast.info("Please fill in all details");
      return;
    }
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post("/api/v1/user", formData, {
        headers: { Authorization: `Bearer ${TOKEN}` }
      })

      if (data.success) {
        toast.success(data.message || "User added");
        fetchUsers();
        setFormData({ userName: "", email: "", password: "", role: "admin" })
        setShowForm(false)
      } else {
        toast.error(data.message || "User not added");
      }
    } catch (err) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Remove User?",
      text: "This user will lose all access.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove",
      confirmButtonColor: "#EF4444",
    });

    if (!result.isConfirmed) return;

    try {
      setIsLoading(true);
      const { data } = await axiosInstance.delete(`/api/v1/user/${id}`, {
        headers: { Authorization: `Bearer ${TOKEN}` }
      })

      if (data.success) {
        toast.success("User removed")
        setUsers(users.filter(u => u._id !== id))
      }
    } catch (err) {
      toast.error("Failed to delete user")
    } finally {
      setIsLoading(false);
    }
  }

  const toggleStatus = async (user: User) => {
    try {
      setIsLoading(true);
      const newStatus = !user.isActive;
      const { data } = await axiosInstance.patch(`/api/v1/user/status`, {
        _id: user._id,
        isActive: newStatus,
      }, {
        headers: { Authorization: `Bearer ${TOKEN}` }
      })

      if (data.success) {
        toast.success("Status updated")
        setUsers(users.map((u) => u._id === user._id ? { ...u, isActive: newStatus } : u))
      }
    } catch (err) {
      toast.error("Status update failed")
    } finally {
      setIsLoading(false);
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {isLoading && <Loading color="rgba(0, 0, 0, 0.3)" />}

      <div className="flex justify-between items-center bg-white p-8 rounded-[40px] shadow-sm border border-slate-50">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Shield className="text-blue-500" />
            Team Management
          </h2>
          <p className="text-slate-400 font-medium text-sm mt-1">Control access and manage team roles.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-slate-900 hover:bg-black text-white font-bold h-12 px-6 rounded-2xl shadow-xl transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Invite User
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-[40px] border border-blue-100 p-10 shadow-2xl shadow-blue-50/50 animate-in fade-in slide-in-from-top-4 duration-500">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Send Team Invitation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 font-medium transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 font-medium transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Initial Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 font-medium transition-all"
              />
            </div>
            <div className="flex gap-3 h-14">
              <button
                onClick={handleAddUser}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl px-6 transition-all active:scale-95 shadow-lg shadow-blue-100"
              >
                Send Invite
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all font-bold"
              >
                <XCircle size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/30 border-b border-slate-50">
                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Team Member</th>
                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Role</th>
                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Join Date</th>
                <th className="px-10 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-10 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-sm font-bold text-blue-600 border border-blue-100 shadow-sm">
                        {user.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 capitalize">{user.userName}</p>
                        <p className="text-xs font-medium text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                      {user.role === 'super' ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-100 uppercase tracking-widest">
                          Super Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-widest">
                          Admin
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Calendar size={14} className="text-slate-300" />
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    {user.isActive ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest">Active</span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-slate-50 text-slate-400 border border-slate-100 uppercase tracking-widest">Paused</span>
                    )}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                      <button
                        onClick={() => toggleStatus(user)}
                        className={`h-10 w-10 flex items-center justify-center rounded-xl border transition-all ${user.isActive ? 'hover:bg-amber-50 border-amber-50 text-amber-500' : 'hover:bg-emerald-50 border-emerald-50 text-emerald-500'}`}
                      >
                        {user.isActive ? <XCircle size={18} /> : <CheckCircle size={18} />}
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="h-10 w-10 flex items-center justify-center rounded-xl border border-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="py-20 text-center">
              <UserIcon size={48} className="text-slate-100 mx-auto mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No team members found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}