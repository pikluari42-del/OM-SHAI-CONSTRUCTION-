import React, { useState, useEffect } from 'react';
import { WorkerProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';
import { Upload, Pencil } from 'lucide-react';

interface ProfileEditorProps {
  onComplete: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ onComplete }) => {
  const { user, workerProfile, updateWorkerProfile } = useAuth();
  const { serviceCategories } = useSite();

  const [formData, setFormData] = useState<WorkerProfile>({
    userId: user?.id || '',
    phone: '',
    dob: '',
    gender: 'Male',
    address: '',
    city: '',
    state: '',
    country: 'India',
    skills: [],
    experienceYears: 0,
    education: '10th Pass',
    languages: [],
    preferredLocation: [],
    documents: {}
  });

  useEffect(() => {
    if (workerProfile) {
      setFormData(workerProfile);
    }
  }, [workerProfile]);

  const handleChange = (field: keyof WorkerProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, languages: val.split(',').map(l => l.trim()) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkerProfile(formData);
    onComplete();
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in py-8">
      {/* Header Section */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Worker Registration</h2>
        <p className="text-gray-500 text-sm mt-1">Create your profile to find high-paying domestic and international jobs.</p>
      </div>

      {/* Form Container */}
      <div className="bg-white shadow-xl rounded-lg border-t-4 border-brand-yellow p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Personal Information */}
          <div>
            <h3 className="text-md font-bold text-brand-blue mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={user?.name || ''} 
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-500 bg-gray-50 focus:outline-none"
                  placeholder="e.g. Rahul Kumar"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none"
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email (Optional)</label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled={!!user?.email}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-500 bg-gray-50 focus:outline-none"
                  placeholder="email@example.com"
                />
              </div>

              {/* DOB */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Date of Birth</label>
                <input 
                  type="date" 
                  value={formData.dob}
                  onChange={e => handleChange('dob', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none text-gray-600"
                />
              </div>

              {/* Gender */}
              <div>
                 <label className="block text-xs font-semibold text-gray-600 mb-1">Gender</label>
                 <select 
                    value={formData.gender}
                    onChange={e => handleChange('gender', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none bg-white"
                 >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                 </select>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Current Address (Village, City, State)</label>
                <div className="relative">
                  <input 
                    type="text"
                    value={formData.address}
                    onChange={e => handleChange('address', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none pr-8"
                    placeholder="e.g. 123 Main St, New Delhi"
                  />
                  <Pencil size={14} className="absolute right-3 top-3 text-gray-400" />
                </div>
              </div>

            </div>
          </div>

          {/* Work Experience & Skills */}
          <div className="pt-2">
            <h3 className="text-md font-bold text-brand-blue mb-4">Work Experience & Skills</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              
              {/* Primary Skill */}
              <div>
                 <label className="block text-xs font-semibold text-gray-600 mb-1">Primary Skill / Job Role</label>
                 <select 
                    value={formData.skills[0] || ''}
                    onChange={(e) => setFormData(prev => ({...prev, skills: [e.target.value]}))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none bg-white"
                 >
                    <option value="">Select a skill..</option>
                    {serviceCategories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                 </select>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Experience (Years)</label>
                <input 
                  type="number"
                  min="0"
                  value={formData.experienceYears || ''}
                  onChange={e => handleChange('experienceYears', parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none"
                  placeholder="e.g. 5"
                />
              </div>

              {/* Education */}
              <div>
                 <label className="block text-xs font-semibold text-gray-600 mb-1">Education Level</label>
                 <select 
                    value={formData.education}
                    onChange={e => handleChange('education', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none bg-white"
                 >
                    <option value="">Select Education...</option>
                    <option value="Below 10th">Below 10th</option>
                    <option value="10th Pass">10th Pass</option>
                    <option value="12th Pass">12th Pass</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Diploma/ITI">Diploma / ITI</option>
                 </select>
              </div>

              {/* Languages */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Languages Known</label>
                <input 
                  type="text"
                  value={formData.languages.join(', ')}
                  onChange={handleLanguageChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none"
                  placeholder="e.g. Hindi, English, Bengali"
                />
              </div>

            </div>
          </div>

          {/* Documents */}
          <div className="pt-2">
            <h3 className="text-md font-bold text-brand-blue mb-4">Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               
               {/* Upload Photo */}
               <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
                  <Upload className="text-gray-400 mb-2" size={24} />
                  <span className="text-sm font-semibold text-gray-500">Upload Photo</span>
                  <span className="text-xs text-gray-400 mt-1">JPG, PNG up to 2MB</span>
                  <input type="file" className="hidden" accept="image/*" />
               </label>

               {/* Upload ID */}
               <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
                  <Upload className="text-gray-400 mb-2" size={24} />
                  <span className="text-sm font-semibold text-gray-500">Upload Aadhaar / ID</span>
                  <span className="text-xs text-gray-400 mt-1">PDF, JPG up to 5MB</span>
                  <input type="file" className="hidden" accept="image/*,application/pdf" />
               </label>

            </div>
          </div>

          {/* Footer Button */}
          <div className="pt-4">
             <button 
               type="submit"
               className="w-full bg-[#0f172a] text-white font-bold py-3 rounded-md hover:bg-gray-800 transition shadow-lg"
             >
               Register Now
             </button>
             <p className="text-center text-xs text-gray-500 mt-4">
               By registering, you agree to our Terms & Conditions and Privacy Policy.
             </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProfileEditor;