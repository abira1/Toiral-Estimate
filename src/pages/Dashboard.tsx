import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { UserIcon, PhoneIcon, MailIcon, MapPinIcon, StarIcon, ExternalLinkIcon, ClockIcon, CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
type UserProfile = {
  name: string;
  email: string;
  profilePicture: string | null;
};
type Project = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  status: 'active' | 'pending' | 'completed';
  progress: number;
  nextMilestone: string;
  nextPaymentDate: string;
};
export function Dashboard() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  });
  const [activeProjects, setActiveProjects] = useState<Project[]>([{
    id: '1',
    name: 'Company Website Redesign',
    description: 'Complete overhaul of corporate website with new branding',
    startDate: '2023-06-15',
    status: 'active',
    progress: 65,
    nextMilestone: 'Final design approval',
    nextPaymentDate: '2023-07-15'
  }, {
    id: '2',
    name: 'Social Media Campaign',
    description: 'Monthly social media management for product launch',
    startDate: '2023-05-01',
    status: 'pending',
    progress: 40,
    nextMilestone: 'Mid-month content review',
    nextPaymentDate: '2023-07-01'
  }]);
  const [review, setReview] = useState({
    rating: 0,
    comment: '',
    name: userProfile.name,
    email: userProfile.email
  });
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const handleRatingChange = (rating: number) => {
    setReview(prev => ({
      ...prev,
      rating
    }));
  };
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the review to a server
    alert('Thank you for your feedback!');
    setReview({
      ...review,
      comment: '',
      rating: 0
    });
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <div className="bg-lavender-light min-h-screen">
      <Sidebar />
      <main className="sm:pl-20 lg:pl-64 pb-20 sm:pb-0" role="main">
        <div className="p-4 sm:p-6">
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, {userProfile.name}</p>
          </header>
          {/* User Profile Card */}
          <section className="bg-white rounded-2xl shadow-retro border border-gray-200 p-4 sm:p-6 mb-6" aria-labelledby="user-profile-heading">
            <div className="flex items-center">
              {userProfile.profilePicture ? (
                <img 
                  src={userProfile.profilePicture} 
                  alt={`${userProfile.name}'s profile picture`} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary-200" 
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center" aria-label="Default profile picture">
                  <UserIcon size={32} className="text-primary-500" aria-hidden="true" />
                </div>
              )}
              <div className="ml-4">
                <h2 id="user-profile-heading" className="font-semibold text-lg text-gray-800">
                  {userProfile.name}
                </h2>
                <p className="text-gray-600">{userProfile.email}</p>
                <nav className="mt-2" aria-label="Profile actions">
                  <button 
                    onClick={() => navigate('/my-quotations')} 
                    className="text-sm text-primary-600 hover:text-primary-800 font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    aria-label="Navigate to my quotations page"
                  >
                    View My Quotations
                  </button>
                  <span className="mx-2 text-gray-300" aria-hidden="true">|</span>
                  <button 
                    onClick={() => navigate('/my-projects')} 
                    className="text-sm text-primary-600 hover:text-primary-800 font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    aria-label="Navigate to all projects page"
                  >
                    View All Projects
                  </button>
                </nav>
              </div>
            </div>
          </section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Project Progress */}
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6" aria-labelledby="projects-heading">
                <h2 id="projects-heading" className="text-xl font-semibold mb-4 text-gray-800">
                  Current Project Progress
                </h2>
                {activeProjects.length > 0 ? <div className="space-y-6">
                    {activeProjects.map(project => <div key={project.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-800">
                                {project.name}
                              </h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {project.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                            <CalendarIcon size={14} />
                            <span>
                              Started: {formatDate(project.startDate)}
                            </span>
                          </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              Project Progress
                            </span>
                            <span className="text-sm font-medium text-primary-600">
                              {project.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-primary-600 h-2.5 rounded-full" style={{
                        width: `${project.progress}%`
                      }}></div>
                          </div>
                        </div>
                        {/* Next Steps */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-primary-50 rounded-lg p-3 border border-primary-100">
                            <div className="flex items-start">
                              <div className="h-6 w-6 bg-primary-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                                <ClockIcon size={14} className="text-primary-600" />
                              </div>
                              <div>
                                <h4 className="text-xs font-medium text-primary-800">
                                  Next Milestone
                                </h4>
                                <p className="text-sm">
                                  {project.nextMilestone}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-secondary-50 rounded-lg p-3 border border-secondary-100">
                            <div className="flex items-start">
                              <div className="h-6 w-6 bg-secondary-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                                <CalendarIcon size={14} className="text-secondary-600" />
                              </div>
                              <div>
                                <h4 className="text-xs font-medium text-secondary-800">
                                  Next Payment
                                </h4>
                                <p className="text-sm">
                                  {formatDate(project.nextPaymentDate)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>)}
                  </div> : <div className="text-center py-8">
                    <div className="w-16 h-16 bg-lavender rounded-full flex items-center justify-center mx-auto mb-3">
                      <ClockIcon size={24} className="text-primary-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      No active projects
                    </h3>
                    <p className="text-gray-500 mb-4">
                      You don't have any active projects at the moment.
                    </p>
                    <button onClick={() => navigate('/services')} className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                      Browse Services
                    </button>
                  </div>}
                <div className="mt-4 text-center">
                  <button onClick={() => navigate('/my-projects')} className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    View all projects
                  </button>
                </div>
              </div>
              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-retro border border-gray-200 p-4 sm:p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Contact Us
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex items-start">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <PhoneIcon size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">Phone</h3>
                      <p className="text-gray-600 break-all">
                        +1 (555) 123-4567
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Monday to Friday, 9am to 6pm
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <MailIcon size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">Email</h3>
                      <p className="text-gray-600 break-all">
                        support@toiral.com
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        We'll respond within 24 hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <MapPinIcon size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">Office</h3>
                      <p className="text-gray-600">123 Web Dev Street</p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        San Francisco, CA 94107
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <ExternalLinkIcon size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">Social</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors text-sm">
                          Twitter
                        </a>
                        <span className="text-gray-300 hidden sm:inline">
                          •
                        </span>
                        <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors text-sm">
                          LinkedIn
                        </a>
                        <span className="text-gray-300 hidden sm:inline">
                          •
                        </span>
                        <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors text-sm">
                          Instagram
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Leave a Review Form */}
            <div className="bg-white rounded-2xl shadow-retro-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Leave a Review
              </h2>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => <button key={star} type="button" onClick={() => handleRatingChange(star)} className="focus:outline-none">
                        <StarIcon size={24} className={`${review.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      </button>)}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input type="text" value={review.name} onChange={e => setReview({
                  ...review,
                  name: e.target.value
                })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500" required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email
                  </label>
                  <input type="email" value={review.email} onChange={e => setReview({
                  ...review,
                  email: e.target.value
                })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500" required />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Feedback
                  </label>
                  <textarea value={review.comment} onChange={e => setReview({
                  ...review,
                  comment: e.target.value
                })} className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 min-h-[120px]" placeholder="Tell us about your experience with our services..." required></textarea>
                </div>
                <button type="submit" className="w-full px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                  Submit Review
                </button>
              </form>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">
                  Why Leave a Review?
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Your feedback helps us improve our services and assists other
                  clients in making informed decisions.
                </p>
                <div className="flex items-center gap-2 text-sm text-primary-600">
                  <StarIcon size={16} className="fill-primary-600" />
                  <span>
                    Join over 200+ satisfied clients who've shared their
                    experience
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}