import React, { useState } from 'react';
import { XIcon, UserPlusIcon, MailIcon, UserIcon } from 'lucide-react';
import { createAccessCode } from '../../services/accessCodeService';
import { sendInvitationEmail } from '../../services/emailService';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteSent?: () => void;
}

export function InviteUserModal({ isOpen, onClose, onInviteSent }: InviteUserModalProps) {
  const { userProfile } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    userName: '',
    role: 'user' as 'user' | 'admin'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) {
      toast.error('You must be logged in to send invitations');
      return;
    }

    setIsLoading(true);

    try {
      // Create access code
      const accessCode = await createAccessCode(
        formData.email,
        formData.userName,
        formData.role,
        userProfile.id
      );

      // Send invitation email
      await sendInvitationEmail(
        formData.email,
        formData.userName,
        accessCode.code,
        userProfile.name
      );

      toast.success(`Invitation sent to ${formData.email} with access code: ${accessCode.code}`);
      
      // Reset form
      setFormData({ email: '', userName: '', role: 'user' });
      
      onInviteSent?.();
      onClose();
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <UserPlusIcon size={24} className="text-primary-600" />
            Invite New User
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <XIcon size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <MailIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
                placeholder="user@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
              User Name
            </label>
            <div className="relative">
              <UserIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
            >
              <option value="user">Client User</option>
              <option value="admin">Admin User</option>
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
            <h4 className="font-medium text-blue-800 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• A unique access code will be generated</li>
              <li>• An invitation email will be sent to the user</li>
              <li>• The access code expires in 7 days</li>
              <li>• User can login using the access code</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.email || !formData.userName}
              className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Sending...
                </>
              ) : (
                <>
                  <UserPlusIcon size={18} />
                  Send Invitation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}