import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CalendarIcon, CheckIcon, PackageIcon, PlusIcon, SaveIcon, TagIcon, XIcon } from 'lucide-react';
type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  profilePicture?: string | null;
  accessCode?: string;
  packageDetails?: PackageDetails;
};
type ServicePackage = {
  id: string;
  category: string;
  name: string;
  price: number;
  description: string;
  features: string[];
};
type AddOn = {
  id: string;
  name: string;
  description: string;
  price: number;
  selected: boolean;
};
type PackageDetails = {
  packageId: string;
  customPrice?: number;
  deliveryDate?: string;
  addOns: string[];
  notes?: string;
};
export function PackageSetup() {
  const {
    userId
  } = useParams<{
    userId: string;
  }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessCode, setAccessCode] = useState('');
  // Form state
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [customPrice, setCustomPrice] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  useEffect(() => {
    // Load user data
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find((u: User) => u.id === userId);
    if (currentUser) {
      setUser(currentUser);
      // If user already has package details, pre-fill the form
      if (currentUser.packageDetails) {
        setSelectedPackageId(currentUser.packageDetails.packageId || '');
        setCustomPrice(currentUser.packageDetails.customPrice?.toString() || '');
        setDeliveryDate(currentUser.packageDetails.deliveryDate || '');
        setSelectedAddOns(currentUser.packageDetails.addOns || []);
        setNotes(currentUser.packageDetails.notes || '');
      }
      if (currentUser.accessCode) {
        setAccessCode(currentUser.accessCode);
      }
    }
    // Load packages
    const storedPackages = JSON.parse(localStorage.getItem('servicePackages') || '[]');
    setPackages(storedPackages);
    // Load add-ons
    setAddOns([{
      id: 'addon-1',
      name: 'Priority Support',
      description: '24/7 customer support with 4-hour response time',
      price: 99,
      selected: false
    }, {
      id: 'addon-2',
      name: 'SEO Package',
      description: 'Basic SEO optimization for better search engine rankings',
      price: 149,
      selected: false
    }, {
      id: 'addon-3',
      name: 'Content Creation',
      description: 'Professional copywriting for up to 5 pages',
      price: 199,
      selected: false
    }, {
      id: 'addon-4',
      name: 'Analytics Setup',
      description: 'Google Analytics and reporting dashboard setup',
      price: 79,
      selected: false
    }, {
      id: 'addon-5',
      name: 'Extended Support',
      description: 'Additional 30 days of technical support',
      price: 129,
      selected: false
    }].map(addon => ({
      ...addon,
      selected: selectedAddOns.includes(addon.id)
    })));
    setLoading(false);
  }, [userId]);
  const generateAccessCode = () => {
    // Generate a random 8-character alphanumeric code
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  const handleAddOnToggle = (addonId: string) => {
    setAddOns(addOns.map(addon => addon.id === addonId ? {
      ...addon,
      selected: !addon.selected
    } : addon));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackageId) {
      alert('Please select a package');
      return;
    }
    // Generate access code if not already present
    const newAccessCode = accessCode || generateAccessCode();
    setAccessCode(newAccessCode);
    // Update user with package details and access code
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: User) => {
      if (u.id === userId) {
        return {
          ...u,
          accessCode: newAccessCode,
          packageDetails: {
            packageId: selectedPackageId,
            customPrice: customPrice ? parseFloat(customPrice) : undefined,
            deliveryDate,
            addOns: addOns.filter(a => a.selected).map(a => a.id),
            notes
          }
        };
      }
      return u;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    // Show success message
    setSuccessMessage(`Package setup complete! Access code: ${newAccessCode}`);
    // Scroll to top to show success message
    window.scrollTo(0, 0);
  };
  const selectedPackage = packages.find(p => p.id === selectedPackageId);
  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>;
  }
  if (!user) {
    return <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        User not found.{' '}
        <button onClick={() => navigate('/admin/users')} className="underline font-medium">
          Return to user management
        </button>
      </div>;
  }
  return <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/users')} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Package Setup</h1>
          <p className="text-gray-600">
            Configure package details for {user.name}
          </p>
        </div>
      </div>
      {successMessage && <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <CheckIcon className="mr-2" size={20} />
            <p>{successMessage}</p>
          </div>
          <button onClick={() => navigate('/admin/users')} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Return to Users
          </button>
        </div>}
      <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          {user.profilePicture ? <img src={user.profilePicture} alt={user.name} className="w-16 h-16 rounded-full object-cover" /> : <div className="w-16 h-16 rounded-full bg-lavender flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-600">
                {user.name.charAt(0)}
              </span>
            </div>}
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <PackageIcon className="mr-2" size={20} />
            Select Package
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {packages.map(pkg => <div key={pkg.id} className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedPackageId === pkg.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setSelectedPackageId(pkg.id)}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{pkg.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {pkg.description}
                    </p>
                    <div className="mt-3">
                      <span className="text-xs uppercase font-medium text-gray-500">
                        {pkg.category}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end">
                    <span className="font-semibold text-primary-700">
                      ${pkg.price}
                    </span>
                    <div className={`mt-2 h-5 w-5 rounded-full flex items-center justify-center ${selectedPackageId === pkg.id ? 'bg-primary-500' : 'bg-gray-200'}`}>
                      {selectedPackageId === pkg.id && <CheckIcon size={14} className="text-white" />}
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Custom Price (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input type="number" className="w-full pl-8 pr-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500" placeholder={selectedPackage ? selectedPackage.price.toString() : 'Custom price'} value={customPrice} onChange={e => setCustomPrice(e.target.value)} />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Leave blank to use the default package price
            </p>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Estimated Delivery Date
            </label>
            <div className="relative">
              <CalendarIcon size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input type="date" className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <TagIcon className="mr-2" size={20} />
            Add-ons
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {addOns.map(addon => <div key={addon.id} className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${addon.selected ? 'border-secondary-500 bg-secondary-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => handleAddOnToggle(addon.id)}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{addon.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {addon.description}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-col items-end">
                    <span className="font-semibold text-secondary-700">
                      ${addon.price}
                    </span>
                    <div className={`mt-2 h-5 w-5 rounded-full flex items-center justify-center ${addon.selected ? 'bg-secondary-500' : 'bg-gray-200'}`}>
                      {addon.selected && <CheckIcon size={14} className="text-white" />}
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Additional Notes
          </h2>
          <div className="mb-6">
            <textarea className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 min-h-[120px]" placeholder="Add any special instructions or notes for this client..." value={notes} onChange={e => setNotes(e.target.value)}></textarea>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button type="button" onClick={() => navigate('/admin/users')} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2" disabled={!selectedPackageId}>
            <SaveIcon size={18} />
            {accessCode ? 'Update Package Setup' : 'Complete Setup & Generate Access Code'}
          </button>
        </div>
      </form>
    </div>;
}