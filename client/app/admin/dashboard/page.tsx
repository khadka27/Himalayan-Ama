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
    // Additional fields from backend
    totalReviews?: number;
    activeReviews?: number;
    totalUsers?: number;
  }
}

import Cookies from 'js-cookie';
import Loading from '@/components/loading';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND?.trim();
        if (!backendUrl) {
          throw new Error("Backend URL is not configured");
        }
        const token = Cookies.get("auth_token");

        const response = await fetch(`${backendUrl}/api/v1/stats`, {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true"
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.statusText}`);
        }

        const result = await response.json();
        setDashboardData(result);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-sage-50 text-sage-900">
        <h2 className="text-2xl font-serif font-bold mb-4">Error Loading Dashboard</h2>
        <p className="text-terracotta-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  // Prepare data for charts
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const revenueData = {
    labels: monthNames,
    datasets: [
      {
        label: 'Monthly Revenue (₹)',
        data: dashboardData?.data?.monthly_revenue?.map(item => item.total_revenue) || [],
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
          weight: 'bold' as const
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
          dashboardData?.data?.total_blogs ?? 0,
          dashboardData?.data?.total_services ?? 0,
          dashboardData?.data?.total_inquiries ?? 0,
          dashboardData?.data?.total_bookings ?? 0
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
          weight: 'bold' as const
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
        data: [dashboardData?.data?.positive_reviews || 0, dashboardData?.data?.negative_reviews || 0],
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
          weight: 'bold' as const
        }
      },
    }
  };

  const totalRevenue = dashboardData?.data?.monthly_revenue?.reduce((sum: number, item: MonthlyRevenue) => sum + item.total_revenue, 0) || 0;

  return (
    <>
      <div className="flex flex-col bg-sage-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-sage-200 px-4 md:px-8 py-4 md:py-6 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-sage-900">Dashboard</h1>
          <p className="text-sage-600 mt-1 text-sm md:text-base">Welcome to Himalayan Yogii Admin</p>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {[
              { label: "Total Blogs", value: dashboardData?.data?.total_blogs ?? 0, change: "All time" },
              { label: "Total Bookings", value: dashboardData?.data?.total_bookings ?? 0, change: "All time" },
              { label: "Revenue", value: `₹${totalRevenue}`, change: "Current Year" },
              { label: "Inquiries", value: dashboardData?.data?.total_inquiries ?? 0, change: "All time" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-sage-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >

                <p className="text-sage-600 text-xs md:text-sm font-medium">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-serif font-bold text-sage-900 mt-1 md:mt-2">{stat.value}</p>
                <p className="text-[10px] md:text-xs text-terracotta-600 mt-1 md:mt-2">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white rounded-lg border border-sage-200 p-4 md:p-6 shadow-sm">
              <div className="h-64 md:h-80">
                <Line data={revenueData} options={revenueChartOptions} />
              </div>
            </div>

            {/* Activity Chart */}
            <div className="bg-white rounded-lg border border-sage-200 p-4 md:p-6 shadow-sm">
              <div className="h-64 md:h-80">
                <Bar data={activityData} options={activityChartOptions} />
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
                      Positive: {dashboardData?.data?.positive_reviews || 0}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-terracotta-500 mr-2"></div>
                    <span className="text-sm text-sage-700">
                      Negative: {dashboardData?.data?.negative_reviews || 0}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-sage-600 mt-2">
                  Total Reviews: {(dashboardData?.data?.positive_reviews ?? 0) + (dashboardData?.data?.negative_reviews ?? 0)}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg border border-sage-200 p-4 md:p-6 shadow-sm lg:col-span-2">
              <h2 className="text-lg md:text-xl font-serif font-bold text-sage-900 mb-4">Quick Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-sage-50 rounded-lg p-3 md:p-4 text-center">
                  <p className="text-sage-600 text-xs md:text-sm">Blogs</p>
                  <p className="text-xl md:text-2xl font-bold text-sage-900 mt-1">{dashboardData?.data?.total_blogs ?? 0}</p>
                </div>
                <div className="bg-sage-50 rounded-lg p-3 md:p-4 text-center">
                  <p className="text-sage-600 text-xs md:text-sm">Services</p>
                  <p className="text-xl md:text-2xl font-bold text-sage-900 mt-1">{dashboardData?.data?.total_services ?? 0}</p>
                </div>
                <div className="bg-sage-50 rounded-lg p-3 md:p-4 text-center">
                  <p className="text-sage-600 text-xs md:text-sm">Inquiries</p>
                  <p className="text-xl md:text-2xl font-bold text-sage-900 mt-1">{dashboardData?.data?.total_inquiries ?? 0}</p>
                </div>
                <div className="bg-sage-50 rounded-lg p-3 md:p-4 text-center">
                  <p className="text-sage-600 text-xs md:text-sm">Bookings</p>
                  <p className="text-xl md:text-2xl font-bold text-sage-900 mt-1">{dashboardData?.data?.total_bookings ?? 0}</p>
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
    </>
  )
}