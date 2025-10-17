import React, { useEffect, useState } from 'react';
import { AlertCircleIcon, CheckCircleIcon, DownloadIcon, FileTextIcon, LoaderIcon } from 'lucide-react';
import QuotationGenerator from '../services/QuotationGenerator';
type QuotationItem = {
  title: string;
  description: string;
  quantity: number;
  unitPrice: number;
};
type ProfessionalQuotationFormProps = {
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  projectTitle: string;
  projectDescription: string;
  selectedPackage?: any;
  selectedAddOns?: any[];
};
export function ProfessionalQuotationForm({
  clientName,
  clientEmail,
  clientPhone,
  projectTitle,
  projectDescription,
  selectedPackage,
  selectedAddOns
}: ProfessionalQuotationFormProps) {
  const [clientCompany, setClientCompany] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    quotationNo?: string;
    total?: number;
    pdfUrl?: string;
    summary?: string;
    message?: string;
  } | null>(null);
  const [customItems, setCustomItems] = useState<QuotationItem[]>([]);
  const [useDefaultItems, setUseDefaultItems] = useState(true);
  // Convert selected package and add-ons to quotation items format
  const convertSelectedToItems = (): QuotationItem[] => {
    const items: QuotationItem[] = [];
    if (selectedPackage) {
      items.push({
        title: `${selectedPackage.category} - ${selectedPackage.name}`,
        description: selectedPackage.description,
        quantity: 1,
        unitPrice: selectedPackage.price
      });
    }
    if (selectedAddOns && selectedAddOns.length > 0) {
      selectedAddOns.forEach(addon => {
        items.push({
          title: addon.name,
          description: addon.description,
          quantity: 1,
          unitPrice: addon.price
        });
      });
    }
    return items.length > 0 ? items : QuotationGenerator.getDefaultItems();
  };
  // Initialize custom items based on selected package and add-ons
  useEffect(() => {
    setCustomItems(convertSelectedToItems());
  }, [selectedPackage, selectedAddOns]);
  const handleGenerateQuotation = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent default form submission behavior
    e.preventDefault();
    setIsGenerating(true);
    try {
      const quotationData = QuotationGenerator.prepareQuotationData({
        clientName,
        clientCompany,
        clientEmail: clientEmail || '',
        clientPhone: clientPhone || '',
        projectTitle,
        projectDescription
      }, useDefaultItems ? QuotationGenerator.getDefaultItems() : customItems);
      const response = await QuotationGenerator.generatePDF(quotationData);
      setResult(response);
    } catch (error) {
      console.error('Error generating quotation:', error);
      setResult({
        success: false,
        message: 'An unexpected error occurred while generating the quotation.'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  const handleAddItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent default form submission behavior
    e.preventDefault();
    setCustomItems([...customItems, {
      title: '',
      description: '',
      quantity: 1,
      unitPrice: 0
    }]);
  };
  const handleUpdateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...customItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'quantity' || field === 'unitPrice' ? Number(value) : value
    };
    setCustomItems(updatedItems);
  };
  const handleRemoveItem = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    // Prevent default form submission behavior
    e.preventDefault();
    const updatedItems = customItems.filter((_, i) => i !== index);
    setCustomItems(updatedItems);
  };
  const calculateTotal = () => {
    const items = useDefaultItems ? QuotationGenerator.getDefaultItems() : customItems;
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };
  return <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Professional Quotation Generator
      </h2>
      <p className="text-gray-600 mb-6">
        Generate a detailed professional quotation document with Toiral branding
      </p>
      <div className="space-y-6">
        {/* Client Company Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client Company
          </label>
          <input type="text" value={clientCompany} onChange={e => setClientCompany(e.target.value)} placeholder="Company Name or Individual" className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500" />
        </div>
        {/* Items Selection Toggle */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-800">Quotation Items</h3>
            <div className="flex items-center">
              <input type="checkbox" id="useDefaultItems" checked={useDefaultItems} onChange={() => setUseDefaultItems(!useDefaultItems)} className="mr-2" />
              <label htmlFor="useDefaultItems" className="text-sm">
                Use Default Toiral Services
              </label>
            </div>
          </div>
          {useDefaultItems ? <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Service</th>
                    <th className="text-left py-2">Description</th>
                    <th className="text-center py-2">Qty</th>
                    <th className="text-right py-2">Unit Price</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {QuotationGenerator.getDefaultItems().map((item, index) => <tr key={index} className="border-b border-gray-100">
                      <td className="py-3">{item.title}</td>
                      <td className="py-3 text-gray-600">{item.description}</td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-right">${item.unitPrice}</td>
                      <td className="py-3 text-right font-medium">
                        ${item.quantity * item.unitPrice}
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div> : <div className="space-y-4 mb-4">
              {customItems.map((item, index) => <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Item Title
                      </label>
                      <input type="text" value={item.title} onChange={e => handleUpdateItem(index, 'title', e.target.value)} placeholder="Service Title" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input type="text" value={item.description} onChange={e => handleUpdateItem(index, 'description', e.target.value)} placeholder="Brief description" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input type="number" min="1" value={item.quantity} onChange={e => handleUpdateItem(index, 'quantity', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Unit Price ($)
                      </label>
                      <input type="number" min="0" step="0.01" value={item.unitPrice} onChange={e => handleUpdateItem(index, 'unitPrice', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500" />
                    </div>
                    <div className="flex items-end">
                      <button type="button" onClick={e => handleRemoveItem(e, index)} className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center justify-end">
                      <span className="font-medium">
                        Total: ${item.quantity * item.unitPrice}
                      </span>
                    </div>
                  </div>
                </div>)}
              <button type="button" onClick={handleAddItem} className="px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors w-full">
                + Add Another Item
              </button>
            </div>}
          <div className="flex justify-between items-center font-bold text-lg py-4 border-t border-gray-200">
            <span>Total Amount:</span>
            <span className="text-primary-700">${calculateTotal()}</span>
          </div>
        </div>
        {/* Generate Button */}
        <div className="mt-6">
          <button type="button" onClick={handleGenerateQuotation} disabled={isGenerating} className="w-full px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
            {isGenerating ? <>
                <LoaderIcon size={18} className="animate-spin" />
                Generating Professional Quotation...
              </> : <>
                <FileTextIcon size={18} />
                Generate Professional Quotation
              </>}
          </button>
        </div>
        {/* Result Section */}
        {result && <div className={`mt-6 p-4 rounded-xl ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            {result.success ? <div>
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircleIcon size={20} className="text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-green-800">
                      Quotation Generated Successfully
                    </h4>
                    <p className="text-sm text-green-700">{result.summary}</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-100 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      Quotation Number:
                    </span>
                    <span className="font-medium">{result.quotationNo}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Amount:</span>
                    <span className="font-medium">${result.total}</span>
                  </div>
                </div>
                <a href={result.pdfUrl} target="_blank" rel="noopener noreferrer" className="w-full px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors flex items-center justify-center gap-2">
                  <DownloadIcon size={18} />
                  Download Professional PDF
                </a>
              </div> : <div className="flex items-start gap-3">
                <AlertCircleIcon size={20} className="text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-red-800">
                    Error Generating Quotation
                  </h4>
                  <p className="text-sm text-red-700">{result.message}</p>
                </div>
              </div>}
          </div>}
        <div className="text-center text-sm text-gray-500 mt-6 italic">
          Imagine, Develop, Deploy — Toiral Web Development.
        </div>
      </div>
    </div>;
}