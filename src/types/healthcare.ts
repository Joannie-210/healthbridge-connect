export type UserRole = 'admin' | 'doctor' | 'patient' | 'nurse';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  specialization?: string;
  department?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  bloodType: string;
  lastVisit: string;
  status: 'active' | 'discharged' | 'critical';
  conditions: string[];
}

export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  date: string;
  time: string;
  type: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  receiverName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  diagnosis: string;
  prescription: string;
  doctorName: string;
  notes: string;
  type: 'consultation' | 'lab_result' | 'prescription' | 'imaging';
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
}

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  pendingApprovals: number;
  unreadMessages: number;
  criticalPatients: number;
  completedToday: number;
}
