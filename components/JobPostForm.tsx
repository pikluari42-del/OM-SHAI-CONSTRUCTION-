

import React, { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Job, COUNTRIES, JobTranslation } from '../types';
import { useJobs } from '../context/JobContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';
import { generateJobDescription } from '../services/geminiService';

interface JobPostFormProps {
  onSuccess: () => void;
}

type LangTab = 'en' | 'hi' | 'bn';

const JobPostForm: React.FC<JobPostFormProps> = ({ onSuccess }) => {
  const { addJob, isLoading } = useJobs();
  const { user } = useAuth();
  const { language } = useLanguage();
  const { serviceCategories } = useSite();
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [activeTab, setActiveTab] = useState<LangTab>('en');

  // We keep main fields in root, and translations separate in state
  const [formData, setFormData] = useState<Partial<Job>>({
    title: '',
    location: '',
    salary: '',
    type: 'Daily',
    category: serviceCategories[0]?.name || 'Helper',
    description: '',
    contact: '+91 ',
    jobScope: 'Domestic',
    workersRequired: 1,
    visaType: '',
    accommodation: false,
    experienceLevel: '',
    isUrgent: false
  });

  const [translations, setTranslations] = useState<{
    hi: JobTranslation;
    bn: JobTranslation;
  }>({
    hi: { title: '', description: '', location: '' },
    bn: { title: '', description: '', location: '' }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addJob({
      ...formData as any,
      employerId: user?.id || 'admin',
      translations: {
        hi: translations.hi.title ? translations.hi : undefined,
        bn: translations.bn.title ? translations.bn : undefined,
      }
    });
    onSuccess();
  };

  const handleGenerateDescription = async () => {
    // Generate for currently active tab language
    const currentTitle = activeTab === 'en' ? formData.title : translations[activeTab].title;
    if (!currentTitle) return;
    
    setIsGeneratingAI(true);
    const desc = await generateJobDescription(currentTitle, formData.category || '', activeTab);
    
    if (activeTab === 'en') {
        setFormData(prev => ({ ...prev, description: desc }));
    } else {
        setTranslations(prev => ({
            ...prev,
            [activeTab]: { ...prev[activeTab], description: desc }
        }));
    }
    setIsGeneratingAI(false);
  };

  const handleTranslationChange = (field: 'title' | 'description' | 'location', value: string) => {
      if (activeTab === 'en') {
          setFormData(prev => ({ ...prev, [field]: value }));
      } else {
          setTranslations(prev => ({
              ...prev,
              [activeTab]: { ...prev[activeTab], [field]: value }
          }));
      }
  };

  const getCurrentValue = (field: 'title' | 'description' | 'location') => {
      if (activeTab === 'en') return formData[field] || '';
      return translations[activeTab][field];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      
      {/* Scope Selector */}
      <div className="flex space-x-4 mb-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input 
            type="radio" 
            name="jobScope"
            checked={formData.jobScope === 'Domestic'}
            onChange={() => setFormData({...formData, jobScope: 'Domestic', location: ''})}
            className="text-brand-orange focus:ring-brand-orange"
          />
          <span className="font-bold">Domestic (India)</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input 
            type="radio" 
            name="jobScope"
            checked={formData.jobScope === 'International'}
            onChange={() => setFormData({...formData, jobScope: 'International', location: ''})}
            className="text-brand-orange focus:ring-brand-orange"
          />
          <span className="font-bold text-brand-blue">International</span>
        </label>
      </div>

      {/* Language Tabs for Content */}
      <div className="flex border-b border-gray-200 mb-4">
        {(['en', 'hi', 'bn'] as LangTab[]).map(lang => (
            <button
                key={lang}
                type="button"
                onClick={() => setActiveTab(lang)}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    activeTab === lang 
                    ? 'text-brand-orange border-b-2 border-brand-orange bg-orange-50/50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
                {lang === 'en' ? 'English (Default)' : lang === 'hi' ? 'Hindi' : 'Bengali'}
            </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Title ({activeTab.toUpperCase()})
            {activeTab !== 'en' && <span className="text-xs text-gray-400 font-normal ml-1">(Optional)</span>}
          </label>
          <input 
            type="text" 
            required={activeTab === 'en'}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-blue"
            value={getCurrentValue('title')}
            onChange={e => handleTranslationChange('title', e.target.value)}
            placeholder={activeTab === 'en' ? "e.g. Helper Needed" : "Translated Title"}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select 
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-blue"
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
          >
            {serviceCategories.map(cat => {
                 let displayName = cat.name;
                 if (language === 'hi' && cat.translations?.hi?.name) displayName = cat.translations.hi.name;
                 if (language === 'bn' && cat.translations?.bn?.name) displayName = cat.translations.bn.name;
                 return <option key={cat.id} value={cat.name}>{displayName}</option>;
            })}
          </select>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
             Job Description ({activeTab.toUpperCase()})
             {activeTab !== 'en' && <span className="text-xs text-gray-400 font-normal ml-1">(Optional)</span>}
          </label>
          <button 
            type="button" 
            onClick={handleGenerateDescription}
            disabled={isGeneratingAI || !getCurrentValue('title')}
            className="text-xs flex items-center text-purple-600 hover:text-purple-800 font-bold disabled:opacity-50"
          >
            {isGeneratingAI ? <Loader2 size={12} className="animate-spin mr-1"/> : <Sparkles size={12} className="mr-1"/>}
            AI Generate ({activeTab.toUpperCase()})
          </button>
        </div>
        <textarea 
          required={activeTab === 'en'}
          rows={3}
          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-blue"
          value={getCurrentValue('description')}
          onChange={e => handleTranslationChange('description', e.target.value)}
          placeholder={activeTab === 'en' ? "Details about the job..." : "Translated Description"}
        />
      </div>

      <div className="border-t border-gray-100 pt-4 mt-2">
         <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Common Details</h4>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
            <label className="block text-sm font-medium text-gray-700">
                {formData.jobScope === 'International' ? 'Target Country' : 'City/State'}
                {activeTab !== 'en' && <span className="text-xs text-gray-400 font-normal ml-1">({activeTab.toUpperCase()})</span>}
            </label>
            
            {/* Logic: If International AND English tab, show ComboBox. Otherwise standard input. */}
            {formData.jobScope === 'International' && activeTab === 'en' ? (
                <>
                    <input 
                        list="countries"
                        className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                        value={getCurrentValue('location')}
                        onChange={e => handleTranslationChange('location', e.target.value)}
                        placeholder="Select or Type Country"
                    />
                    <datalist id="countries">
                        {COUNTRIES.filter(c => c !== 'India').map(c => <option key={c} value={c} />)}
                    </datalist>
                </>
            ) : (
                <input 
                    type="text" 
                    placeholder={activeTab === 'en' ? "e.g. Mumbai" : "Translated Location Name"} 
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                    value={getCurrentValue('location')}
                    onChange={e => handleTranslationChange('location', e.target.value)}
                />
            )}
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700">Salary</label>
            <input 
                type="text" 
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-blue"
                placeholder={formData.jobScope === 'International' ? 'e.g. 2000 AED' : 'e.g. ₹500/Day'}
                value={formData.salary}
                onChange={e => setFormData({...formData, salary: e.target.value})}
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700">Workers Required</label>
            <input 
                type="number" 
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                value={formData.workersRequired}
                onChange={e => setFormData({...formData, workersRequired: parseInt(e.target.value)})}
            />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Experience Level</label>
                <input
                    type="text"
                    placeholder="e.g. Fresher / 2 Years / Gulf Return"
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                    value={formData.experienceLevel}
                    onChange={e => setFormData({...formData, experienceLevel: e.target.value})}
                />
            </div>
            {formData.jobScope === 'International' && (
            <>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Visa Type</label>
                    <input 
                        type="text"
                        placeholder="e.g. Employment Visa / Free Visa"
                        className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                        value={formData.visaType}
                        onChange={e => setFormData({...formData, visaType: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Contract Period</label>
                    <input 
                    type="text" 
                    placeholder="e.g. 2 Years"
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
                    value={formData.contractPeriod}
                    onChange={e => setFormData({...formData, contractPeriod: e.target.value})}
                    />
                </div>
            </>
            )}
        </div>

        <div className="flex flex-wrap items-center mt-4 gap-6">
            {formData.jobScope === 'International' && (
                <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                    type="checkbox"
                    checked={formData.accommodation}
                    onChange={e => setFormData({...formData, accommodation: e.target.checked})}
                    className="rounded text-brand-blue"
                />
                <span className="text-sm font-medium text-gray-700">Accommodation Provided</span>
                </label>
            )}

            <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                    type="checkbox"
                    checked={formData.isUrgent || false}
                    onChange={e => setFormData({...formData, isUrgent: e.target.checked})}
                    className="rounded text-red-600 focus:ring-red-600"
                />
                <span className="text-sm font-bold text-red-600">Urgent Hiring</span>
            </label>
        </div>

        <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input 
            type="text" 
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-blue"
            value={formData.contact}
            onChange={e => setFormData({...formData, contact: e.target.value})}
            />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-orange text-base font-medium text-white hover:bg-orange-700 focus:outline-none disabled:opacity-50"
        >
          {isLoading ? 'Posting...' : 'Post Job Now'}
        </button>
      </div>
    </form>
  );
};

export default JobPostForm;