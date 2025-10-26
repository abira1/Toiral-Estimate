import React, { useState, useEffect } from 'react';
import { Plus, X, Search, Package, DollarSign, Calendar } from 'lucide-react';
import { getAllServices, getAllUsers, ServicePackage, User } from '../../services/firebaseService';
import { getAddOns, createPackageAssignment } from '../../services/packageAssignmentService';
import { PackageAddOn } from '../../types/packages';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

export function PackageAssignment() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<ServicePackage[]>([]);
  const [addOns, setAddOns] = useState<PackageAddOn[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPackages, setSelectedPackages] = useState<Array<{ packageId: string; addOns: string[] }>>([]);
  const [paymentInstallments, setPaymentInstallments] = useState(3);
  const [paymentPercentages, setPaymentPercentages] = useState<number[]>([30, 40, 30]);
  const [startDate, setStartDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, servicesData, addOnsData] = await Promise.all([
        getAllUsers(),
        getAllServices(),
        getAddOns()
      ]);
      setUsers(usersData.filter(u => u.role !== 'admin'));
      setServices(servicesData);
      setAddOns(addOnsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    }
  };

  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setSelectedPackages([]);
    setPaymentInstallments(3);
    setPaymentPercentages([30, 40, 30]);
    setStartDate('');
    setNotes('');
    setShowModal(true);
  };

  const handleAddPackage = () => {
    if (services.length === 0) {
      toast.error('No services available');
      return;
    }
    setSelectedPackages([...selectedPackages, { packageId: services[0].id, addOns: [] }]);
  };

  const handleRemovePackage = (index: number) => {
    setSelectedPackages(selectedPackages.filter((_, i) => i !== index));
  };

  const handlePackageChange = (index: number, packageId: string) => {
    const updated = [...selectedPackages];
    updated[index].packageId = packageId;
    setSelectedPackages(updated);
  };

  const handleAddOnToggle = (packageIndex: number, addOnId: string) => {
    const updated = [...selectedPackages];
    const addOnIndex = updated[packageIndex].addOns.indexOf(addOnId);
    if (addOnIndex > -1) {
      updated[packageIndex].addOns.splice(addOnIndex, 1);
    } else {
      updated[packageIndex].addOns.push(addOnId);
    }
    setSelectedPackages(updated);
  };

  const handleInstallmentsChange = (count: number) => {
    setPaymentInstallments(count);
    // Auto-distribute percentages
    const percentage = Math.floor(100 / count);
    const remainder = 100 - (percentage * count);
    const percentages = Array(count).fill(percentage);
    percentages[0] += remainder; // Add remainder to first payment
    setPaymentPercentages(percentages);
  };

  const handlePercentageChange = (index: number, value: number) => {
    const updated = [...paymentPercentages];
    updated[index] = value;
    setPaymentPercentages(updated);
  };

  const calculateTotal = () => {
    return selectedPackages.reduce((total, pkg) => {
      const service = services.find(s => s.id === pkg.packageId);
      if (!service) return total;
      const addOnsTotal = pkg.addOns.reduce((sum, addOnId) => {
        const addOn = addOns.find(a => a.id === addOnId);
        return sum + (addOn?.price || 0);
      }, 0);
      return total + service.price + addOnsTotal;
    }, 0);
  };

  const handleSubmit = async () => {
    if (!selectedUser) return;
    if (selectedPackages.length === 0) {
      toast.error('Please select at least one package');
      return;
    }

    const percentagesSum = paymentPercentages.reduce((sum, p) => sum + p, 0);
    if (percentagesSum !== 100) {
      toast.error('Payment percentages must add up to 100%');
      return;
    }

    setLoading(true);
    try {
      await createPackageAssignment({
        userId: selectedUser.id,
        userName: selectedUser.name,
        userEmail: selectedUser.email,
        packages: selectedPackages,
        paymentStructure: {
          installments: paymentInstallments,
          percentages: paymentPercentages
        },
        startDate: startDate || undefined,
        notes
      }, currentUser?.uid || 'admin');

      toast.success(`Packages assigned to ${selectedUser.name} successfully!`);
      setShowModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error assigning packages:', error);
      toast.error('Failed to assign packages');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Package Assignment</h1>
        <p className="text-gray-600">Assign service packages to users</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white rounded-2xl shadow-retro border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary-600 font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => handleOpenModal(user)}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              <Package size={16} />
              Assign Packages
            </button>
          </div>
        ))}
      </div>

      {/* Assignment Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Assign Packages to {selectedUser.name}
                </h2>
                <p className="text-gray-600">{selectedUser.email}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            {/* Selected Packages */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Selected Packages</h3>
                <button
                  onClick={handleAddPackage}
                  className="bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Package
                </button>
              </div>

              {selectedPackages.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No packages selected yet</p>
              ) : (
                <div className="space-y-4">
                  {selectedPackages.map((pkg, index) => {
                    const service = services.find(s => s.id === pkg.packageId);
                    return (
                      <div key={index} className="border-2 border-gray-200 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-grow">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Package
                            </label>
                            <select
                              value={pkg.packageId}
                              onChange={(e) => handlePackageChange(index, e.target.value)}
                              className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
                            >
                              {services.map(s => (
                                <option key={s.id} value={s.id}>
                                  {s.category} - {s.name} (${s.price})
                                </option>
                              ))}
                            </select>
                          </div>
                          <button
                            onClick={() => handleRemovePackage(index)}
                            className="ml-4 mt-7 text-red-500 hover:text-red-700"
                          >
                            <X size={20} />
                          </button>
                        </div>

                        {service && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-sm font-medium text-gray-700 mb-1">Features:</p>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {service.features.map((f, i) => (
                                  <li key={i}>• {f}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Add-ons */}
                        {addOns.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Add-ons (Optional)
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {addOns.map(addOn => (
                                <label key={addOn.id} className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={pkg.addOns.includes(addOn.id)}
                                    onChange={() => handleAddOnToggle(index, addOn.id)}
                                    className="mr-2"
                                  />
                                  <div className="flex-grow">
                                    <p className="text-sm font-medium text-gray-700">{addOn.name}</p>
                                    <p className="text-xs text-gray-500">${addOn.price}</p>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Payment Structure */}
            {selectedPackages.length > 0 && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <DollarSign size={20} className="text-blue-600" />
                  Payment Structure
                </h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Installments
                  </label>
                  <select
                    value={paymentInstallments}
                    onChange={(e) => handleInstallmentsChange(Number(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} Installment{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {paymentPercentages.map((percentage, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment {index + 1} (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={percentage}
                        onChange={(e) => handlePercentageChange(index, Number(e.target.value))}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary-600">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Details */}
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Project Start Date (Optional)
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
                  placeholder="Add any special instructions or notes..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || selectedPackages.length === 0}
                className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Assigning...' : 'Assign Packages'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}