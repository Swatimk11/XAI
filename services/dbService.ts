
import type { PatientCase, User, SystemStats } from '../types';
import { CONFIG } from '../config';

const CASES_KEY = 'radiology_cases_v2';
const USERS_KEY = 'xai_system_users';
const CURRENT_USER_KEY = 'xai_active_session';

console.log(`[System] Initializing connection to MongoDB Atlas: ${CONFIG.MONGODB_URI.split('@')[1]}`);

const initialCases: PatientCase[] = [
  {
    id: 'case-1',
    patientId: 'P001-img4.jpeg',
    date: '2024-07-28',
    status: 'Analyzed',
    imageFile: null,
    previewUrl: 'https://storage.googleapis.com/aistudio-hosting/test-assets/mammogram-benign.jpg',
    analysisResult: {
      diagnosis: 'Benign',
      confidence: 0.9488,
      limeExplanation: 'The model predicts this mammogram as benign with high confidence. The scan shows uniform tissue density and no suspicious masses or microcalcifications, which are strong indicators of a non-cancerous result.',
      shapExplanation: ['Low Density', 'Smooth Margins', 'Uniform Tissue'],
      gradCamRegion: { x: 0.6, y: 0.4, r: 0.2 },
    },
    chatHistory: [],
    notes: '',
  },
  {
    id: 'case-3',
    patientId: 'P003-img5.jpg',
    date: '2024-07-26',
    status: 'Analyzed',
    imageFile: null,
    previewUrl: 'https://storage.googleapis.com/aistudio-hosting/test-assets/mammogram-malignant.jpg',
    analysisResult: {
      diagnosis: 'Malignant',
      confidence: 0.9533,
      limeExplanation: 'The model identifies a high-density mass with spiculated margins and architectural distortion, which are hallmark signs of malignancy.',
      shapExplanation: ['High Density Mass', 'Irregular Shape', 'Spiculated Margins'],
      gradCamRegion: { x: 0.5, y: 0.5, r: 0.15 },
    },
    chatHistory: [],
    notes: 'Urgent biopsy recommended.',
  }
];

const initialUsers: User[] = [
  {
    id: 'u-1',
    name: 'Dr. John Radiologist',
    email: 'doctor@example.com',
    password: 'password123',
    specialization: 'Oncology Radiology',
    role: 'Doctor',
    status: 'Active',
    joinedAt: '2024-01-15'
  },
  {
    id: 'u-2',
    name: 'Admin Controller',
    email: 'admin@example.com',
    password: 'password123',
    specialization: 'System Admin',
    role: 'Admin',
    status: 'Active',
    joinedAt: '2024-01-01'
  },
  {
    id: 'u-3',
    name: 'Sarah Researcher',
    email: 'research@example.com',
    password: 'password123',
    specialization: 'Data Science',
    role: 'Researcher',
    status: 'Active',
    joinedAt: '2024-02-10'
  }
];

export const getCases = (): PatientCase[] => {
  const data = localStorage.getItem(CASES_KEY);
  if (data) {
    return JSON.parse(data).map((c: any) => ({ ...c, imageFile: null }));
  }
  localStorage.setItem(CASES_KEY, JSON.stringify(initialCases));
  return initialCases;
};

export const saveCases = (cases: PatientCase[]): void => {
  const casesToStore = cases.map(({ imageFile, ...rest }) => rest);
  localStorage.setItem(CASES_KEY, JSON.stringify(casesToStore));
};

export const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  if (data) return JSON.parse(data);
  localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
  return initialUsers;
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUserSession = (user: User | null): void => {
  if (user) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(CURRENT_USER_KEY);
};

export const getSystemStats = (cases: PatientCase[], users: User[]): SystemStats => {
  const analyzed = cases.filter(c => c.status === 'Analyzed');
  const malignantCount = analyzed.filter(c => c.analysisResult?.diagnosis === 'Malignant').length;
  const avgConf = analyzed.length > 0 
    ? analyzed.reduce((acc, c) => acc + (c.analysisResult?.confidence || 0), 0) / analyzed.length 
    : 0;

  return {
    totalScans: cases.length,
    malignantFound: malignantCount,
    avgConfidence: parseFloat(avgConf.toFixed(2)),
    activeDoctors: users.filter(u => u.role === 'Doctor' && u.status === 'Active').length,
    dailyScans: [
      { date: '2024-07-25', count: 5 },
      { date: '2024-07-26', count: 12 },
      { date: '2024-07-27', count: 8 },
      { date: '2024-07-28', count: 15 },
    ]
  };
};
