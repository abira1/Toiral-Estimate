import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { CheckIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddOnsModal } from '../components/AddOnsModal';
export function ServicesPage() {
  const navigate = useNavigate();
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [isAddOnsModalOpen, setIsAddOnsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const handleSelectPackage = (packageId: string, packageData: any) => {
    setSelectedPackageId(packageId);
    setSelectedPackage(packageData);
    setIsAddOnsModalOpen(true);
  };
  const closeAddOnsModal = () => {
    setIsAddOnsModalOpen(false);
  };
  return <div className="bg-lavender-light min-h-screen">
      <Sidebar />
      <div className="sm:pl-20 lg:pl-64 pb-20 sm:pb-0">
        <div className="p-4 sm:p-6">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary-800 mb-2">
              Our Services
            </h1>
            <p className="text-gray-600 max-w-2xl">
              From concept to deployment, we provide comprehensive digital
              solutions tailored to your unique story.
            </p>
          </div>
          {/* Web & App Design Section */}
          <section className="mb-12 bg-white rounded-2xl shadow-retro-lg border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-primary-700 mb-3">
                Web & App Design
              </h2>
              <p className="text-gray-600 mb-6">
                We craft modern, user-friendly designs that truly represent your
                brand. From stunning websites to sleek app interfaces, our
                design-first approach ensures your digital presence is both
                functional and visually unforgettable.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Basic */}
                <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-primary-300 hover:shadow-retro transition-all h-full flex flex-col">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-1">Basic</h3>
                    <p className="text-sm text-gray-600 h-12">
                      Single-page website or app design, responsive layout.
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-primary-700 mb-4">
                    $60
                  </div>
                  <ul className="space-y-2 mb-6 flex-grow">
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        Single-page website or app design
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        Responsive layout for all devices
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">1 revision</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        Delivery of design in PNG/JPG
                      </span>
                    </li>
                  </ul>
                  <button className="w-full mt-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors" onClick={() => handleSelectPackage('web-basic', {
                  id: 'web-basic',
                  category: 'Web & App Design',
                  name: 'Basic',
                  price: 60,
                  description: 'Single-page website or app design, responsive layout.',
                  features: ['Single-page website or app design', 'Responsive layout for all devices', '1 revision', 'Delivery of design in PNG/JPG']
                })}>
                    Select Package
                  </button>
                </div>
                {/* Standard */}
                <div className="border-2 border-primary-500 bg-primary-50 rounded-xl p-5 relative shadow-retro-lg h-full flex flex-col">
                  <div className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    POPULAR
                  </div>
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-1">Standard</h3>
                    <p className="text-sm text-gray-600 h-12">
                      Up to 5 pages/screens with interactive prototype and
                      brand-focused UI.
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-primary-700 mb-4">
                    $150
                  </div>
                  <ul className="space-y-2 mb-6 flex-grow">
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Up to 5 pages/screens</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        Brand-focused UI/UX design
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        Interactive clickable prototype
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">3 revisions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        Delivery in PNG, JPG, and Figma/Adobe XD
                      </span>
                    </li>
                  </ul>
                  <button className="w-full mt-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors" onClick={() => handleSelectPackage('web-standard', {
                  id: 'web-standard',
                  category: 'Web & App Design',
                  name: 'Standard',
                  price: 150,
                  description: 'Up to 5 pages/screens with interactive prototype and brand-focused UI.',
                  features: ['Up to 5 pages/screens', 'Brand-focused UI/UX design', 'Interactive clickable prototype', '3 revisions', 'Delivery in PNG, JPG, and Figma/Adobe XD']
                })}>
                    Select Package
                  </button>
                </div>
                {/* Premium */}
                <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-primary-300 hover:shadow-retro transition-all h-full flex flex-col">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-1">Premium</h3>
                    <p className="text-sm text-gray-600 h-12">
                      For large organizations with complex design needs.
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-primary-700 mb-4">
                    $500
                  </div>
                  <ul className="space-y-2 mb-6 flex-grow">
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        Complete website/app design (unlimited pages/screens)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        Detailed design system (colors, typography, buttons,
                        icons)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Unlimited revisions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        Interactive prototype with animations
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        Delivery in all source files (Figma/Adobe XD)
                      </span>
                    </li>
                  </ul>
                  <button className="w-full mt-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors" onClick={() => handleSelectPackage('web-premium', {
                  id: 'web-premium',
                  category: 'Web & App Design',
                  name: 'Premium',
                  price: 500,
                  description: 'For large organizations with complex design needs.',
                  features: ['Complete website/app design (unlimited pages/screens)', 'Detailed design system (colors, typography, buttons, icons)', 'Unlimited revisions', 'Interactive prototype with animations', 'Delivery in all source files (Figma/Adobe XD)']
                })}>
                    Select Package
                  </button>
                </div>
              </div>
            </div>
          </section>
          {/* Complete Website Package */}
          <section className="mb-12 bg-white rounded-2xl shadow-retro-lg border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-secondary-600 mb-3">
                Complete Website Package
              </h2>
              <p className="text-gray-600 mb-6">
                Our Complete Website Package is an all-in-one solution for
                businesses that want to establish a strong online presence. From
                custom design (free included) to full-stack development, SEO,
                hosting, and ongoing support — we take care of everything.
                You'll get a professional, scalable, and growth-ready website
                without worrying about the technical details.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-secondary-300 hover:shadow-retro transition-all h-full flex flex-col">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-secondary-700">
                      Complete Website Package
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      All-in-one solution for businesses that want to establish
                      a strong online presence.
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-secondary-700 mb-4">
                    $1,200
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 flex-grow">
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-secondary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Custom design</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-secondary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Full-stack development</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-secondary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">SEO optimization</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-secondary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Hosting setup</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-secondary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Content management system</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-secondary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Mobile responsive</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-secondary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">30 days of support</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-secondary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Analytics integration</span>
                    </li>
                  </ul>
                  <button className="w-full mt-auto px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors" onClick={() => handleSelectPackage('complete-website', {
                  id: 'complete-website',
                  category: 'Complete Website Package',
                  name: 'Complete Website',
                  price: 1200,
                  description: 'All-in-one solution for businesses that want to establish a strong online presence.',
                  features: ['Custom design', 'Full-stack development', 'SEO optimization', 'Hosting setup', 'Content management system', 'Mobile responsive', '30 days of support', 'Analytics integration']
                })}>
                    Select Package
                  </button>
                </div>
                <div className="bg-secondary-50 border-2 border-secondary-200 rounded-xl p-5 h-full flex flex-col">
                  <div>
                    <h3 className="font-bold text-lg text-secondary-700 mb-2">
                      Why Choose Our Complete Package?
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Our complete package eliminates the hassle of coordinating
                      between different service providers. We handle everything
                      from start to finish, ensuring a cohesive and professional
                      result.
                    </p>
                    <div className="bg-white rounded-xl p-4 border border-secondary-100">
                      <div className="text-sm italic text-gray-600">
                        "Working with Toiral for our complete website package
                        was the best decision we made. They handled everything
                        and delivered a website that exceeded our expectations."
                      </div>
                      <div className="mt-3 text-sm font-medium">
                        — Sarah Johnson, Bloom Boutique
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Social Media Packages */}
          <section className="mb-12 bg-white rounded-2xl shadow-retro-lg border border-gray-200 overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-accent-600 mb-3">
                Social Media Packages for Every Stage
              </h2>
              <p className="text-gray-600 mb-6">
                We help brands build a strong social media presence with content
                that engages and grows your audience. Our services include image
                and video creation, captions, campaign planning, organic
                follower growth, strategy and ideas, and professional
                food/product photography.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-accent-300 hover:shadow-retro transition-all h-full flex flex-col">
                  <div className="h-12 w-12 bg-accent-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-accent-600 font-bold">1</span>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2">Starter</h3>
                    <p className="text-sm text-gray-600 h-12">
                      Perfect for businesses just beginning their social media
                      journey.
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-accent-700 mb-4">
                    $300
                  </div>
                  <ul className="space-y-2 mb-6 flex-grow">
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">8 posts per month</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Basic image creation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Caption writing</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        Monthly performance report
                      </span>
                    </li>
                  </ul>
                  <button className="w-full mt-auto px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors" onClick={() => handleSelectPackage('social-starter', {
                  id: 'social-starter',
                  category: 'Social Media',
                  name: 'Starter',
                  price: 300,
                  description: 'Perfect for businesses just beginning their social media journey.',
                  features: ['8 posts per month', 'Basic image creation', 'Caption writing', 'Monthly performance report']
                })}>
                    Select Package
                  </button>
                </div>
                <div className="border-2 border-accent-500 bg-accent-50 rounded-xl p-5 relative shadow-retro-lg h-full flex flex-col">
                  <div className="absolute top-0 right-0 bg-accent-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    POPULAR
                  </div>
                  <div className="h-12 w-12 bg-accent-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-accent-600 font-bold">2</span>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2">Growth</h3>
                    <p className="text-sm text-gray-600 h-12">
                      For businesses ready to expand their social media
                      presence.
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-accent-700 mb-4">
                    $600
                  </div>
                  <ul className="space-y-2 mb-6 flex-grow">
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">15 posts per month</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        Advanced image and video creation
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Engagement strategy</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Hashtag research</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        Bi-weekly performance reports
                      </span>
                    </li>
                  </ul>
                  <button className="w-full mt-auto px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors" onClick={() => handleSelectPackage('social-growth', {
                  id: 'social-growth',
                  category: 'Social Media',
                  name: 'Growth',
                  price: 600,
                  description: 'For businesses ready to expand their social media presence.',
                  features: ['15 posts per month', 'Advanced image and video creation', 'Engagement strategy', 'Hashtag research', 'Bi-weekly performance reports']
                })}>
                    Select Package
                  </button>
                </div>
                <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-accent-300 hover:shadow-retro transition-all h-full flex flex-col">
                  <div className="h-12 w-12 bg-accent-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-accent-600 font-bold">3</span>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2">Professional</h3>
                    <p className="text-sm text-gray-600 h-12">
                      Comprehensive management for established brands.
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-accent-700 mb-4">
                    $1,200
                  </div>
                  <ul className="space-y-2 mb-6 flex-grow">
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">30 posts per month</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Premium content creation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Story and Reel creation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Community management</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Influencer outreach</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon size={18} className="text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        Weekly performance reports
                      </span>
                    </li>
                  </ul>
                  <button className="w-full mt-auto px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors" onClick={() => handleSelectPackage('social-professional', {
                  id: 'social-professional',
                  category: 'Social Media',
                  name: 'Professional',
                  price: 1200,
                  description: 'Comprehensive management for established brands.',
                  features: ['30 posts per month', 'Premium content creation', 'Story and Reel creation', 'Community management', 'Influencer outreach', 'Weekly performance reports']
                })}>
                    Select Package
                  </button>
                </div>
              </div>
            </div>
          </section>
          {/* CTA Section */}
          <section className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl shadow-retro-lg overflow-hidden text-white">
            <div className="p-6 sm:p-8 text-center">
              <h2 className="text-xl sm:text-2xl font-bold mb-3">
                Ready to transform your digital presence?
              </h2>
              <p className="mb-6 max-w-2xl mx-auto">
                Get in touch with our team today for a free consultation and
                discover how our services can help your business grow.
              </p>
              <button className="px-8 py-3 bg-white text-primary-700 rounded-xl hover:bg-cream transition-colors font-medium">
                Contact Us Today
              </button>
            </div>
          </section>
        </div>
      </div>
      {/* Add-ons Modal */}
      <AddOnsModal isOpen={isAddOnsModalOpen} onClose={closeAddOnsModal} selectedPackage={selectedPackage} />
    </div>;
}