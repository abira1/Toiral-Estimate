import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import {
  TrendingUpIcon,
  DollarSignIcon,
  FileTextIcon,
  PackageIcon,
  DownloadIcon,
  CalendarIcon
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { getAllQuotations } from '../services/firebaseService';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];

export function AnalyticsPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const allQuotations = await getAllQuotations();
      
      // Filter by date range
      const filtered = allQuotations.filter(q => {
        const qDate = new Date(q.createdAt);
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        return qDate >= start && qDate <= end;
      });
      
      setQuotations(filtered);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const totalQuotations = quotations.length;
  const totalRevenue = quotations.reduce((sum, q) => sum + q.totalPrice, 0);
  const avgQuotationValue = totalQuotations > 0 ? totalRevenue / totalQuotations : 0;

  // Quotations over time
  const quotationsOverTime = () => {
    const dataMap: Record<string, number> = {};
    quotations.forEach(q => {
      const date = format(new Date(q.createdAt), 'MMM dd');
      dataMap[date] = (dataMap[date] || 0) + 1;
    });
    return Object.entries(dataMap).map(([date, count]) => ({ date, count }));
  };

  // Revenue over time
  const revenueOverTime = () => {
    const dataMap: Record<string, number> = {};
    quotations.forEach(q => {
      const date = format(new Date(q.createdAt), 'MMM dd');
      dataMap[date] = (dataMap[date] || 0) + q.totalPrice;
    });
    return Object.entries(dataMap).map(([date, revenue]) => ({ date, revenue }));
  };

  // Package popularity
  const packagePopularity = () => {
    const dataMap: Record<string, number> = {};
    quotations.forEach(q => {
      const packageName = `${q.servicePackage.category} - ${q.servicePackage.name}`;
      dataMap[packageName] = (dataMap[packageName] || 0) + 1;
    });
    return Object.entries(dataMap).map(([name, value]) => ({ name, value }));
  };

  // Status distribution
  const statusDistribution = () => {
    const dataMap: Record<string, number> = {};
    quotations.forEach(q => {
      const status = q.status || 'draft';
      dataMap[status] = (dataMap[status] || 0) + 1;
    });
    return Object.entries(dataMap).map(([name, value]) => ({ name, value }));
  };

  const exportData = () => {
    const csv = [
      ['Date', 'Quotation Name', 'Client', 'Package', 'Total Price', 'Status'],
      ...quotations.map(q => [
        format(new Date(q.createdAt), 'yyyy-MM-dd'),
        q.name,
        q.clientInfo.name,
        `${q.servicePackage.category} - ${q.servicePackage.name}`,
        q.totalPrice,
        q.status || 'draft'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    toast.success('Analytics data exported!');
  };

  return (
    <div className="bg-lavender-light min-h-screen">
      <Sidebar />
      <div className="sm:pl-20 lg:pl-64 pb-20 sm:pb-0">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600">
                Track your business performance and insights
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportData}
                className="px-4 py-2 bg-secondary-600 text-white rounded-xl hover:bg-secondary-700 transition-colors flex items-center gap-2"
              >
                <DownloadIcon size={18} />
                Export Data
              </button>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="bg-white rounded-2xl shadow-retro border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <CalendarIcon size={20} className="text-primary-600" />
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-retro border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-600">Total Quotations</h3>
                <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <FileTextIcon size={20} className="text-primary-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">{totalQuotations}</p>
              <p className="text-sm text-gray-500 mt-2">In selected period</p>
            </div>

            <div className="bg-white rounded-2xl shadow-retro border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-600">Total Revenue</h3>
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSignIcon size={20} className="text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">
                ${totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2">Potential revenue</p>
            </div>

            <div className="bg-white rounded-2xl shadow-retro border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-600">Avg. Quotation</h3>
                <div className="h-10 w-10 bg-secondary-100 rounded-full flex items-center justify-center">
                  <TrendingUpIcon size={20} className="text-secondary-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">
                ${avgQuotationValue.toFixed(0)}
              </p>
              <p className="text-sm text-gray-500 mt-2">Average value</p>
            </div>

            <div className="bg-white rounded-2xl shadow-retro border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-600">Packages Sold</h3>
                <div className="h-10 w-10 bg-accent-100 rounded-full flex items-center justify-center">
                  <PackageIcon size={20} className="text-accent-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {packagePopularity().length}
              </p>
              <p className="text-sm text-gray-500 mt-2">Unique packages</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Quotations Over Time */}
            <div className="bg-white rounded-2xl shadow-retro border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quotations Over Time
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={quotationsOverTime()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue Over Time */}
            <div className="bg-white rounded-2xl shadow-retro border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Revenue Over Time
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueOverTime()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Package Popularity */}
            <div className="bg-white rounded-2xl shadow-retro border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Package Popularity
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={packagePopularity()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name.split(' - ')[1]} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {packagePopularity().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Status Distribution */}
            <div className="bg-white rounded-2xl shadow-retro border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quotation Status
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusDistribution()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#ec4899" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
