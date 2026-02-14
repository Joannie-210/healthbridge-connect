import { StatsCard } from '@/components/StatsCard';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { mockAppointments, mockMedicalRecords, mockMessages } from '@/data/mockData';
import { CalendarDays, FileText, MessageSquare, Heart, Clock } from 'lucide-react';

export function PatientDashboard() {
  const { user } = useAuth();
  const myAppointments = mockAppointments.filter((a) => a.patientId === 'p1');
  const upcomingAppts = myAppointments.filter((a) => a.status === 'approved' || a.status === 'pending');
  const myRecords = mockMedicalRecords.filter((r) => r.patientId === 'p1');
  const unreadMsgs = mockMessages.filter((m) => !m.read && m.receiverId === 'p1');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Welcome, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-muted-foreground mt-1">Your health overview at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Upcoming Appointments" value={upcomingAppts.length} icon={CalendarDays} variant="primary" />
        <StatsCard title="Medical Records" value={myRecords.length} icon={FileText} variant="default" />
        <StatsCard title="Unread Messages" value={unreadMsgs.length} icon={MessageSquare} variant="warning" />
        <StatsCard title="Health Status" value="Good" icon={Heart} variant="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-card rounded-xl border shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">My Appointments</h2>
            <span className="text-xs text-muted-foreground">{myAppointments.length} total</span>
          </div>
          <div className="space-y-3">
            {myAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4">No appointments scheduled</p>
            ) : (
              myAppointments.map((appt) => (
                <div key={appt.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{appt.doctorName}</p>
                      <p className="text-xs text-muted-foreground">{appt.date} · {appt.time} · {appt.type}</p>
                    </div>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Records */}
        <div className="bg-card rounded-xl border shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">Recent Records</h2>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {myRecords.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4">No records available</p>
            ) : (
              myRecords.map((record) => (
                <div key={record.id} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{record.diagnosis}</p>
                    <span className="text-xs text-muted-foreground">{record.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{record.doctorName} · {record.type.replace('_', ' ')}</p>
                  {record.prescription && (
                    <p className="text-xs text-primary mt-1">💊 {record.prescription}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default PatientDashboard;