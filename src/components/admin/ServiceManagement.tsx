import React, { useEffect, useState } from 'react';
import { PlusIcon, TrashIcon, EditIcon, SearchIcon, CheckIcon, XIcon } from 'lucide-react';
type ServicePackage = {
  id: string;
  category: string;
  name: string;
  price: number;
  description: string;
  features: string[];
};
export function ServiceManagement() {
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<ServicePackage | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  // Form state
  const [id, setId] = useState('');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  useEffect(() => {
    // Load services from localStorage
    const storedServices = JSON.parse(localStorage.getItem('servicePackages') || '[]');
    if (storedServices.length === 0) {
      // Use default services if none exist
      const defaultServices = [{
        id: 'web-basic',
        category: 'Web & App Design',
        name: 'Basic',
        price: 60,
        description: 'Single-page website or app design, responsive layout.',
        features: ['Single-page website or app design', 'Responsive layout for all devices', '1 revision', 'Delivery of design in PNG/JPG']
      }, {
        id: 'web-standard',
        category: 'Web & App Design',
        name: 'Standard',
        price: 150,
        description: 'Up to 5 pages/screens with interactive prototype and brand-focused UI.',
        features: ['Up to 5 pages/screens', 'Brand-focused UI/UX design', 'Interactive clickable prototype', '3 revisions', 'Delivery in PNG, JPG, and Figma/Adobe XD']
      }, {
        id: 'complete-website',
        category: 'Complete Website Package',
        name: 'Complete Website',
        price: 1200,
        description: 'All-in-one solution for businesses that want to establish a strong online presence.',
        features: ['Custom design', 'Full-stack development', 'SEO optimization', 'Hosting setup', 'Content management system', 'Mobile responsive', '30 days of support', 'Analytics integration']
      }];
      localStorage.setItem('servicePackages', JSON.stringify(defaultServices));
      setServicePackages(defaultServices);
      // Extract unique categories
      const uniqueCategories = [...new Set(defaultServices.map(service => service.category))];
      setCategories(uniqueCategories);
    } else {
      setServicePackages(storedServices);
      // Extract unique categories
      const uniqueCategories = [...new Set(storedServices.map((service: ServicePackage) => service.category))];
      setCategories(uniqueCategories);
    }
  }, []);
  const handleAddService = () => {
    setCurrentService(null);
    setId(generateId(''));
    setCategory(categories[0] || '');
    setName('');
    setPrice('');
    setDescription('');
    setFeatures(['']);
    setIsModalOpen(true);
  };
  const handleEditService = (service: ServicePackage) => {
    setCurrentService(service);
    setId(service.id);
    setCategory(service.category);
    setName(service.name);
    setPrice(service.price.toString());
    setDescription(service.description);
    setFeatures([...service.features]);
    setIsModalOpen(true);
  };
  const handleDeleteService = (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service package?')) {
      const updatedServices = servicePackages.filter(service => service.id !== serviceId);
      setServicePackages(updatedServices);
      localStorage.setItem('servicePackages', JSON.stringify(updatedServices));
    }
  };
  const handleAddFeature = () => {
    setFeatures([...features, '']);
  };
  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };
  const handleRemoveFeature = (index: number) => {
    if (features.length > 1) {
      const updatedFeatures = features.filter((_, i) => i !== index);
      setFeatures(updatedFeatures);
    }
  };
  const generateId = (name: string) => {
    const baseName = name.toLowerCase().replace(/\s+/g, '-') || 'service';
    return `${baseName}-${Date.now().toString().slice(-4)}`;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty features
    const filteredFeatures = features.filter(feature => feature.trim() !== '');
    const serviceData: ServicePackage = {
      id: id || generateId(name),
      category: showNewCategoryInput ? newCategory : category,
      name,
      price: parseFloat(price),
      description,
      features: filteredFeatures.length > 0 ? filteredFeatures : ['No features specified']
    };
    let updatedServices: ServicePackage[];
    if (currentService) {
      // Edit existing service
      updatedServices = servicePackages.map(service => service.id === currentService.id ? serviceData : service);
    } else {
      // Add new service
      updatedServices = [...servicePackages, serviceData];
    }
    setServicePackages(updatedServices);
    localStorage.setItem('servicePackages', JSON.stringify(updatedServices));
    // Update categories if a new one was added
    if (showNewCategoryInput && newCategory && !categories.includes(newCategory)) {
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
    }
    setIsModalOpen(false);
  };
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'add_new') {
      setShowNewCategoryInput(true);
      setNewCategory('');
    } else {
      setShowNewCategoryInput(false);
      setCategory(value);
    }
  };
  const filteredServices = servicePackages.filter(service => service.name.toLowerCase().includes(searchTerm.toLowerCase()) || service.category.toLowerCase().includes(searchTerm.toLowerCase()));
  return <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Service Packages</h1>
          <p className="text-gray-600">
            Manage your service offerings and pricing
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search services..." className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <button onClick={handleAddService} className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2">
            <PlusIcon size={18} />
            <span>Add Service</span>
          </button>
        </div>
      </div>
      {/* Service Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(service => <div key={service.id} className="bg-white rounded-2xl shadow-retro border border-gray-200 overflow-hidden hover:shadow-retro-lg transition-all">
            <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">
                {service.category}
              </span>
              <div className="flex gap-2">
                <button onClick={() => handleEditService(service)} className="p-1.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Edit service">
                  <EditIcon size={16} />
                </button>
                <button onClick={() => handleDeleteService(service.id)} className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete service">
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-800">
                  {service.name}
                </h3>
                <span className="font-semibold text-xl text-primary-700">
                  ${service.price}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {service.description}
              </p>
              <h4 className="font-medium text-gray-700 mb-2">Features:</h4>
              <ul className="space-y-2">
                {service.features.map((feature, index) => <li key={index} className="flex items-start">
                    <CheckIcon size={16} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>)}
              </ul>
            </div>
          </div>)}
        {filteredServices.length === 0 && <div className="col-span-full text-center py-12 bg-white rounded-2xl shadow-retro border border-gray-200">
            <div className="w-16 h-16 mx-auto bg-lavender rounded-full flex items-center justify-center mb-4">
              <SearchIcon size={24} className="text-primary-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No services found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or add a new service
            </p>
          </div>}
      </div>
      {/* Service Modal */}
      {isModalOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {currentService ? 'Edit Service Package' : 'Add New Service Package'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Category
                </label>
                {showNewCategoryInput ? <div className="flex gap-2">
                    <input type="text" className="flex-grow px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Enter new category name" required />
                    <button type="button" className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" onClick={() => setShowNewCategoryInput(false)}>
                      <XIcon size={20} />
                    </button>
                  </div> : <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500" value={category} onChange={handleCategoryChange} required>
                    {categories.map(cat => <option key={cat} value={cat}>
                        {cat}
                      </option>)}
                    <option value="add_new">+ Add new category</option>
                  </select>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Package Name
                </label>
                <input type="text" className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Price ($)
                </label>
                <input type="number" className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500" value={price} onChange={e => setPrice(e.target.value)} min="0" step="0.01" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500" value={description} onChange={e => setDescription(e.target.value)} rows={3} required></textarea>
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-700 text-sm font-medium">
                    Features
                  </label>
                  <button type="button" className="text-sm text-primary-600 hover:text-primary-800" onClick={handleAddFeature}>
                    + Add Feature
                  </button>
                </div>
                {features.map((feature, index) => <div key={index} className="flex gap-2 mb-2">
                    <input type="text" className="flex-grow px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500" value={feature} onChange={e => handleFeatureChange(index, e.target.value)} placeholder={`Feature ${index + 1}`} />
                    {features.length > 1 && <button type="button" className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" onClick={() => handleRemoveFeature(index)}>
                        <XIcon size={20} />
                      </button>}
                  </div>)}
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                  {currentService ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>}
    </div>;
}