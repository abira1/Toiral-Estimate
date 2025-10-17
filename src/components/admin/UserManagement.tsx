import React, { useEffect, useState } from 'react';
import { PlusIcon, TrashIcon, EditIcon, SearchIcon, UserIcon, ShieldIcon, ShieldOffIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  profilePicture?: string | null;
  accessCode?: string;
  packageDetails?: any;
};
export function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  useEffect(() => {
    // Initialize with default admin user if no users exist
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (storedUsers.length === 0) {
      const adminUser = {
        id: '1',
        name: 'Admin User',
        email: 'admin@toiral.com',
        isAdmin: true,
        profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      };
      localStorage.setItem('users', JSON.stringify([adminUser]));
      setUsers([adminUser]);
    } else {
      setUsers(storedUsers);
    }
  }, []);
  const handleAddUser = () => {
    setCurrentUser(null);
    setName('');
    setEmail('');
    setIsAdmin(false);
    setProfilePicture('');
    setIsModalOpen(true);
  };
  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setName(user.name);
    setEmail(user.email);
    setIsAdmin(user.isAdmin);
    setProfilePicture(user.profilePicture || '');
    setIsModalOpen(true);
  };
  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };
  const handleToggleAdmin = (userId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          isAdmin: !user.isAdmin
        };
      }
      return user;
    });
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = currentUser ? currentUser.id : Date.now().toString();
    const userData: User = {
      id: userId,
      name,
      email,
      isAdmin,
      profilePicture: profilePicture || null
    };
    let updatedUsers: User[];
    if (currentUser) {
      // Edit existing user
      updatedUsers = users.map(user => user.id === currentUser.id ? userData : user);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setIsModalOpen(false);
    } else {
      // Add new user
      updatedUsers = [...users, userData];
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setIsModalOpen(false);
      // Redirect to package setup for new user
      navigate(`/admin/package-setup/${userId}`);
    }
  };
  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()));
  return <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search users..." className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <button onClick={handleAddUser} className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2">
            <PlusIcon size={18} />
            <span>Add User</span>
          </button>
        </div>
      </div>
      {/* User Table */}
      <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-4 px-6 font-medium text-gray-600">
                  User
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">
                  Email
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">
                  Role
                </th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">
                  Access Code
                </th>
                <th className="text-right py-4 px-6 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      {user.profilePicture ? <img src={user.profilePicture} alt={user.name} className="w-10 h-10 rounded-full object-cover mr-3" /> : <div className="w-10 h-10 rounded-full bg-lavender flex items-center justify-center mr-3">
                          <UserIcon size={20} className="text-primary-600" />
                        </div>}
                      <span className="font-medium text-gray-800">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{user.email}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isAdmin ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {user.accessCode ? <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                        {user.accessCode}
                      </span> : <button onClick={() => navigate(`/admin/package-setup/${user.id}`)} className="text-secondary-600 hover:text-secondary-800 text-sm font-medium">
                        Setup package
                      </button>}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => handleToggleAdmin(user.id)} className={`p-2 rounded-lg transition-colors ${user.isAdmin ? 'text-primary-600 hover:bg-primary-50' : 'text-gray-600 hover:bg-gray-100'}`} title={user.isAdmin ? 'Remove admin rights' : 'Make admin'}>
                        {user.isAdmin ? <ShieldOffIcon size={18} /> : <ShieldIcon size={18} />}
                      </button>
                      <button onClick={() => handleEditUser(user)} className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Edit user">
                        <EditIcon size={18} />
                      </button>
                      <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete user">
                        <TrashIcon size={18} />
                      </button>
                    </div>
                  </td>
                </tr>)}
              {filteredUsers.length === 0 && <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>
      {/* User Modal */}
      {isModalOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {currentUser ? 'Edit User' : 'Add New User'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Name
                </label>
                <input type="text" className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email
                </label>
                <input type="email" className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Profile Picture URL
                </label>
                <input type="text" className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500" value={profilePicture} onChange={e => setProfilePicture(e.target.value)} placeholder="https://example.com/image.jpg" />
              </div>
              <div className="mb-6">
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-5 w-5 text-primary-600" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)} />
                  <span className="ml-2 text-gray-700">Admin privileges</span>
                </label>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                  {currentUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>}
    </div>;
}