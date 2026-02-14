import { StatsCard } from '@/components/StatsCard';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { mockDashboardStats, mockAppointments, mockPatients } from '@/data/mockData';
import { Users, CalendarDays, AlertTriangle, CheckCircle, ClipboardList, Activity } from 'lucide-react';

export function NurseDashboard() {
  const { user } = useAuth();
  const stats = mockDashboardStats;
  const todayAppts = mockAppointments.filter((a) => a.date === '2026-02-14');
  const criticalPatients = mockPatients.filter((p) => p.status === 'critical');
  const activePatients = mockPatients.filter((p) => p.status === 'active');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Hello, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-muted-foreground mt-1">Your care overview for today</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Active Patients" value={activePatients.length} icon={Users} variant="primary" />
        <StatsCard title="Today's Appointments" value={stats.todayAppointments} icon={CalendarDays} variant="default" />
        <StatsCard title="Tasks Pending" value={stats.pendingApprovals} icon={ClipboardList} variant="warning" />
        <StatsCard title="Critical Alerts" value={criticalPatients.length} icon={AlertTriangle} variant="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-card rounded-xl border shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">Today's Schedule</h2>
            <span className="text-xs text-muted-foreground">{todayAppts.length} appointments</span>
          </div>
          <div className="space-y-3">
            {todayAppts.map((appt) => (
              <div key={appt.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {appt.patientName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{appt.patientName}</p>
                    <p className="text-xs text-muted-foreground">{appt.time} · {appt.type} · {appt.doctorName}</p>
                  </div>
                </div>
                <StatusBadge status={appt.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Patient Vitals / Critical */}
        <div className="bg-card rounded-xl border shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-destructive" /> Critical Alerts
            </h2>
          </div>
          {criticalPatients.length === 0 ? (
            <div className="flex items-center gap-2 text-success p-4">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">All patients stable</span>
            </div>
          ) : (
            <div className="space-y-3">
              {criticalPatients.map((patient) => (
                <div key={patient.id} className="p-3 rounded-lg border border-destructive/10 bg-destructive/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">{patient.age}y · {patient.gender} · {patient.bloodType}</p>
                    </div>
                    <StatusBadge status={patient.status} />
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {patient.conditions.map((c) => (
                      <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">{c}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default NurseDashboard;  