import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import { useSite } from '../context/SiteContext';
import { useLanguage } from '../context/LanguageContext';
import ProfileEditor from './ProfileEditor';
import JobPostForm from './JobPostForm';
import { 
  LayoutDashboard, UserCircle, Search, FileText, Bookmark, Bell, MessageSquare, 
  HelpCircle, Star, Info, LogOut, Menu, X, PlusCircle, Briefcase, Settings, 
  Users, Phone, PieChart, Image as ImageIcon, Upload, Pencil, Trash2, Megaphone, ChevronRight
} from 'lucide-react';
import { CategoryTranslation } from '../types';

interface DashboardProps {
  onChangeView: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onChangeView }) => {
  const { user, logout, workerProfile, allUsers } = useAuth();
  const { jobs, applications, deleteJob, getMyApplications, getJobApplications } = useJobs();
  const { 
    serviceCategories, addServiceCategory, updateServiceCategory, deleteServiceCategory, 
    notificationText, updateNotificationText,
    heroImages, addHeroImage, removeHeroImage 
  } = useSite();
  const { language, setLanguage } = useLanguage();
  
  // UI State
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedJobIdForApplicants, setSelectedJobIdForApplicants] = useState<string | null>(null);

  // Admin Service Form State
  const [serviceLangTab, setServiceLangTab] = useState<'en' | 'hi' | 'bn'>('en');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  
  const [catFormData, setCatFormData] = useState<{
    en: CategoryTranslation;
    hi: CategoryTranslation;
    bn: CategoryTranslation;
  }>({
    en: { name: '', subtitle: '' },
    hi: { name: '', subtitle: '' },
    bn: { name: '', subtitle: '' },
  });

  const [notifFormData, setNotifFormData] = useState({ en: '', hi: '', bn: '' });
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    if (activeTab === 'site-settings') {
      setNotifFormData(notificationText);
    }
  }, [activeTab, notificationText]);

  if (!user) return null;

  // --- Handlers (Keep existing logic) ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { addHeroImage(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };
  const handleUrlSubmit = () => { if(newImageUrl) { addHeroImage(newImageUrl); setNewImageUrl(''); } };
  const handleEditClick = (category: any) => {
    setEditingCategoryId(category.id);
    setCatFormData({
      en: { name: category.name, subtitle: category.subtitle },
      hi: category.translations?.hi || { name: '', subtitle: '' },
      bn: category.translations?.bn || { name: '', subtitle: '' }
    });
    setServiceLangTab('en');
  };
  const handleCancelEdit = () => {
    setCatFormData({ en: { name: '', subtitle: '' }, hi: { name: '', subtitle: '' }, bn: { name: '', subtitle: '' }, });
    setEditingCategoryId(null);
  };
  const handleServiceSubmit = () => {
    if(catFormData.en.name && catFormData.en.subtitle) {
        const payload = { en: catFormData.en, hi: catFormData.hi.name ? catFormData.hi : undefined, bn: catFormData.bn.name ? catFormData.bn : undefined };
        if (editingCategoryId) updateServiceCategory(editingCategoryId, payload);
        else addServiceCategory(payload);
        handleCancelEdit();
    } else alert("English Name and Subtitle are required.");
  };
  const handleCatChange = (field: 'name' | 'subtitle', value: string) => {
    setCatFormData(prev => ({ ...prev, [serviceLangTab]: { ...prev[serviceLangTab], [field]: value } }));
  };

  // --- Derived Data ---
  const isEmployer = user.role === 'employer';
  const isAdmin = user.role === 'admin';
  const myPostedJobs = isEmployer ? jobs.filter(j => j.employerId === user.id) : jobs;
  const myApps = getMyApplications(user.id);
  const totalApplications = applications.length;

  // --- Menu Structure ---
  const getMenuItems = () => {
    const common = [
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'messages', label: 'Messages', icon: MessageSquare },
    ];

    if (user.role === 'worker') {
      return [
        { section: 'Main Menu', items: [
          { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'profile', label: 'My Profile', icon: UserCircle },
          { id: 'search-jobs', label: 'Search Jobs', icon: Search, action: () => onChangeView('jobs') },
          { id: 'applications', label: 'My Applications', icon: FileText },
          { id: 'saved', label: 'Saved Jobs', icon: Bookmark },
        ]},
        { section: 'Support', items: [ ...common, { id: 'help', label: 'Help Center', icon: HelpCircle } ]}
      ];
    } else {
      // Admin & Employer
      return [
        { section: 'Main Menu', items: [
          { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'post-job', label: 'Post New Job', icon: PlusCircle },
          ...(isAdmin ? [
            { id: 'services', label: 'Manage Services', icon: Briefcase },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'site-settings', label: 'Site Settings', icon: Settings }
          ] : [])
        ]},
        { section: 'Organization', items: [ ...common, { id: 'feedback', label: 'Feedback', icon: Star } ]}
      ];
    }
  };

  const menuGroups = getMenuItems();

  // --- RENDER ---
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden glass"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:shadow-none flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* 1. Mobile Top Bar (Screenshot 2 style) */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100">
           <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-brand-yellow rounded-lg flex items-center justify-center">
                   <span className="text-brand-blue font-bold">O</span>
               </div>
               <span className="font-bold text-lg text-brand-blue">OM SHAI <span className="text-brand-orange text-sm">CONSTRUCTION</span></span>
           </div>
           <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-black">
              <X size={24} />
           </button>
        </div>

        {/* 2. User Profile Section (Screenshot 1 style) */}
        <div className="pt-8 pb-6 px-6 flex flex-col items-center text-center border-b border-gray-100">
            <div className="relative mb-3">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600 border-4 border-white shadow-sm overflow-hidden">
                  {workerProfile?.documents?.photo ? (
                    <img src={workerProfile.documents.photo} alt={user.name} className="w-full h-full object-cover"/>
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                {/* Online Indicator */}
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
            </div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{user.name}</h3>
            <p className="text-xs font-bold text-brand-orange uppercase mb-1 tracking-wide">{user.role}</p>
            <p className="text-xs text-gray-400 font-medium">{user.email || workerProfile?.phone}</p>
        </div>

        {/* 3. Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
           {menuGroups.map((group, idx) => (
             <div key={idx}>
                <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{group.section}</p>
                <div className="space-y-1">
                  {group.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.action) {
                          item.action();
                        } else {
                          setActiveTab(item.id);
                          if (item.id === 'overview') setSelectedJobIdForApplicants(null);
                        }
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                        activeTab === item.id 
                        ? 'bg-gray-900 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon size={18} className={`mr-3 transition-transform ${activeTab === item.id ? 'text-brand-yellow' : 'text-gray-400 group-hover:text-gray-600'}`} />
                      {item.label}
                      {activeTab === item.id && <ChevronRight size={14} className="ml-auto text-gray-500" />}
                    </button>
                  ))}
                </div>
             </div>
           ))}
        </div>

        {/* 4. Footer: Language & Logout (Screenshot 2 style) */}
        <div className="p-4 border-t border-gray-100 space-y-4 bg-gray-50/50">
          
          {/* Language Selector */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-2 pl-1">Select Language</p>
            <div className="flex bg-gray-200/50 p-1 rounded-lg">
              {(['en', 'hi', 'bn'] as const).map(lang => (
                <button 
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${language === lang ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => { logout(); onChangeView('home'); }}
            className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition text-sm"
          >
            <LogOut size={18} className="mr-3" />
            {language === 'en' ? 'Logout' : language === 'hi' ? 'लॉग आउट' : 'লগ আউট'}
          </button>
        </div>
      </aside>


      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Mobile Header (Hamburger) */}
        <header className="md:hidden bg-white border-b border-gray-200 flex items-center justify-between p-4 shadow-sm z-20">
           <div className="flex items-center">
             <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 mr-3">
               <Menu size={24} />
             </button>
             <span className="font-bold text-lg text-brand-blue">OM SHAI <span className="text-brand-orange text-sm">CONSTRUCTION</span></span>
           </div>
           <div className="w-8 h-8 bg-brand-light rounded-full flex items-center justify-center text-brand-blue font-bold border border-gray-200">
              {user.name.charAt(0)}
           </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
           
           {/* --- WORKER CONTENT --- */}
           {user.role === 'worker' && (
             <>
               {activeTab === 'overview' && (
                 <div className="max-w-4xl mx-auto animate-fade-in">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
                       <div className="relative z-10">
                         <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h2>
                         <p className="text-gray-300 mb-6">You have applied to <span className="text-white font-bold">{myApps.length} jobs</span> so far.</p>
                         <button onClick={() => onChangeView('jobs')} className="bg-brand-yellow text-brand-blue px-6 py-2 rounded-full font-bold shadow-lg hover:bg-white transition">Find More Work</button>
                       </div>
                       <Briefcase className="absolute right-0 bottom-0 text-white/5 w-48 h-48 -mr-10 -mb-10" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center"><FileText className="mr-2 text-brand-orange"/> Recent Applications</h3>
                    {myApps.length === 0 ? (
                      <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-gray-100">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                           <Search className="text-gray-400" size={32} />
                        </div>
                        <p className="text-gray-500 mb-4">You haven't applied to any jobs yet.</p>
                        <button onClick={() => onChangeView('jobs')} className="text-brand-orange font-bold hover:underline">Start Browsing Jobs</button>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {myApps.map(app => {
                           const job = jobs.find(j => j.id === app.jobId);
                           return (
                             <div key={app.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col sm:flex-row justify-between sm:items-center">
                                <div className="mb-4 sm:mb-0">
                                  <h4 className="font-bold text-lg text-gray-900">{job?.title || 'Unknown Job'}</h4>
                                  <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded mr-2">{job?.location}</span>
                                    <span>Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-bold border ${
                                  app.status === 'Shortlisted' ? 'bg-green-50 text-green-700 border-green-200' : 
                                  app.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                                  'bg-yellow-50 text-yellow-700 border-yellow-200'
                                }`}>
                                  {app.status}
                                </span>
                             </div>
                           );
                        })}
                      </div>
                    )}
                 </div>
               )}

               {activeTab === 'profile' && <ProfileEditor onComplete={() => setActiveTab('overview')} />}
               
               {(activeTab === 'saved' || activeTab === 'notifications' || activeTab === 'messages' || activeTab === 'help') && (
                 <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <Info size={48} className="mb-4 text-gray-300"/>
                    <h3 className="text-lg font-bold text-gray-900">Coming Soon</h3>
                    <p>This feature is under development.</p>
                 </div>
               )}
               {activeTab === 'applications' && (
                  // Reusing the overview logic for specific tab or creating a dedicated list
                  <div className="max-w-4xl mx-auto">
                     <h2 className="text-2xl font-bold mb-6">My Job Applications</h2>
                     {/* Same list code as overview */}
                     <div className="grid gap-4">
                        {myApps.map(app => {
                           const job = jobs.find(j => j.id === app.jobId);
                           return (
                             <div key={app.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col sm:flex-row justify-between sm:items-center">
                                <div className="mb-4 sm:mb-0">
                                  <h4 className="font-bold text-lg text-gray-900">{job?.title || 'Unknown Job'}</h4>
                                  <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded mr-2">{job?.location}</span>
                                    <span>Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-bold border ${
                                  app.status === 'Shortlisted' ? 'bg-green-50 text-green-700 border-green-200' : 
                                  app.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                                  'bg-yellow-50 text-yellow-700 border-yellow-200'
                                }`}>
                                  {app.status}
                                </span>
                             </div>
                           );
                        })}
                     </div>
                  </div>
               )}
             </>
           )}

           {/* --- ADMIN / EMPLOYER CONTENT --- */}
           {user.role !== 'worker' && (
             <>
               {activeTab === 'overview' && !selectedJobIdForApplicants && (
                 <div className="max-w-5xl mx-auto animate-fade-in">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-brand-orange mr-4">
                             <Briefcase size={24} />
                          </div>
                          <div>
                             <p className="text-sm text-gray-500 font-medium">Jobs Posted</p>
                             <h3 className="text-3xl font-bold text-gray-900">{myPostedJobs.length}</h3>
                          </div>
                       </div>
                       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                             <FileText size={24} />
                          </div>
                          <div>
                             <p className="text-sm text-gray-500 font-medium">Applications</p>
                             <h3 className="text-3xl font-bold text-gray-900">{isAdmin ? totalApplications : applications.filter(a => myPostedJobs.some(j => j.id === a.jobId)).length}</h3>
                          </div>
                       </div>
                       {isAdmin && (
                         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
                               <Users size={24} />
                            </div>
                            <div>
                               <p className="text-sm text-gray-500 font-medium">Total Users</p>
                               <h3 className="text-3xl font-bold text-gray-900">{allUsers.length}</h3>
                            </div>
                         </div>
                       )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Job Postings</h3>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      {myPostedJobs.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No jobs posted yet.</div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {myPostedJobs.map(job => {
                             const jobApps = applications.filter(a => a.jobId === job.id);
                             return (
                               <div key={job.id} className="p-5 hover:bg-gray-50 transition flex flex-col md:flex-row justify-between items-center group">
                                  <div className="mb-4 md:mb-0 w-full md:w-auto">
                                     <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-gray-900">{job.title}</h4>
                                        {job.jobScope === 'International' && <span className="text-[10px] uppercase font-bold bg-purple-100 text-purple-700 px-2 rounded">Intl</span>}
                                     </div>
                                     <p className="text-sm text-gray-500">{job.location} • <span className="text-brand-orange">{job.category}</span></p>
                                  </div>
                                  <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                                     <button 
                                       onClick={() => setSelectedJobIdForApplicants(job.id)}
                                       className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-100 transition"
                                     >
                                        <Users size={16} className="mr-2"/>
                                        {jobApps.length} Applicants
                                     </button>
                                     <button onClick={() => deleteJob(job.id)} className="p-2 text-gray-400 hover:text-red-600 transition">
                                        <Trash2 size={18} />
                                     </button>
                                  </div>
                               </div>
                             );
                          })}
                        </div>
                      )}
                    </div>
                 </div>
               )}

               {/* Applicants View */}
               {activeTab === 'overview' && selectedJobIdForApplicants && (
                  <div className="max-w-5xl mx-auto animate-fade-in">
                      <button onClick={() => setSelectedJobIdForApplicants(null)} className="mb-4 text-gray-500 hover:text-brand-blue flex items-center">
                         <ChevronRight className="rotate-180 mr-1" size={20}/> Back to Overview
                      </button>
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                          <h2 className="text-2xl font-bold mb-6">Applicants</h2>
                          {getJobApplications(selectedJobIdForApplicants).length === 0 ? (
                              <p className="text-gray-500">No applicants yet.</p>
                          ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Worker Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {getJobApplications(selectedJobIdForApplicants).map((app) => (
                                            <tr key={app.id}>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{app.workerName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(app.appliedDate).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <a href={`tel:${app.workerContact}`} className="text-brand-blue hover:underline flex items-center font-medium">
                                                        <Phone size={14} className="mr-2"/> {app.workerContact}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">{app.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                          )}
                      </div>
                  </div>
               )}

               {activeTab === 'post-job' && (
                 <div className="max-w-3xl mx-auto animate-fade-in">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Post New Job</h2>
                    <JobPostForm onSuccess={() => { setActiveTab('overview'); setSelectedJobIdForApplicants(null); alert('Job Posted Successfully!'); }} />
                 </div>
               )}
               
               {activeTab === 'users' && isAdmin && (
                  <div className="max-w-5xl mx-auto animate-fade-in">
                     <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management</h2>
                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                           <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                 <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Profile Status</th>
                                 </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                 {allUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition">
                                       <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                             <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                                                {u.name.charAt(0).toUpperCase()}
                                             </div>
                                             <div className="ml-4">
                                                <div className="text-sm font-bold text-gray-900">{u.name}</div>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {u.email}
                                       </td>
                                       <td className="px-6 py-4 whitespace-nowrap">
                                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                                             u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                             u.role === 'employer' ? 'bg-blue-100 text-blue-800' :
                                             'bg-orange-100 text-orange-800'
                                          }`}>
                                             {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                                          </span>
                                       </td>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm">
                                          {u.profileCompleted ? (
                                             <span className="text-green-600 font-bold flex items-center"><Star size={12} className="mr-1 fill-current"/> Completed</span>
                                          ) : (
                                             <span className="text-gray-400">Pending</span>
                                          )}
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'services' && isAdmin && (
                  <div className="max-w-5xl mx-auto animate-fade-in">
                      <h2 className="text-2xl font-bold mb-6">Manage Services</h2>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* Form */}
                          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                             <h3 className="font-bold text-lg mb-4">{editingCategoryId ? 'Edit Category' : 'Add New Category'}</h3>
                             {/* Tabs */}
                             <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                                {(['en', 'hi', 'bn'] as const).map(lang => (
                                   <button key={lang} onClick={() => setServiceLangTab(lang)} className={`flex-1 py-1 text-xs font-bold rounded-md transition ${serviceLangTab === lang ? 'bg-white shadow text-brand-orange' : 'text-gray-500'}`}>{lang.toUpperCase()}</button>
                                ))}
                             </div>
                             <div className="space-y-3">
                                <input type="text" placeholder="Category Name" value={catFormData[serviceLangTab].name} onChange={e => handleCatChange('name', e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none"/>
                                <input type="text" placeholder="Subtitle" value={catFormData[serviceLangTab].subtitle} onChange={e => handleCatChange('subtitle', e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none"/>
                                <button onClick={handleServiceSubmit} className="w-full bg-brand-orange text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition">{editingCategoryId ? 'Update' : 'Add'}</button>
                                {editingCategoryId && <button onClick={handleCancelEdit} className="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-lg hover:bg-gray-200">Cancel</button>}
                             </div>
                          </div>
                          {/* List */}
                          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {serviceCategories.map(cat => (
                                 <div key={cat.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center group hover:shadow-md transition">
                                     <div>
                                        <p className="font-bold text-gray-900">{cat.name}</p>
                                        <p className="text-xs text-gray-500">{cat.subtitle}</p>
                                     </div>
                                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                         <button onClick={() => handleEditClick(cat)} className="p-2 text-blue-600 bg-blue-50 rounded-lg"><Pencil size={16}/></button>
                                         <button onClick={() => deleteServiceCategory(cat.id)} className="p-2 text-red-600 bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                                     </div>
                                 </div>
                              ))}
                          </div>
                      </div>
                  </div>
               )}

               {activeTab === 'site-settings' && isAdmin && (
                 <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
                    <h2 className="text-2xl font-bold text-gray-900">Site Settings</h2>
                    
                    {/* Notification Banner */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg mb-4 flex items-center"><Megaphone className="mr-2 text-brand-orange"/> Banner Notification</h3>
                        <div className="space-y-4">
                           {Object.keys(notifFormData).map((lang) => (
                             <div key={lang}>
                               <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">{lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi' : 'Bengali'}</label>
                               <input type="text" value={(notifFormData as any)[lang]} onChange={e => setNotifFormData({...notifFormData, [lang]: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-brand-blue outline-none" />
                             </div>
                           ))}
                           <button onClick={() => updateNotificationText(notifFormData)} className="bg-brand-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800">Save Changes</button>
                        </div>
                    </div>

                    {/* Hero Images */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg mb-4 flex items-center"><ImageIcon className="mr-2 text-brand-orange"/> Hero Images</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                            {heroImages.map(img => (
                               <div key={img.id} className="relative aspect-video rounded-lg overflow-hidden group">
                                  <img src={img.url} className="w-full h-full object-cover"/>
                                  <button onClick={() => removeHeroImage(img.id)} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"><X size={12}/></button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                               <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Add Image URL</label>
                               <div className="flex gap-2">
                                  <input type="url" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} placeholder="https://..." className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"/>
                                  <button onClick={handleUrlSubmit} className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold">Add</button>
                               </div>
                            </div>
                            <div className="flex-1">
                               <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Or Upload</label>
                               <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-2 cursor-pointer hover:bg-gray-50">
                                  <Upload size={20} className="text-gray-400 mr-2"/> <span className="text-sm text-gray-500">Choose File</span>
                                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload}/>
                               </label>
                            </div>
                        </div>
                    </div>
                 </div>
               )}

               {(activeTab === 'notifications' || activeTab === 'messages' || activeTab === 'feedback') && (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <Info size={48} className="mb-4 text-gray-300"/>
                    <h3 className="text-lg font-bold text-gray-900">Coming Soon</h3>
                    <p>This feature is under development.</p>
                 </div>
               )}
             </>
           )}
           
        </main>
      </div>
    </div>
  );
};

export default Dashboard;