

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Job, JobApplication } from '../types';

interface JobContextType {
  jobs: Job[];
  applications: JobApplication[];
  addJob: (job: Omit<Job, 'id' | 'postedDate' | 'isActive'>) => void;
  applyForJob: (jobId: string, workerId: string, workerName: string, workerContact: string) => void;
  getMyApplications: (workerId: string) => JobApplication[];
  getJobApplications: (jobId: string) => JobApplication[];
  deleteJob: (jobId: string) => void;
  isLoading: boolean;
}

// Mock Initial Data
const INITIAL_JOBS: Job[] = [
  {
    id: '1',
    employerId: 'admin',
    title: 'Construction Helper',
    location: 'Mumbai, Andheri West',
    salary: '₹600 / Day',
    type: 'Daily',
    category: 'Construction',
    description: 'Urgent need for 5 helpers for moving materials. Lunch provided.',
    contact: '+919876543210',
    postedDate: new Date().toISOString(),
    isNew: true,
    jobScope: 'Domestic',
    workersRequired: 5,
    isActive: true,
    experienceLevel: 'Fresher',
    translations: {
      hi: {
        title: 'निर्माण सहायक',
        description: 'सामग्री ले जाने के लिए 5 सहायकों की तत्काल आवश्यकता है। दोपहर का भोजन उपलब्ध कराया गया।'
      },
      bn: {
        title: 'নির্মাণ সহায়ক',
        description: 'উপাদান সরানোর জন্য ৫ জন সাহায্যকারীর জরুরি প্রয়োজন। দুপুরের খাবার দেওয়া হবে।'
      }
    }
  },
  {
    id: '2',
    employerId: 'admin',
    title: 'Industrial Electrician',
    location: 'Dubai, UAE',
    salary: '2500 AED / Month',
    type: 'Contract',
    category: 'Electrician',
    description: 'Experienced electrician needed for industrial project. Visa + Accommodation provided.',
    contact: '+971500000000',
    postedDate: new Date(Date.now() - 86400000).toISOString(),
    jobScope: 'International',
    workersRequired: 10,
    visaType: 'Employment',
    accommodation: true,
    contractPeriod: '2 Years',
    isActive: true,
    experienceLevel: '3+ Years',
    translations: {
      hi: {
        title: 'औद्योगिक इलेक्ट्रीशियन',
        description: 'औद्योगिक परियोजना के लिए अनुभवी इलेक्ट्रीशियन की आवश्यकता है। वीज़ा + आवास प्रदान किया गया।'
      },
      bn: {
        title: 'শিল্প ইলেকট্রিশিয়ান',
        description: 'শিল্প প্রকল্পের জন্য অভিজ্ঞ ইলেকট্রিশিয়ান প্রয়োজন। ভিসা + থাকার ব্যবস্থা দেওয়া হয়েছে।'
      }
    }
  },
  {
    id: '3',
    employerId: 'admin',
    title: 'Factory Packaging Worker',
    location: 'Delhi, Okhla',
    salary: '₹12,000 / Month',
    type: 'Contract',
    category: 'Factory Worker',
    description: 'Packaging sweets in a factory. 8 hour shift.',
    contact: '+919876543212',
    postedDate: new Date(Date.now() - 172800000).toISOString(),
    jobScope: 'Domestic',
    workersRequired: 20,
    isActive: true,
    experienceLevel: 'Fresher',
    translations: {
      hi: {
        title: 'फैक्टरी पैकेजिंग कार्यकर्ता',
        description: 'एक कारखाने में मिठाइयाँ पैक करना। 8 घंटे की शिफ्ट.'
      },
      bn: {
        title: 'ফ্যাক্টরি প্যাকেজিং কর্মী',
        description: 'কারখানায় মিষ্টি প্যাকেট করা। ৮ ঘন্টার শিফট।'
      }
    }
  }
];

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addJob = (newJobData: Omit<Job, 'id' | 'postedDate' | 'isActive'>) => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const newJob: Job = {
        ...newJobData,
        id: Math.random().toString(36).substr(2, 9),
        postedDate: new Date().toISOString(),
        isActive: true,
        isNew: true
      };
      setJobs(prev => [newJob, ...prev]);
      setIsLoading(false);
    }, 800);
  };

  const deleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
  };

  const applyForJob = (jobId: string, workerId: string, workerName: string, workerContact: string) => {
    // Check if already applied
    if (applications.some(app => app.jobId === jobId && app.workerId === workerId)) {
        return; // Already applied
    }

    const newApp: JobApplication = {
        id: Date.now().toString(),
        jobId,
        workerId,
        workerName,
        workerContact,
        status: 'Applied',
        appliedDate: new Date().toISOString()
    };
    setApplications(prev => [...prev, newApp]);
  };

  const getMyApplications = (workerId: string) => {
    return applications.filter(app => app.workerId === workerId);
  };

  const getJobApplications = (jobId: string) => {
    return applications.filter(app => app.jobId === jobId);
  };

  return (
    <JobContext.Provider value={{ 
        jobs, 
        applications, 
        addJob, 
        deleteJob, 
        applyForJob, 
        getMyApplications, 
        getJobApplications, 
        isLoading 
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};