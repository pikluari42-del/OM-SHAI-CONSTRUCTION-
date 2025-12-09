

import React, { useState, useMemo } from 'react';
import { MapPin, Clock, IndianRupee, Phone, MessageCircle, Filter, Briefcase, Globe, Plane, Share2, X, Check, RotateCcw } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';
import { COUNTRIES, Job } from '../types';

interface JobBoardProps {
  onApplyClick: () => void; // Redirect to login if not auth
}

const JobBoard: React.FC<JobBoardProps> = ({ onApplyClick }) => {
  const { jobs, applyForJob, getMyApplications } = useJobs();
  const { user, isAuthenticated, workerProfile } = useAuth();
  const { t, language } = useLanguage();
  const { serviceCategories } = useSite();
  
  // Live Filter States
  const [viewScope, setViewScope] = useState<'Domestic' | 'International'>('Domestic');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterExperience, setFilterExperience] = useState('All');
  const [filterSalary, setFilterSalary] = useState('All');
  const [filterCountry, setFilterCountry] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mobile UI State
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<'Category' | 'Type' | 'Experience' | 'Salary' | 'Country'>('Category');

  // Mobile Temporary Filter States (Deferred Application)
  const [tempFilters, setTempFilters] = useState({
    category: 'All',
    type: 'All',
    experience: 'All',
    salary: 'All',
    country: 'All'
  });

  const myApplications = user ? getMyApplications(user.id) : [];

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const scopeMatch = job.jobScope === viewScope;
      
      // Filter matching works on internal English name (job.category)
      const catMatch = filterCategory === 'All' || job.category === filterCategory;
      const typeMatch = filterType === 'All' || job.type === filterType;
      
      // Partial match for experience since it is now free text
      const expMatch = filterExperience === 'All' || (job.experienceLevel && job.experienceLevel.toLowerCase().includes(filterExperience.toLowerCase()));
      
      let countryMatch = true;
      if (viewScope === 'International') {
        countryMatch = filterCountry === 'All' || job.location.includes(filterCountry);
      }

      // Salary Filter Logic
      let salaryMatch = true;
      if (filterSalary !== 'All') {
          // Extract number from string (e.g., "₹600 / Day" -> 600, "2000 AED" -> 2000)
          const salaryNum = parseInt(job.salary.replace(/[^0-9]/g, '')) || 0;
          const isDaily = job.type === 'Daily';
          // Monthly or Contract usually implies higher values or monthly rates
          const isMonthly = job.type === 'Monthly' || job.type === 'Contract';

          switch (filterSalary) {
              case 'daily_under_500':
                  salaryMatch = isDaily && salaryNum < 500;
                  break;
              case 'daily_500_1000':
                  salaryMatch = isDaily && salaryNum >= 500 && salaryNum <= 1000;
                  break;
              case 'daily_above_1000':
                  salaryMatch = isDaily && salaryNum > 1000;
                  break;
              case 'monthly_under_15k':
                  salaryMatch = (isMonthly) && salaryNum < 15000;
                  break;
              case 'monthly_15k_30k':
                  salaryMatch = (isMonthly) && salaryNum >= 15000 && salaryNum <= 30000;
                  break;
              case 'monthly_above_30k':
                  salaryMatch = (isMonthly) && salaryNum > 30000;
                  break;
              default:
                  salaryMatch = true;
          }
      }

      const searchMatch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      return scopeMatch && catMatch && typeMatch && expMatch && countryMatch && searchMatch && salaryMatch;
    });
  }, [jobs, viewScope, filterCategory, filterType, filterExperience, filterCountry, filterSalary, searchTerm]);

  const handleApply = (jobId: string) => {
    if (!isAuthenticated || !user) {
      onApplyClick();
      return;
    }
    if (user.role !== 'worker') {
      alert("Only workers can apply for jobs.");
      return;
    }
    const contact = workerProfile?.phone || user.email;
    applyForJob(jobId, user.id, user.name, contact);
    alert("Application submitted successfully! Employer has been notified.");
  };

  const hasApplied = (jobId: string) => {
    return myApplications.some(app => app.jobId === jobId);
  };

  const getTranslatedCategory = (catName: string) => {
    const category = serviceCategories.find(c => c.name === catName);
    if (!category) return catName;

    if (language === 'hi' && category.translations?.hi) {
        return category.translations.hi.name || category.name;
    } else if (language === 'bn' && category.translations?.bn) {
        return category.translations.bn.name || category.name;
    }
    return category.name;
  };

  const getJobContent = (job: Job) => {
      if (language === 'hi' && job.translations?.hi?.title) {
          return {
              title: job.translations.hi.title,
              description: job.translations.hi.description,
              location: job.translations.hi.location || job.location
          };
      }
      if (language === 'bn' && job.translations?.bn?.title) {
          return {
              title: job.translations.bn.title,
              description: job.translations.bn.description,
              location: job.translations.bn.location || job.location
          };
      }
      return { title: job.title, description: job.description, location: job.location };
  };

  const handleShare = async (job: Job) => {
    const content = getJobContent(job);
    const shareText = `🔥 Job Opportunity: ${content.title}\n📍 Location: ${content.location}\n💰 Salary: ${job.salary}\n📝 ${content.description}\n\nApply via LaborLink: ${window.location.origin}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          text: shareText,
          url: window.location.origin
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Job details copied to clipboard! You can paste it in WhatsApp/Facebook.');
    }
  };

  // Clear all filters (Desktop)
  const clearAllFilters = () => {
      setFilterCategory('All'); 
      setFilterType('All'); 
      setSearchTerm(''); 
      setFilterExperience('All'); 
      setFilterCountry('All');
      setFilterSalary('All');
  };

  // Open Mobile Modal: Sync Temp State with Live State
  const handleOpenMobileFilters = () => {
    setTempFilters({
        category: filterCategory,
        type: filterType,
        experience: filterExperience,
        salary: filterSalary,
        country: filterCountry
    });
    setShowMobileFilters(true);
  };

  // Apply Mobile Filters: Sync Temp State to Live State
  const handleApplyMobileFilters = () => {
    setFilterCategory(tempFilters.category);
    setFilterType(tempFilters.type);
    setFilterExperience(tempFilters.experience);
    setFilterSalary(tempFilters.salary);
    setFilterCountry(tempFilters.country);
    setShowMobileFilters(false);
  };

  // Clear Mobile Filters: Reset Temp State
  const handleClearMobileFilters = () => {
    setTempFilters({
        category: 'All',
        type: 'All',
        experience: 'All',
        salary: 'All',
        country: 'All'
    });
  };

  // Helper to update temp state
  const updateTempFilter = (key: keyof typeof tempFilters, value: string) => {
      setTempFilters(prev => ({ ...prev, [key]: value }));
  };

  const isAnyFilterActive = filterCategory !== 'All' || filterType !== 'All' || filterExperience !== 'All' || filterSalary !== 'All' || (viewScope === 'International' && filterCountry !== 'All') || searchTerm !== '';

  // --- Mobile Filter Modal Component Logic (Using Temp State) ---
  const renderMobileFilterOptions = () => {
    switch(activeFilterTab) {
      case 'Category':
        return (
          <div className="space-y-1">
            <label className="flex items-center p-3 rounded hover:bg-gray-50 cursor-pointer">
              <input 
                type="radio" 
                name="mobileCategory" 
                checked={tempFilters.category === 'All'}
                onChange={() => updateTempFilter('category', 'All')}
                className="w-5 h-5 text-brand-orange focus:ring-brand-orange"
              />
              <span className="ml-3 text-gray-700">All Categories</span>
            </label>
            {serviceCategories.map(cat => {
                let displayName = cat.name;
                if (language === 'hi' && cat.translations?.hi?.name) displayName = cat.translations.hi.name;
                if (language === 'bn' && cat.translations?.bn?.name) displayName = cat.translations.bn.name;
                return (
                  <label key={cat.id} className="flex items-center p-3 rounded hover:bg-gray-50 cursor-pointer">
                    <input 
                      type="radio" 
                      name="mobileCategory" 
                      checked={tempFilters.category === cat.name}
                      onChange={() => updateTempFilter('category', cat.name)}
                      className="w-5 h-5 text-brand-orange focus:ring-brand-orange"
                    />
                    <span className="ml-3 text-gray-700">{displayName}</span>
                  </label>
                );
            })}
          </div>
        );
      case 'Type':
        return (
          <div className="space-y-1">
            {['All', 'Daily', 'Monthly', 'Contract'].map((type) => (
              <label key={type} className="flex items-center p-3 rounded hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="mobileType" 
                  checked={tempFilters.type === type}
                  onChange={() => updateTempFilter('type', type)}
                  className="w-5 h-5 text-brand-orange focus:ring-brand-orange"
                />
                <span className="ml-3 text-gray-700">{type === 'All' ? 'All Job Types' : type}</span>
              </label>
            ))}
          </div>
        );
      case 'Experience':
         return (
          <div className="space-y-1">
            {['All', 'Fresher', '1-3 Years', '3+ Years'].map((exp) => (
              <label key={exp} className="flex items-center p-3 rounded hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="mobileExp" 
                  checked={tempFilters.experience === exp}
                  onChange={() => updateTempFilter('experience', exp)}
                  className="w-5 h-5 text-brand-orange focus:ring-brand-orange"
                />
                <span className="ml-3 text-gray-700">{exp === 'All' ? 'Any Experience' : exp}</span>
              </label>
            ))}
          </div>
        );
      case 'Salary':
        return (
          <div className="space-y-3">
             <label className="flex items-center p-3 rounded hover:bg-gray-50 cursor-pointer bg-gray-50">
                <input 
                  type="radio" 
                  name="mobileSalary" 
                  checked={tempFilters.salary === 'All'}
                  onChange={() => updateTempFilter('salary', 'All')}
                  className="w-5 h-5 text-brand-orange focus:ring-brand-orange"
                />
                <span className="ml-3 text-gray-700 font-medium">Any Salary</span>
             </label>
             
             <p className="text-xs font-bold text-gray-400 uppercase px-3">Daily Wages</p>
             {[
                { val: 'daily_under_500', label: '< ₹500' },
                { val: 'daily_500_1000', label: '₹500 - ₹1000' },
                { val: 'daily_above_1000', label: '> ₹1000' }
             ].map(opt => (
                <label key={opt.val} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                  <input type="radio" name="mobileSalary" checked={tempFilters.salary === opt.val} onChange={() => updateTempFilter('salary', opt.val)} className="w-5 h-5 text-brand-orange focus:ring-brand-orange" />
                  <span className="ml-3 text-gray-700">{opt.label}</span>
                </label>
             ))}

            <p className="text-xs font-bold text-gray-400 uppercase px-3 mt-4">Monthly Salary</p>
             {[
                { val: 'monthly_under_15k', label: '< 15k' },
                { val: 'monthly_15k_30k', label: '15k - 30k' },
                { val: 'monthly_above_30k', label: '> 30k' }
             ].map(opt => (
                <label key={opt.val} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                  <input type="radio" name="mobileSalary" checked={tempFilters.salary === opt.val} onChange={() => updateTempFilter('salary', opt.val)} className="w-5 h-5 text-brand-orange focus:ring-brand-orange" />
                  <span className="ml-3 text-gray-700">{opt.label}</span>
                </label>
             ))}
          </div>
        );
      case 'Country':
        return (
          <div className="space-y-1">
             <label className="flex items-center p-3 rounded hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="mobileCountry" 
                  checked={tempFilters.country === 'All'}
                  onChange={() => updateTempFilter('country', 'All')}
                  className="w-5 h-5 text-brand-orange focus:ring-brand-orange"
                />
                <span className="ml-3 text-gray-700">All Countries</span>
             </label>
             {COUNTRIES.filter(c => c !== 'India').map(c => (
                <label key={c} className="flex items-center p-3 rounded hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="radio" 
                    name="mobileCountry" 
                    checked={tempFilters.country === c}
                    onChange={() => updateTempFilter('country', c)}
                    className="w-5 h-5 text-brand-orange focus:ring-brand-orange"
                  />
                  <span className="ml-3 text-gray-700">{c}</span>
                </label>
             ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="jobs" className="py-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Tabs */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.latestJobs}</h2>
          
          <div className="inline-flex bg-white p-1 rounded-full shadow-md border border-gray-200">
             <button 
               onClick={() => { setViewScope('Domestic'); setFilterCountry('All'); }}
               className={`px-8 py-3 rounded-full text-sm font-bold transition-all flex items-center ${
                 viewScope === 'Domestic' 
                 ? 'bg-brand-blue text-white shadow-sm' 
                 : 'text-gray-600 hover:bg-gray-50'
               }`}
             >
               <Briefcase size={16} className="mr-2" /> Domestic Jobs
             </button>
             <button 
               onClick={() => setViewScope('International')}
               className={`px-8 py-3 rounded-full text-sm font-bold transition-all flex items-center ${
                 viewScope === 'International' 
                 ? 'bg-brand-blue text-white shadow-sm' 
                 : 'text-gray-600 hover:bg-gray-50'
               }`}
             >
               <Globe size={16} className="mr-2" /> International Jobs
             </button>
          </div>
        </div>

        {/* Filters Bar - Desktop Only for full layout */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md mb-8">
           <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              
              {/* Search & Mobile Toggle */}
              <div className="col-span-1 md:col-span-1 flex gap-2">
                 <div className="relative flex-grow">
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
                 {/* Mobile Filter Toggle Button */}
                 <button
                    onClick={handleOpenMobileFilters}
                    className={`md:hidden p-3 rounded-lg border border-gray-300 bg-white text-gray-600 transition-colors relative`}
                    aria-label="Toggle Filters"
                 >
                    <Filter size={20} />
                    {(filterCategory !== 'All' || filterType !== 'All' || filterSalary !== 'All') && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-brand-orange rounded-full"></span>
                    )}
                 </button>
              </div>
              
              {/* Desktop Filter Dropdowns */}
              <div className="hidden md:grid col-span-5 grid-cols-5 gap-4">
                  <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg outline-none w-full"
                  >
                    <option value="All">All Categories</option>
                    {serviceCategories.map(cat => {
                        let displayName = cat.name;
                        if (language === 'hi' && cat.translations?.hi?.name) displayName = cat.translations.hi.name;
                        if (language === 'bn' && cat.translations?.bn?.name) displayName = cat.translations.bn.name;
                        return <option key={cat.id} value={cat.name}>{displayName}</option>;
                    })}
                  </select>

                  <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg outline-none w-full"
                  >
                    <option value="All">All Job Types</option>
                    <option value="Daily">Daily Wage</option>
                    <option value="Monthly">Monthly Salary</option>
                    <option value="Contract">Contract</option>
                  </select>

                  <select 
                    value={filterExperience}
                    onChange={(e) => setFilterExperience(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg outline-none w-full"
                  >
                    <option value="All">Any Experience</option>
                    <option value="Fresher">Fresher</option>
                    <option value="1-3 Years">1-3 Years</option>
                    <option value="3+ Years">3+ Years</option>
                  </select>

                  <select 
                    value={filterSalary}
                    onChange={(e) => setFilterSalary(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg outline-none w-full"
                  >
                    <option value="All">Any Salary</option>
                    <optgroup label="Daily Wages (₹)">
                        <option value="daily_under_500">&lt; ₹500</option>
                        <option value="daily_500_1000">₹500 - ₹1000</option>
                        <option value="daily_above_1000">&gt; ₹1000</option>
                    </optgroup>
                    <optgroup label="Monthly (₹)">
                        <option value="monthly_under_15k">&lt; 15k</option>
                        <option value="monthly_15k_30k">15k - 30k</option>
                        <option value="monthly_above_30k">&gt; 30k</option>
                    </optgroup>
                  </select>
                  
                  {viewScope === 'International' ? (
                    <select 
                        value={filterCountry}
                        onChange={(e) => setFilterCountry(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg outline-none w-full"
                    >
                        <option value="All">All Countries</option>
                        {COUNTRIES.filter(c => c !== 'India').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  ) : (
                    <div className="hidden md:flex items-center justify-center">
                       {isAnyFilterActive ? (
                         <button 
                           onClick={clearAllFilters}
                           className="flex items-center text-sm font-bold text-red-500 hover:text-red-700 bg-red-50 px-3 py-2 rounded-lg transition"
                         >
                            <RotateCcw size={14} className="mr-2"/> Clear
                         </button>
                       ) : (
                         <span className="text-sm text-gray-500 font-medium whitespace-nowrap">{filteredJobs.length} Jobs</span>
                       )}
                    </div>
                  )}
              </div>
           </div>
           
           {/* Mobile Only: Jobs Found Count */}
           <div className="md:hidden mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">{filteredJobs.length} Jobs Found</span>
                {isAnyFilterActive && (
                    <button onClick={clearAllFilters} className="text-xs text-red-500 font-bold uppercase">Clear Filters</button>
                )}
           </div>
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => {
              const { title, description, location: displayLocation } = getJobContent(job);

              return (
                <div key={job.id} className="bg-white rounded-xl shadow hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col h-full relative group">
                    <div className="absolute top-0 right-0 z-10 flex">
                        {job.isUrgent && (
                            <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 shadow-sm rounded-bl-lg">
                                URGENT
                            </div>
                        )}
                        {job.isNew && (
                            <div className={`bg-brand-orange text-white text-xs font-bold px-3 py-1 shadow-sm ${!job.isUrgent ? 'rounded-bl-lg' : ''}`}>
                                NEW
                            </div>
                        )}
                    </div>
                    
                    <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full uppercase tracking-wider">
                        {getTranslatedCategory(job.category)}
                        </span>
                        {job.jobScope === 'International' && (
                        <span className="flex items-center text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">
                            <Plane size={12} className="mr-1" /> Int'l
                        </span>
                        )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">{description}</p>
                    
                    <div className="space-y-2 mt-auto text-gray-600 text-sm">
                        <div className="flex items-center">
                        <MapPin size={16} className="text-brand-yellow mr-2 flex-shrink-0" />
                        {displayLocation}
                        </div>
                        <div className="flex items-center">
                        <IndianRupee size={16} className="text-green-600 mr-2 flex-shrink-0" />
                        <span className="font-bold text-green-700">{job.salary}</span>
                        </div>
                        <div className="flex items-center">
                        <Clock size={16} className="text-brand-orange mr-2 flex-shrink-0" />
                        {job.type} • {job.workersRequired} Vacancies
                        </div>
                        {job.experienceLevel && (
                            <div className="flex items-center text-gray-500 text-xs">
                                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded mr-2">Exp: {job.experienceLevel}</span>
                            </div>
                        )}
                    </div>

                    {job.jobScope === 'International' && job.visaType && (
                        <div className="mt-3 pt-3 border-t border-dashed border-gray-200 text-xs text-gray-500">
                            <span className="font-semibold text-gray-700">Benefits:</span> Visa: {job.visaType} 
                            {job.accommodation && " • Accommodation"}
                        </div>
                    )}
                    </div>

                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-3">
                    {isAuthenticated && user?.role === 'worker' ? (
                        <button 
                        onClick={() => handleApply(job.id)}
                        disabled={hasApplied(job.id)}
                        className={`w-full py-2.5 rounded-lg font-bold transition shadow-sm ${
                            hasApplied(job.id) 
                            ? 'bg-green-100 text-green-700 cursor-default'
                            : 'bg-brand-blue text-white hover:bg-gray-800'
                        }`}
                        >
                        {hasApplied(job.id) ? 'Applied Successfully' : 'Apply Now'}
                        </button>
                    ) : (
                        <button 
                        onClick={() => handleApply(job.id)}
                        className="w-full bg-brand-blue text-white py-2.5 rounded-lg font-bold hover:bg-gray-800 transition shadow-sm"
                        >
                        Apply Now
                        </button>
                    )}
                    
                    <div className="flex gap-2">
                        <a href={`tel:${job.contact}`} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold flex items-center justify-center hover:bg-gray-100 text-sm">
                        <Phone size={14} className="mr-1" /> Call
                        </a>
                        <a href={`https://wa.me/${job.contact.replace(/\D/g,'')}`} className="flex-1 border border-green-200 text-green-600 bg-green-50 py-2 rounded-lg font-semibold flex items-center justify-center hover:bg-green-100 text-sm">
                        <MessageCircle size={14} className="mr-1" /> Chat
                        </a>
                        <button 
                            onClick={() => handleShare(job)}
                            className="px-3 border border-gray-200 text-gray-600 bg-gray-50 py-2 rounded-lg font-semibold flex items-center justify-center hover:bg-gray-100 transition"
                            title="Share"
                        >
                            <Share2 size={18} />
                        </button>
                    </div>
                    </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 text-gray-500">
              <p className="text-xl">No jobs found matching your filters.</p>
              <button 
                onClick={clearAllFilters}
                className="mt-4 text-brand-blue font-bold hover:underline"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- MOBILE FILTER SPLIT LAYOUT MODAL --- */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col md:hidden animate-fade-in">
           {/* Header */}
           <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                 <Filter size={18} className="mr-2 text-brand-orange"/> Filters
              </h3>
              <button onClick={() => setShowMobileFilters(false)} className="text-gray-500 hover:text-black">
                 <X size={24} />
              </button>
           </div>
           
           {/* Split View Body */}
           <div className="flex flex-1 overflow-hidden">
              {/* LEFT: Categories */}
              <div className="w-1/3 bg-gray-100 border-r border-gray-200 overflow-y-auto">
                 {['Category', 'Type', 'Salary', 'Experience', ...(viewScope === 'International' ? ['Country'] : [])].map((tab) => {
                     const isActive = activeFilterTab === tab;
                     // Count active filters in this category (using temp state)
                     let hasValue = false;
                     if(tab === 'Category' && tempFilters.category !== 'All') hasValue = true;
                     if(tab === 'Type' && tempFilters.type !== 'All') hasValue = true;
                     if(tab === 'Salary' && tempFilters.salary !== 'All') hasValue = true;
                     if(tab === 'Experience' && tempFilters.experience !== 'All') hasValue = true;
                     if(tab === 'Country' && tempFilters.country !== 'All') hasValue = true;

                     return (
                        <button
                           key={tab}
                           onClick={() => setActiveFilterTab(tab as any)}
                           className={`w-full text-left px-3 py-4 text-sm font-medium border-b border-gray-200 flex items-center justify-between ${
                               isActive ? 'bg-white text-brand-blue border-l-4 border-l-brand-blue' : 'text-gray-600'
                           }`}
                        >
                           <span>{tab}</span>
                           {hasValue && <div className="w-2 h-2 rounded-full bg-brand-orange"></div>}
                        </button>
                     );
                 })}
              </div>

              {/* RIGHT: Options */}
              <div className="w-2/3 bg-white overflow-y-auto p-2">
                 {renderMobileFilterOptions()}
              </div>
           </div>
           
           {/* Footer */}
           <div className="p-4 border-t border-gray-200 flex gap-2 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
              <button 
                onClick={handleClearMobileFilters}
                className="flex-1 py-3 text-gray-700 font-bold border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
              <button 
                onClick={handleApplyMobileFilters}
                className="flex-1 py-3 bg-brand-orange text-white font-bold rounded-lg shadow hover:bg-orange-700 transition-colors"
              >
                Apply
              </button>
           </div>
        </div>
      )}

    </section>
  );
};

export default JobBoard;