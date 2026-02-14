import { User, Patient, Appointment, Message, MedicalRecord, AuditLog, DashboardStats } from '@/types/healthcare';

export const mockUser: User = {
  id: 'u1',
  name: 'Dr. Sarah Chen',
  email: 'sarah.chen@shms.com',
  role: 'doctor',
  specialization: 'Cardiology',
  department: 'Cardiology',
};

export const mockPatients: Patient[] = [
  { id: 'p1', name: 'James Wilson', age: 45, gender: 'Male', email: 'james@email.com', phone: '+1 555-0101', bloodType: 'O+', lastVisit: '2026-02-12', status: 'active', conditions: ['Hypertension', 'Type 2 Diabetes'] },
  { id: 'p2', name: 'Emily Davis', age: 32, gender: 'Female', email: 'emily@email.com', phone: '+1 555-0102', bloodType: 'A-', lastVisit: '2026-02-10', status: 'active', conditions: ['Asthma'] },
  { id: 'p3', name: 'Robert Martinez', age: 68, gender: 'Male', email: 'robert@email.com', phone: '+1 555-0103', bloodType: 'B+', lastVisit: '2026-02-14', status: 'critical', conditions: ['Heart Failure', 'COPD', 'Kidney Disease'] },
  { id: 'p4', name: 'Lisa Thompson', age: 28, gender: 'Female', email: 'lisa@email.com', phone: '+1 555-0104', bloodType: 'AB+', lastVisit: '2026-02-08', status: 'active', conditions: ['Migraine'] },
  { id: 'p5', name: 'Michael Brown', age: 55, gender: 'Male', email: 'michael@email.com', phone: '+1 555-0105', bloodType: 'O-', lastVisit: '2026-01-28', status: 'discharged', conditions: ['Post-Surgery Recovery'] },
  { id: 'p6', name: 'Anna Kowalski', age: 41, gender: 'Female', email: 'anna@email.com', phone: '+1 555-0106', bloodType: 'A+', lastVisit: '2026-02-13', status: 'active', conditions: ['Arthritis', 'Anxiety'] },
];

export const mockAppointments: Appointment[] = [
  { id: 'a1', patientName: 'James Wilson', patientId: 'p1', doctorName: 'Dr. Sarah Chen', doctorId: 'u1', date: '2026-02-14', time: '09:00', type: 'Follow-up', status: 'approved', notes: 'Blood pressure review' },
  { id: 'a2', patientName: 'Emily Davis', patientId: 'p2', doctorName: 'Dr. Sarah Chen', doctorId: 'u1', date: '2026-02-14', time: '10:30', type: 'Consultation', status: 'approved' },
  { id: 'a3', patientName: 'Robert Martinez', patientId: 'p3', doctorName: 'Dr. Sarah Chen', doctorId: 'u1', date: '2026-02-14', time: '14:00', type: 'Emergency', status: 'pending' },
  { id: 'a4', patientName: 'Lisa Thompson', patientId: 'p4', doctorName: 'Dr. Sarah Chen', doctorId: 'u1', date: '2026-02-15', time: '11:00', type: 'Check-up', status: 'pending' },
  { id: 'a5', patientName: 'Anna Kowalski', patientId: 'p6', doctorName: 'Dr. Sarah Chen', doctorId: 'u1', date: '2026-02-13', time: '15:30', type: 'Follow-up', status: 'completed' },
];

export const mockMessages: Message[] = [
  { id: 'm1', senderId: 'p1', senderName: 'James Wilson', senderRole: 'patient', receiverId: 'u1', receiverName: 'Dr. Sarah Chen', content: 'Doctor, my blood pressure reading was 140/90 this morning. Should I be concerned?', timestamp: '2026-02-14T08:30:00', read: false },
  { id: 'm2', senderId: 'u1', senderName: 'Dr. Sarah Chen', senderRole: 'doctor', receiverId: 'p1', receiverName: 'James Wilson', content: 'Hi James, that is slightly elevated. Please continue your medication and we will review it at your appointment today.', timestamp: '2026-02-14T08:45:00', read: true },
  { id: 'm3', senderId: 'p3', senderName: 'Robert Martinez', senderRole: 'patient', receiverId: 'u1', receiverName: 'Dr. Sarah Chen', content: 'I have been experiencing shortness of breath again. Can we move my appointment up?', timestamp: '2026-02-14T07:15:00', read: false },
  { id: 'm4', senderId: 'p2', senderName: 'Emily Davis', senderRole: 'patient', receiverId: 'u1', receiverName: 'Dr. Sarah Chen', content: 'Thank you for the prescription refill, Doctor. I am feeling much better.', timestamp: '2026-02-13T16:20:00', read: true },
];

export const mockMedicalRecords: MedicalRecord[] = [
  { id: 'r1', patientId: 'p1', date: '2026-02-12', diagnosis: 'Hypertension Stage 1', prescription: 'Lisinopril 10mg daily', doctorName: 'Dr. Sarah Chen', notes: 'Blood pressure slightly elevated. Continue monitoring.', type: 'consultation' },
  { id: 'r2', patientId: 'p1', date: '2026-02-01', diagnosis: 'Type 2 Diabetes - Controlled', prescription: 'Metformin 500mg twice daily', doctorName: 'Dr. Sarah Chen', notes: 'HbA1c levels improved. Continue current regimen.', type: 'lab_result' },
  { id: 'r3', patientId: 'p3', date: '2026-02-14', diagnosis: 'Acute Heart Failure Exacerbation', prescription: 'Furosemide 40mg IV', doctorName: 'Dr. Sarah Chen', notes: 'Patient presents with increased edema and dyspnea.', type: 'consultation' },
];

export const mockAuditLogs: AuditLog[] = [
  { id: 'al1', userId: 'u1', userName: 'Dr. Sarah Chen', action: 'VIEW_RECORD', resource: 'Patient: James Wilson', timestamp: '2026-02-14T09:15:00', ipAddress: '192.168.1.105' },
  { id: 'al2', userId: 'u1', userName: 'Dr. Sarah Chen', action: 'UPDATE_RECORD', resource: 'Patient: Robert Martinez', timestamp: '2026-02-14T08:50:00', ipAddress: '192.168.1.105' },
  { id: 'al3', userId: 'admin1', userName: 'System Admin', action: 'ROLE_CHANGE', resource: 'User: Nurse_1', timestamp: '2026-02-14T07:30:00', ipAddress: '192.168.1.1' },
  { id: 'al4', userId: 'u1', userName: 'Dr. Sarah Chen', action: 'LOGIN', resource: 'Auth System', timestamp: '2026-02-14T07:00:00', ipAddress: '192.168.1.105' },
];

export const mockDashboardStats: DashboardStats = {
  totalPatients: 248,
  todayAppointments: 12,
  pendingApprovals: 5,
  unreadMessages: 3,
  criticalPatients: 4,
  completedToday: 7,
};
