

export type Language = 'en' | 'hi' | 'bn';

export type UserRole = 'admin' | 'worker' | 'employer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileCompleted?: boolean;
}

export interface WorkerProfile {
  userId: string;
  phone: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  city: string;
  state: string;
  country: string;
  skills: string[];
  experienceYears: number;
  education: string;
  languages: string[];
  preferredLocation: string[];
  documents: {
    photo?: string;
    idProof?: string; // Aadhaar/Passport
    resume?: string;
  };
}

export interface EmployerProfile {
  userId: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  address: string;
  industry: string;
}

export interface HeroImage {
  id: string;
  url: string;
  file?: File; 
}

export interface CategoryTranslation {
  name: string;
  subtitle: string;
}

export interface ServiceCategory {
  id: string;
  name: string; // Default (English)
  icon: string; // Name of lucide icon
  subtitle: string; // Default (English)
  translations?: {
    hi?: CategoryTranslation;
    bn?: CategoryTranslation;
  };
}

export interface JobTranslation {
  title: string;
  description: string;
  location?: string;
}

export interface Job {
  id: string;
  employerId: string; // 'admin' or employer user id
  title: string;
  location: string; // City, Country
  salary: string;
  type: 'Daily' | 'Monthly' | 'Contract';
  category: string; // English name matching ServiceCategory.name
  description: string;
  contact: string;
  postedDate: string;
  isNew?: boolean;
  isUrgent?: boolean;
  
  // New Fields
  jobScope: 'Domestic' | 'International';
  workersRequired: number;
  visaType?: string; // Manual Input
  accommodation?: boolean;
  contractPeriod?: string;
  experienceLevel?: string; // Manual Input
  isActive: boolean;

  // Translations
  translations?: {
    hi?: JobTranslation;
    bn?: JobTranslation;
  };
}

export interface JobApplication {
  id: string;
  jobId: string;
  workerId: string;
  workerName: string;
  workerContact: string; // Phone or Email
  status: 'Applied' | 'Shortlisted' | 'Rejected';
  appliedDate: string;
}

export interface Translation {
  heroTitle: string;
  heroSubtitle: string;
  callNow: string;
  whatsapp: string;
  viewJobs: string;
  latestJobs: string;
  workersNeeded: string;
  applyNow: string;
  jobType: string;
  location: string;
  salary: string;
  posted: string;
  adminPanel: string;
  postJob: string;
  contactUs: string;
  name: string;
  phone: string;
  city: string;
  skills: string;
  submit: string;
  joinCommunity: string;
  communityPopupTitle: string;
  testimonials: string;
  howItWorks: string;
  step1: string;
  step2: string;
  step3: string;
  login: string;
  signup: string;
  logout: string;
  welcome: string;
  ourServices: string;
  servicesSubtitle: string;
}

// Initial Default Data
export const CATEGORIES = [
  "Construction",
  "Electrician",
  "Plumber",
  "Carpenter",
  "Housekeeping",
  "Factory Worker",
  "Driver",
  "Painter",
  "Helper",
  "Welder",
  "Mason",
  "Chef/Cook"
];

export const COUNTRIES = [
  "India",
  "UAE",
  "Saudi Arabia",
  "Qatar",
  "Oman",
  "Kuwait",
  "Bahrain",
  "Malaysia",
  "Singapore",
  "Maldives",
  "Romania",
  "Poland",
  "Croatia",
  "Japan",
  "South Korea",
  "Russia",
  "Israel",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Italy",
  "France",
  "Spain",
  "Portugal",
  "Turkey",
  "Iraq",
  "Jordan",
  "Lebanon",
  "Egypt",
  "Mauritius",
  "Seychelles",
  "South Africa",
  "New Zealand",
  "Ireland"
];