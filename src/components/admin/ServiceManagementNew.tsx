import React, { useEffect, useState } from 'react';
import { PlusIcon, TrashIcon, EditIcon, SearchIcon, CheckIcon, XIcon, ClockIcon, PackagePlusIcon } from 'lucide-react';
import { getAllServices, createService, updateService, deleteService as deleteServiceFromDB, ServicePackage, PackageAddOn } from '../../services/firebaseService';
import toast from 'react-hot-toast';

export function ServiceManagementNew() {
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<ServicePackage | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [id, setId] = useState('');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [deliveryTime, setDeliveryTime] = useState('');
  const [addOns, setAddOns] = useState<PackageAddOn[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  // Add-on form state
  const [showAddOnForm, setShowAddOnForm] = useState(false);
  const [addOnName, setAddOnName] = useState('');
  const [addOnDescription, setAddOnDescription] = useState('');
  const [addOnPrice, setAddOnPrice] = useState('');
  const [addOnDeliveryTime, setAddOnDeliveryTime] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const services = await getAllServices();
      setServicePackages(services);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(services.map((service: ServicePackage) => service.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Failed to load services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const generateId = (baseName: string) => {
    const timestamp = Date.now();
    return `${baseName.toLowerCase().replace(/\s+/g, '-')}-${timestamp}`;
  };

  const handleAddService = () => {
    setCurrentService(null);
    setId(generateId('service'));
    setCategory(categories[0] || '');
    setName('');
    setPrice('');
    setDescription('');
    setFeatures(['']);
    setDeliveryTime('');
    setAddOns([]);
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
    setDeliveryTime(service.deliveryTime?.toString() || '');
    setAddOns(service.addOns || []);
    setIsModalOpen(true);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service package?')) {
      try {
        await deleteServiceFromDB(serviceId);
        toast.success('Service deleted successfully');
        loadServices();
      } catch (error) {
        console.error('Failed to delete service:', error);
        toast.error('Failed to delete service');
      }
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
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleAddNewAddOn = () => {
    if (!addOnName || !addOnPrice || !addOnDeliveryTime) {
      toast.error('Please fill all add-on fields');
      return;
    }

    const newAddOn: PackageAddOn = {
      id: generateId('addon'),
      name: addOnName,
      description: addOnDescription,
      price: parseFloat(addOnPrice),
      deliveryTime: parseInt(addOnDeliveryTime)
    };

    setAddOns([...addOns, newAddOn]);
    
    // Reset add-on form
    setAddOnName('');
    setAddOnDescription('');
    setAddOnPrice('');
    setAddOnDeliveryTime('');
    setShowAddOnForm(false);
    
    toast.success('Add-on added to package');
  };

  const handleRemoveAddOn = (addOnId: string) => {
    setAddOns(addOns.filter(addon => addon.id !== addOnId));
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !category || !description) {
      toast.error('Please fill all required fields');
      return;
    }

    const filteredFeatures = features.filter(f => f.trim() !== '');
    if (filteredFeatures.length === 0) {
      toast.error('Please add at least one feature');
      return;
    }

    const serviceData: Omit<ServicePackage, 'id'> = {
      category: showNewCategoryInput && newCategory ? newCategory : category,
      name,
      price: parseFloat(price),
      description,
      features: filteredFeatures,
      deliveryTime: deliveryTime ? parseInt(deliveryTime) : undefined,
      addOns: addOns.length > 0 ? addOns : undefined
    };

    try {
      if (currentService) {
        // Update existing service
        await updateService(currentService.id, serviceData);
        toast.success('Service updated successfully');
      } else {
        // Create new service
        await createService(serviceData);
        toast.success('Service created successfully');
      }
      
      setIsModalOpen(false);
      loadServices();
    } catch (error: any) {
      console.error('Failed to save service:', error);
      toast.error(error.message || 'Failed to save service');
    }
  };

  const filteredServices = servicePackages.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Service Management</h1>
          <p className="text-gray-600">Manage service packages and add-ons</p>
        </div>
        <button
          onClick={handleAddService}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <PlusIcon size={20} />
          Add Service Package
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <SearchIcon size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search services..."
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Services List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6 hover:shadow-retro-xl transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs uppercase font-medium text-gray-500 tracking-wide">
                    {service.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mt-1">{service.name}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditService(service)}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit service"
                  >
                    <EditIcon size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete service"
                  >
                    <TrashIcon size={18} />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{service.description}</p>

              <div className="mb-4">
                <div className="text-2xl font-bold text-primary-700">${service.price}</div>
                {service.deliveryTime && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <ClockIcon size={14} />
                    <span>{service.deliveryTime} days delivery</span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Features:</h4>
                <ul className="space-y-1">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-600">
                      <CheckIcon size={14} className="text-primary-600 mr-1 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {service.features.length > 3 && (
                    <li className="text-sm text-gray-500 italic">
                      +{service.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>

              {service.addOns && service.addOns.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-2">
                    <PackagePlusIcon size={14} />
                    <span>{service.addOns.length} Add-ons Available</span>
                  </div>
                  <div className="space-y-1">
                    {service.addOns.slice(0, 2).map((addon) => (
                      <div key={addon.id} className="text-xs text-gray-600">
                        • {addon.name} (+${addon.price})
                      </div>
                    ))}
                    {service.addOns.length > 2 && (
                      <div className="text-xs text-gray-500 italic">
                        +{service.addOns.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {currentService ? 'Edit Service Package' : 'Add New Service Package'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XIcon size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="p-6 space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Category *
                </label>
                {!showNewCategoryInput ? (
                  <div className="flex gap-2">
                    <select
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowNewCategoryInput(true)}
                      className="px-4 py-2 border-2 border-primary-600 text-primary-600 rounded-xl hover:bg-primary-50 transition-colors"
                    >
                      + New
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
                      placeholder="Enter new category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCategoryInput(false);
                        setNewCategory('');
                      }}
                      className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Package Name & Price */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
                    placeholder="e.g., Basic, Premium"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Time */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Estimated Delivery Time (days)
                </label>
                <div className="relative">
                  <ClockIcon size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="number"
                    className="w-full pl-12 pr-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
                    placeholder="e.g., 7"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Description *
                </label>
                <textarea
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 min-h-[100px]"
                  placeholder="Brief description of the package"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Features *
                </label>
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
                        placeholder={`Feature ${index + 1}`}
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                      />
                      {features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <XIcon size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
                  >
                    <PlusIcon size={16} />
                    Add Feature
                  </button>
                </div>
              </div>

              {/* Add-ons Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-gray-700 text-sm font-medium">
                    Package Add-ons ({addOns.length})
                  </label>
                  {!showAddOnForm && (
                    <button
                      type="button"
                      onClick={() => setShowAddOnForm(true)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
                    >
                      <PlusIcon size={16} />
                      Add Add-on
                    </button>
                  )}
                </div>

                {/* Add-on Form */}
                {showAddOnForm && (
                  <div className="bg-gray-50 p-4 rounded-xl mb-4 space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                          placeholder="Add-on name"
                          value={addOnName}
                          onChange={(e) => setAddOnName(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          step="0.01"
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                          placeholder="Price"
                          value={addOnPrice}
                          onChange={(e) => setAddOnPrice(e.target.value)}
                        />
                        <input
                          type="number"
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                          placeholder="Days"
                          value={addOnDeliveryTime}
                          onChange={(e) => setAddOnDeliveryTime(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                        placeholder="Description"
                        value={addOnDescription}
                        onChange={(e) => setAddOnDescription(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAddNewAddOn}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddOnForm(false);
                          setAddOnName('');
                          setAddOnDescription('');
                          setAddOnPrice('');
                          setAddOnDeliveryTime('');
                        }}
                        className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Add-ons List */}
                {addOns.length > 0 && (
                  <div className="space-y-2">
                    {addOns.map((addon) => (
                      <div
                        key={addon.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{addon.name}</div>
                          <div className="text-sm text-gray-600">{addon.description}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-semibold text-primary-600">${addon.price}</div>
                            <div className="text-xs text-gray-500">{addon.deliveryTime} days</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAddOn(addon.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <XIcon size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2"
                >
                  <CheckIcon size={18} />
                  {currentService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {filteredServices.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No services found.</p>
          <button
            onClick={handleAddService}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            Add your first service package
          </button>
        </div>
      )}
    </div>
  );
}
