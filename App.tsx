import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JobBoard from './components/JobBoard';
import ContactSection from './components/ContactSection';
import NotificationBanner from './components/NotificationBanner';
import Popup from './components/Popup';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';
import Steps from './components/Steps';
import Services from './components/Services';
import Dashboard from './components/Dashboard';
import { MessageCircle } from 'lucide-react';
import { LanguageProvider } from './context/LanguageContext';
import { JobProvider } from './context/JobContext';
import { AuthProvider } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';

const AppContent: React.FC = () => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  // Simple "Routing" State
  const [currentView, setCurrentView] = useState('home');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    scrollToTop();
  };

  return (
    <div className="font-sans antialiased text-gray-900 bg-gray-50 min-h-screen flex flex-col">
      {/* Hide Navbar and Notification Banner when in Dashboard for a cleaner "App" feel, or keep them if preferred. 
          For this design, we keep them but the Dashboard takes over the main area. */}
      {currentView !== 'dashboard' && <NotificationBanner />}
      {currentView !== 'dashboard' && (
        <Navbar 
          currentView={currentView}
          onChangeView={handleViewChange}
          openAuth={() => setIsAuthOpen(true)}
        />
      )}
      
      <main className="flex-grow">
        {currentView === 'home' && (
          <>
            <Hero />
            
            <div className="bg-gray-50 pt-6 pb-4 text-center">
              <h2 className="text-3xl font-bold">Recent Opportunities</h2>
              <p className="text-gray-500 mb-6">Browse the latest listings</p>
            </div>
            <JobBoard onApplyClick={() => setIsAuthOpen(true)} />
            <div className="text-center pb-16 bg-gray-50">
               <button 
                 onClick={() => handleViewChange('jobs')}
                 className="px-8 py-3 bg-brand-blue text-white font-bold rounded-full hover:bg-gray-800 transition shadow-lg"
               >
                 View All Domestic & International Jobs
               </button>
            </div>

            <Services />
            <Steps />
            <ContactSection />
          </>
        )}

        {currentView === 'jobs' && (
          <div className="pt-8">
            <JobBoard onApplyClick={() => setIsAuthOpen(true)} />
          </div>
        )}

        {currentView === 'dashboard' && (
          <Dashboard onChangeView={handleViewChange} />
        )}
        
        {currentView === 'contact' && (
          <ContactSection />
        )}
      </main>

      {currentView !== 'dashboard' && <Footer />}

      {/* Admin Panel (Legacy - kept for specific admin tasks if needed, though Dashboard covers most) */}
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(role) => {
          if (role === 'admin') {
            handleViewChange('dashboard');
          }
        }}
      />

      <Popup />

      {/* Fixed Floating WhatsApp Button */}
      <a 
        href="https://wa.me/919876543210" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition transform hover:scale-110 flex items-center justify-center border-4 border-white"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle size={32} />
      </a>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SiteProvider>
          <JobProvider>
            <AppContent />
          </JobProvider>
        </SiteProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;