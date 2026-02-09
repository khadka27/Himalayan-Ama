"use client"

import { useState, useEffect } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Interface for dashboard data
interface MonthlyRevenue {
  month: number;
  total_revenue: number;
}

interface DashboardData {
  status: boolean;
  data: {
    total_blogs: number;
    total_services: number;
    total_inquiries: number;
    total_bookings: number;
    monthly_revenue: MonthlyRevenue[];
    positive_reviews: number;
    negative_reviews: number;
  }
}

import Cookies from 'js-cookie';

// ... (imports)

// ... (interfaces)

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND?.trim();
        const token = Cookies.get("auth_token");

        const response = await fetch(`${backendUrl}/api/v1/stats`, {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true"
          }
        });

        const result = await response.json();
        setDashboardData(result);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sage-50">
        <div className="text-sage-600 text-xl font-serif">Loading Dashboard...</div>
      </div>
    );
  }

  // Prepare data for charts
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const revenueData = {
    labels: monthNames,
    datasets: [
      {
        label: 'Monthly Revenue (₹)',
        data: dashboardData.data.monthly_revenue.map(item => item.total_revenue),
        backgroundColor: 'rgba(143, 188, 143, 0.2)',
        borderColor: 'rgba(143, 188, 143, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Revenue',
        font: {
          family: 'serif',
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function (value: any) {
            return '₹' + value;
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      }
    }
  };

  const activityData = {
    labels: ['Blogs', 'Services', 'Inquiries', 'Bookings'],
    datasets: [
      {
        label: 'Count',
        data: [
          dashboardData.data.total_blogs,
          dashboardData.data.total_services,
          dashboardData.data.total_inquiries,
          dashboardData.data.total_bookings
        ],
        backgroundColor: [
          'rgba(143, 188, 143, 0.8)',
          'rgba(205, 164, 137, 0.8)',
          'rgba(152, 133, 88, 0.8)',
          'rgba(116, 150, 165, 0.8)'
        ],
        borderColor: [
          'rgba(143, 188, 143, 1)',
          'rgba(205, 164, 137, 1)',
          'rgba(152, 133, 88, 1)',
          'rgba(116, 150, 165, 1)'
        ],
        borderWidth: 1,
      }
    ]
  };

  const activityChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Platform Activity',
        font: {
          family: 'serif',
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const reviewsData = {
    labels: ['Positive', 'Negative'],
    datasets: [
      {
        data: [dashboardData.data.positive_reviews, dashboardData.data.negative_reviews],
        backgroundColor: [
          'rgba(143, 188, 143, 0.8)',
          'rgba(205, 114, 101, 0.8)'
        ],
        borderColor: [
          'rgba(143, 188, 143, 1)',
          'rgba(205, 114, 101, 1)'
        ],
        borderWidth: 1,
      }
    ]
  };

  const reviewsChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Customer Reviews',
        font: {
          family: 'serif',
          size: 16,
          weight: 'bold'
        }
      },
    }
  };

  const totalRevenue = dashboardData.data.monthly_revenue.reduce((sum: number, item: MonthlyRevenue) => sum + item.total_revenue, 0);

  return (
    <div className="flex flex-col bg-sage-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-sage-200 px-8 py-6 shadow-sm">
        <h1 className="text-3xl font-serif font-bold text-sage-900">Dashboard</h1>
        <p className="text-sage-600 mt-1">Welcome to Himalayan Yogii Admin</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Blogs", value: dashboardData.data.total_blogs, change: "All time" },
            { label: "Total Bookings", value: dashboardData.data.total_bookings, change: "All time" },
            { label: "Revenue", value: `₹${totalRevenue}`, change: "Current Year" },
            { label: "Inquiries", value: dashboardData.data.total_inquiries, change: "All time" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-sage-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >

              <p className="text-sage-600 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-serif font-bold text-sage-900 mt-2">{stat.value}</p>
              <p className="text-xs text-terracotta-600 mt-2">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg border border-sage-200 p-6 shadow-sm">
            <div className="h-80">
              <Line data={revenueData} />
            </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-white rounded-lg border border-sage-200 p-6 shadow-sm">
            <div className="h-80">
              <Bar data={activityData} />
            </div>
          </div>
        </div>

        {/* Bottom Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reviews Chart */}
          <div className="bg-white rounded-lg border border-sage-200 p-6 shadow-sm lg:col-span-1">
            <div className="h-64">
              <Doughnut data={reviewsData} />
            </div>
            <div className="mt-4 text-center">
              <div className="flex justify-center items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-sage-500 mr-2"></div>
                  <span className="text-sm text-sage-700">
                    Positive: {dashboardData.data.positive_reviews}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-terracotta-500 mr-2"></div>
                  <span className="text-sm text-sage-700">
                    Negative: {dashboardData.data.negative_reviews}
                  </span>
                </div>
              </div>
              <p className="text-xs text-sage-600 mt-2">
                Total Reviews: {dashboardData.data.positive_reviews + dashboardData.data.negative_reviews}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg border border-sage-200 p-6 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-serif font-bold text-sage-900 mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-sage-50 rounded-lg p-4 text-center">
                <p className="text-sage-600 text-sm">Blogs</p>
                <p className="text-2xl font-bold text-sage-900 mt-1">{dashboardData.data.total_blogs}</p>
              </div>
              <div className="bg-sage-50 rounded-lg p-4 text-center">
                <p className="text-sage-600 text-sm">Services</p>
                <p className="text-2xl font-bold text-sage-900 mt-1">{dashboardData.data.total_services}</p>
              </div>
              <div className="bg-sage-50 rounded-lg p-4 text-center">
                <p className="text-sage-600 text-sm">Inquiries</p>
                <p className="text-2xl font-bold text-sage-900 mt-1">{dashboardData.data.total_inquiries}</p>
              </div>
              <div className="bg-sage-50 rounded-lg p-4 text-center">
                <p className="text-sage-600 text-sm">Bookings</p>
                <p className="text-2xl font-bold text-sage-900 mt-1">{dashboardData.data.total_bookings}</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sage-700">Current Year Revenue</span>
                <span className="font-bold text-sage-900">
                  ₹{totalRevenue}
                </span>
              </div>
              <div className="w-full bg-sage-200 rounded-full h-2">
                <div
                  className="bg-terracotta-500 h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      (totalRevenue / 100000) * 100,
                      100
                    )}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}