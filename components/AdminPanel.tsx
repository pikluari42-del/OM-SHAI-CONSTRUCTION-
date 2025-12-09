

import React, { useState } from 'react';
import { X, PlusCircle, Sparkles, Loader2, Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { useSite } from '../context/SiteContext';
import { CATEGORIES } from '../types';
import { generateJobDescription } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { addJob, isLoading: isPosting } = useJobs();
  const { heroImages, addHeroImage, removeHeroImage } = useSite();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'jobs' | 'settings'>('jobs');
  
  // Job Form State
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    salary: '',
    type: 'Daily' as const,
    category: CATEGORIES[0],
    description: '',
    contact: '+91 ',
  });

  // Hero Image State
  const [newImageUrl, setNewImageUrl] = useState('');

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addJob({
      ...formData,
      employerId: 'admin',
      jobScope: 'Domestic',
      workersRequired: 1
    });
    alert('Job Posted Successfully!');
    // Reset form
    setFormData({
      title: '',
      location: '',
      salary: '',
      type: 'Daily',
      category: CATEGORIES[0],
      description: '',
      contact: '+91 ',
    });
  };

  const handleGenerateDescription = async () => {
    if (!formData.title) return;
    
    setIsGeneratingAI(true);
    const desc = await generateJobDescription(formData.title, formData.category, language);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGeneratingAI(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addHeroImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(newImageUrl) {
      addHeroImage(newImageUrl);
      setNewImageUrl('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Backdrop */}
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
          
          {/* Header */}
          <div className="bg-brand-blue px-4 py-3 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-bold text-white flex items-center">
              Admin Dashboard
            </h3>
            <button onClick={onClose} className="text-gray-300 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('jobs')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'jobs'
                    ? 'border-brand-orange text-brand-orange'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Post New Job
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-brand-orange text-brand-orange'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Site Settings (Hero Images)
              </button>
            </nav>
          </div>

          <div className="px-4 py-5 sm:p-6">
            {activeTab === 'jobs' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-medium text-gray-700">Job Title</label>
                    <input 
                      type="text" 
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                      placeholder="e.g. Helper Needed"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value as any})}
                    >
                      <option value="Daily">Daily Wage</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input 
                      type="text" 
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                      placeholder="City, Area"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700">Salary/Rate</label>
                    <input 
                      type="text" 
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                      placeholder="₹500 / Day"
                      value={formData.salary}
                      onChange={e => setFormData({...formData, salary: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <button 
                      type="button" 
                      onClick={handleGenerateDescription}
                      disabled={isGeneratingAI || !formData.title}
                      className="text-xs flex items-center text-purple-600 hover:text-purple-800 font-bold disabled:opacity-50"
                    >
                      {isGeneratingAI ? <Loader2 size={12} className="animate-spin mr-1"/> : <Sparkles size={12} className="mr-1"/>}
                      AI Generate
                    </button>
                  </div>
                  <textarea 
                    required
                    rows={3}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                    placeholder="Details about the job..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input 
                    type="text" 
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                    value={formData.contact}
                    onChange={e => setFormData({...formData, contact: e.target.value})}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isPosting}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-orange text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange sm:text-sm disabled:opacity-50"
                  >
                    {isPosting ? 'Posting...' : 'Post Job Now'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                 {/* Current Images */}
                 <div>
                   <h4 className="text-sm font-medium text-gray-700 mb-3">Current Hero Slider Images</h4>
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                     {heroImages.map((img) => (
                       <div key={img.id} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video">
                          <img src={img.url} alt="Hero Slide" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => removeHeroImage(img.id)}
                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Add New Image */}
                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                      <ImageIcon size={18} className="mr-2" />
                      Add New Image
                    </h4>
                    
                    <div className="space-y-4">
                       <div>
                         <label className="block text-xs font-semibold text-gray-500 mb-1">Option 1: Upload from Device</label>
                         <label className="flex items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 transition">
                            <div className="flex flex-col items-center pt-2 pb-3">
                                <Upload className="w-6 h-6 text-gray-400 mb-1" />
                                <p className="text-xs text-gray-500">Click to upload image</p>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                        </label>
                       </div>
                       
                       <div className="text-center text-xs text-gray-400 font-medium">- OR -</div>

                       <div>
                         <label className="block text-xs font-semibold text-gray-500 mb-1">Option 2: Image URL</label>
                         <div className="flex gap-2">
                           <input 
                              type="url" 
                              placeholder="https://example.com/image.jpg"
                              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-brand-blue focus:border-brand-blue"
                              value={newImageUrl}
                              onChange={(e) => setNewImageUrl(e.target.value)}
                           />
                           <button 
                             onClick={handleUrlSubmit}
                             disabled={!newImageUrl}
                             className="bg-brand-blue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                           >
                             Add
                           </button>
                         </div>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;