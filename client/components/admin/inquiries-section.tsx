"use client"

import { useEffect, useState } from "react"
import { Trash2, Mail } from "lucide-react"
import axiosInstance from "@/services/axios-instance"
import Loading from "../loading"
import Cookies from "js-cookie"


interface Inquiry {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  created_at: string
}

export function Inquiries() {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const TOKEN = Cookies.get("auth_token")


  useEffect(() => {
    setIsLoading(true);
    const getInquiries = async () => {
      const { data } = await axiosInstance.get("/api/inquiries", {
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        }
      });
      if (data.status) {
        setInquiries(data.data)
      }
      setIsLoading(false);
    }
    getInquiries();
  }, [])

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
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-bold text-sage-900">User Inquiries</h2>
        </div>

        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="bg-white rounded-lg border border-sage-200 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-sage-900">{inquiry.name}</h3>
                  <p className="text-sm text-sage-600">{inquiry.email}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium`}>
                  {formatDate(inquiry.created_at)}
                </span>
              </div>

              <p className="text-sage-700 mb-4">{inquiry.message}</p>

              <div className="flex justify-between items-center pt-4 border-t border-sage-200">
                <p className="text-sm text-sage-600">{inquiry.phone}</p>
                <div className="flex gap-3">
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="inline-flex items-center gap-2 bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition text-sm"
                    title={`Reply to ${inquiry.email}`}
                  >
                    <Mail size={16} />
                    Reply
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
