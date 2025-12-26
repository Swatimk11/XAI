
export type UserRole = 'Admin' | 'Doctor' | 'Researcher';

export interface GradCamRegion {
  x: number;
  y: number;
  r: number;
}

export interface AnalysisResult {
  diagnosis: 'Malignant' | 'Benign' | 'Invalid';
  confidence: number;
  limeExplanation: string;
  shapExplanation: string[];
  gradCamRegion: GradCamRegion;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface PatientCase {
  id: string;
  patientId: string;
  date: string;
  status: 'Pending' | 'Analyzed' | 'In Review';
  imageFile: File | null;
  previewUrl: string | null;
  analysisResult?: AnalysisResult;
  chatHistory: ChatMessage[];
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  specialization: string;
  role: UserRole;
  status: 'Active' | 'Pending' | 'Blocked' | 'Unverified';
  joinedAt: string;
  verificationCode?: string;
  resetCode?: string;
}

export interface SystemStats {
  totalScans: number;
  malignantFound: number;
  avgConfidence: number;
  activeDoctors: number;
  dailyScans: { date: string; count: number }[];
}
