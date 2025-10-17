import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { EditIcon, TrashIcon, DownloadIcon, SearchIcon, CalendarIcon, ListIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
};
export function MyQuotations() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    // Load quotations from localStorage
    const savedQuotations = JSON.parse(localStorage.getItem('quotations') || '[]');
    setQuotations(savedQuotations);
  }, []);
  const handleDeleteQuotation = (id: string) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      const updatedQuotations = quotations.filter(q => q.id !== id);
      setQuotations(updatedQuotations);
      localStorage.setItem('quotations', JSON.stringify(updatedQuotations));
    }
  };
  const handleEditQuotation = (id: string) => {
    localStorage.setItem('editQuotationId', id);
    navigate('/dashboard');
  };
  const downloadPDF = (quotation: Quotation) => {
    const doc = new jsPDF();
    // Add title
    doc.setFontSize(20);
    doc.text('Quotation: ' + quotation.name, 20, 20);
    // Add date
    doc.setFontSize(10);
    doc.text('Date: ' + new Date(quotation.date).toLocaleDateString(), 20, 30);
    // Add package details
    doc.setFontSize(14);
    doc.text('Selected Package: ' + quotation.servicePackage.category + ' - ' + quotation.servicePackage.name, 20, 40);
    doc.setFontSize(12);
    doc.text('Price: $' + quotation.servicePackage.price, 20, 50);
    // Add features
    doc.setFontSize(12);
    doc.text('Features:', 20, 60);
    let yPosition = 70;
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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const filteredQuotations = quotations.filter(q => q.name.toLowerCase().includes(searchTerm.toLowerCase()));
  return <div className="bg-lavender-light min-h-screen">
      <Sidebar />
      <div className="sm:pl-20 lg:pl-64 pb-20 sm:pb-0">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                My Quotations
              </h1>
              <p className="text-gray-600">
                View and manage your saved quotations
              </p>
            </div>
            <div className="relative w-full md:w-auto">
              <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search quotations..." className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 w-full" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
          {quotations.length === 0 ? <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 sm:p-12 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-lavender rounded-full flex items-center justify-center mx-auto mb-4">
                <ListIcon size={32} className="text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                No quotations yet
              </h2>
              <p className="text-gray-600 mb-6">
                Your finalized quotations will appear here
              </p>
              <p className="text-sm text-gray-500">
                To create a new quotation, start from the Dashboard or Services
                page
              </p>
            </div> : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredQuotations.map(quotation => <div key={quotation.id} className="bg-white rounded-2xl shadow-retro border border-gray-200 overflow-hidden hover:shadow-retro-lg transition-shadow">
                  <div className="bg-gray-100 p-3 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <CalendarIcon size={12} />
                      {formatDate(quotation.date)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {quotation.name}
                    </h3>
                    <div className="text-sm text-gray-600 mb-3">
                      <div className="mb-1">
                        Package:{' '}
                        <span className="font-medium">
                          {quotation.servicePackage.category} -{' '}
                          {quotation.servicePackage.name}
                        </span>
                      </div>
                      <div className="bg-gray-100 px-2 py-1 rounded text-xs inline-block">
                        {quotation.servicePackage.features.length} features
                        included
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xl font-bold text-primary-700">
                        ${quotation.totalPrice.toLocaleString()}
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" onClick={() => handleEditQuotation(quotation.id)} title="Edit quotation">
                          <EditIcon size={18} />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors" onClick={() => downloadPDF(quotation)} title="Download PDF">
                          <DownloadIcon size={18} />
                        </button>
                        <button onClick={() => handleDeleteQuotation(quotation.id)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete quotation">
                          <TrashIcon size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>}
        </div>
      </div>
    </div>;
}