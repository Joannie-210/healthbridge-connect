import { StatsCard } from '@/components/StatsCard';
import { StatusBadge } from '@/components/StatusBadge';
import { mockDashboardStats, mockAuditLogs, mockPatients, mockAppointments } from '@/data/mockData';
import { Users, CalendarDays, Shield, AlertTriangle, UserCog, Activity, CheckCircle } from 'lucide-react';

export function AdminDashboard() {
  const stats = mockDashboardStats;
  const recentLogs = mockAuditLogs.slice(0, 5);
  const criticalPatients = mockPatients.filter((p) => p.status === 'critical');
  const pendingAppts = mockAppointments.filter((a) => a.status === 'pending');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Admin Overview</h1>
        <p className="text-muted-foreground mt-1">System-wide metrics and activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Patients" value={stats.totalPatients} icon={Users} variant="primary" trend="+12 this week" />
        <StatsCard title="Today's Appointments" value={stats.todayAppointments} icon={CalendarDays} variant="default" />
        <StatsCard title="Pending Approvals" value={stats.pendingApprovals} icon={UserCog} variant="warning" />
        <StatsCard title="Critical Patients" value={stats.criticalPatients} icon={AlertTriangle} variant="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Audit Logs */}
        <div className="bg-card rounded-xl border shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" /> Recent Activity
            </h2>
            <span className="text-xs text-muted-foreground">{recentLogs.length} logs</span>
          </div>
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground">{log.action.replace('_', ' ')}</p>
                  <p className="text-xs text-muted-foreground">{log.userName} · {log.resource}</p>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health / Pending Approvals */}
        <div className="bg-card rounded-xl border shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-warning" /> Pending Appointments
            </h2>
            <span className="text-xs text-muted-foreground">{pendingAppts.length} pending</span>
          </div>
          {pendingAppts.length === 0 ? (
            <div className="flex items-center gap-2 text-success p-4">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">All appointments approved</span>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingAppts.map((appt) => (
                <div key={appt.id} className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/10">
                  <div>
                    <p className="text-sm font-medium text-foreground">{appt.patientName}</p>
                    <p className="text-xs text-muted-foreground">{appt.date} · {appt.time} · {appt.type}</p>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Critical Patients */}
      {criticalPatients.length > 0 && (
        <div className="bg-card rounded-xl border shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" /> Critical Patients
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
        </div>
      )}
    </div>
  );
}
export default AdminDashboard;