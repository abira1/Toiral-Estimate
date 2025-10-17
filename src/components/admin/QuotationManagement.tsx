import React, { useEffect, useState } from 'react';
import { SearchIcon, ArrowUpDownIcon, TrashIcon, EyeIcon, DownloadIcon, XIcon } from 'lucide-react';
import { jsPDF } from 'jspdf';
type ServicePackage = {
  id: string;
  category: string;
  name: string;
  price: number;
  description: string;
  features: string[];
};
type Quotation = {
  id: string;
  name: string;
  date: string;
  servicePackage: ServicePackage;
  totalPrice: number;
  userId?: string;
};
type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  profilePicture?: string | null;
};
export function QuotationManagement() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'date' | 'name' | 'price'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentQuotation, setCurrentQuotation] = useState<Quotation | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: ''
  });
  useEffect(() => {
    // Load quotations and users from localStorage
    const storedQuotations = JSON.parse(localStorage.getItem('quotations') || '[]');
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setQuotations(storedQuotations);
    setUsers(storedUsers);
  }, []);
  const handleViewQuotation = (quotation: Quotation) => {
    setCurrentQuotation(quotation);
    setIsViewModalOpen(true);
  };
  const handleDeleteQuotation = (id: string) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      const updatedQuotations = quotations.filter(q => q.id !== id);
      setQuotations(updatedQuotations);
      localStorage.setItem('quotations', JSON.stringify(updatedQuotations));
    }
  };
  const downloadPDF = (quotation: Quotation) => {
    const doc = new jsPDF();
    // Add title
    doc.setFontSize(20);
    doc.text('Quotation: ' + quotation.name, 20, 20);
    // Add date
    doc.setFontSize(10);
    doc.text('Date: ' + new Date(quotation.date).toLocaleDateString(), 20, 30);
    // Add user info if available
    if (quotation.userId) {
      const user = users.find(u => u.id === quotation.userId);
      if (user) {
        doc.setFontSize(12);
        doc.text('Client: ' + user.name, 20, 40);
        doc.text('Email: ' + user.email, 20, 47);
      }
    }
    // Add package details
    doc.setFontSize(14);
    doc.text('Selected Package: ' + quotation.servicePackage.category + ' - ' + quotation.servicePackage.name, 20, 60);
    doc.setFontSize(12);
    doc.text('Price: $' + quotation.servicePackage.price, 20, 70);
    // Add features
    doc.setFontSize(12);
    doc.text('Features:', 20, 80);
    let yPosition = 90;
    quotation.servicePackage.features.forEach(feature => {
      doc.setFontSize(10);
      doc.text('• ' + feature, 25, yPosition);
      yPosition += 6;
    });
    // Add total
    doc.setFontSize(14);
    doc.text('Total: $' + quotation.totalPrice, 20, yPosition + 10);
    // Save the PDF
    doc.save(quotation.name.replace(/\s+/g, '_') + '.pdf');
  };
  const handleSort = (field: 'date' | 'name' | 'price') => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const getUserName = (userId?: string) => {
    if (!userId) return 'Unknown User';
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };
  // Apply filters and search
  let filteredQuotations = [...quotations];
  if (filters.category) {
    filteredQuotations = filteredQuotations.filter(q => q.servicePackage.category === filters.category);
  }
  if (filters.minPrice) {
    filteredQuotations = filteredQuotations.filter(q => q.totalPrice >= parseFloat(filters.minPrice));
  }
  if (filters.maxPrice) {
    filteredQuotations = filteredQuotations.filter(q => q.totalPrice <= parseFloat(filters.maxPrice));
  }
  if (searchTerm) {
    filteredQuotations = filteredQuotations.filter(q => q.name.toLowerCase().includes(searchTerm.toLowerCase()) || q.servicePackage.name.toLowerCase().includes(searchTerm.toLowerCase()) || q.userId && getUserName(q.userId).toLowerCase().includes(searchTerm.toLowerCase()));
  }
  // Sort quotations
  filteredQuotations.sort((a, b) => {
    if (sortField === 'date') {
      return sortDirection === 'asc' ? new Date(a.date).getTime() - new Date(b.date).getTime() : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortField === 'name') {
      return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else {
      // price
      return sortDirection === 'asc' ? a.totalPrice - b.totalPrice : b.totalPrice - a.totalPrice;
    }
  });
  // Get unique categories for filter
  const categories = Array.from(new Set(quotations.map(q => q.servicePackage.category)));
  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: ''
    });
  };
  return <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Quotation Management
        </h1>
        <p className="text-gray-600">View and manage all customer quotations</p>
      </div>
      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-retro border border-gray-200 p-5 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search quotations..." className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 w-full" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-3">
            <select className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500" value={filters.category} onChange={e => setFilters({
            ...filters,
            category: e.target.value
          })}>
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>
                  {cat}
                </option>)}
            </select>
            <input type="number" placeholder="Min Price" className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 w-24" value={filters.minPrice} onChange={e => setFilters({
            ...filters,
            minPrice: e.target.value
          })} />
            <input type="number" placeholder="Max Price" className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 w-24" value={filters.maxPrice} onChange={e => setFilters({
            ...filters,
            maxPrice: e.target.value
          })} />
            {(filters.category || filters.minPrice || filters.maxPrice) && <button onClick={clearFilters} className="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-1">
                <XIcon size={16} />
                Clear
              </button>}
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Showing {filteredQuotations.length} of {quotations.length} quotations
        </div>
      </div>
      {/* Quotations Table */}
      <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-4 px-6 font-medium text-gray-600">
                  <button className="flex items-center gap-1" onClick={() => handleSort('name')}>
                    Quotation Name
                    {sortField === 'name' && <ArrowUpDownIcon size={16} className={`transform ${sortDirection === 'asc' ? '' : 'rotate-180'}`} />}
                  </button>
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">
                  User
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">
                  Package
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">
                  <button className="flex items-center gap-1" onClick={() => handleSort('date')}>
                    Date
                    {sortField === 'date' && <ArrowUpDownIcon size={16} className={`transform ${sortDirection === 'asc' ? '' : 'rotate-180'}`} />}
                  </button>
                </th>
                <th className="text-right py-4 px-6 font-medium text-gray-600">
                  <button className="flex items-center gap-1 ml-auto" onClick={() => handleSort('price')}>
                    Amount
                    {sortField === 'price' && <ArrowUpDownIcon size={16} className={`transform ${sortDirection === 'asc' ? '' : 'rotate-180'}`} />}
                  </button>
                </th>
                <th className="text-right py-4 px-6 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotations.map(quotation => <tr key={quotation.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-800">
                    {quotation.name}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {getUserName(quotation.userId)}
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <span className="font-medium text-gray-800">
                        {quotation.servicePackage.name}
                      </span>
                      <div className="text-xs text-gray-500">
                        {quotation.servicePackage.category}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {formatDate(quotation.date)}
                  </td>
                  <td className="py-4 px-6 text-right font-medium text-primary-700">
                    ${quotation.totalPrice}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => handleViewQuotation(quotation)} className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="View details">
                        <EyeIcon size={18} />
                      </button>
                      <button onClick={() => downloadPDF(quotation)} className="p-2 text-gray-600 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors" title="Download PDF">
                        <DownloadIcon size={18} />
                      </button>
                      <button onClick={() => handleDeleteQuotation(quotation.id)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete quotation">
                        <TrashIcon size={18} />
                      </button>
                    </div>
                  </td>
                </tr>)}
              {filteredQuotations.length === 0 && <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No quotations found matching your criteria
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>
      {/* View Quotation Modal */}
      {isViewModalOpen && currentQuotation && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Quotation Details
              </h2>
              <button onClick={() => setIsViewModalOpen(false)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                <XIcon size={20} />
              </button>
            </div>
            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {currentQuotation.name}
                  </h3>
                  <p className="text-gray-600">
                    Created on {formatDate(currentQuotation.date)}
                  </p>
                </div>
                <div className="text-2xl font-bold text-primary-700">
                  ${currentQuotation.totalPrice}
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">
                Client Information
              </h4>
              {currentQuotation.userId ? <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="font-medium">
                    {getUserName(currentQuotation.userId)}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {users.find(u => u.id === currentQuotation.userId)?.email || 'No email available'}
                  </p>
                </div> : <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-600">
                    No client information available
                  </p>
                </div>}
            </div>
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">
                Selected Package
              </h4>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">
                      {currentQuotation.servicePackage.category} -{' '}
                      {currentQuotation.servicePackage.name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {currentQuotation.servicePackage.description}
                    </p>
                  </div>
                  <span className="font-semibold text-primary-700">
                    ${currentQuotation.servicePackage.price}
                  </span>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">
                Features Included
              </h4>
              <ul className="bg-gray-50 p-4 rounded-xl space-y-2">
                {currentQuotation.servicePackage.features.map((feature, index) => <li key={index} className="flex items-start">
                      <span className="h-5 w-5 bg-primary-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                        <span className="text-primary-700 text-xs">✓</span>
                      </span>
                      <span className="text-sm">{feature}</span>
                    </li>)}
              </ul>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsViewModalOpen(false)} className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
                Close
              </button>
              <button onClick={() => downloadPDF(currentQuotation)} className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2">
                <DownloadIcon size={18} />
                Download PDF
              </button>
            </div>
          </div>
        </div>}
    </div>;
}