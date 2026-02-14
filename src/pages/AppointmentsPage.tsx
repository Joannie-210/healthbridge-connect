import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { mockAppointments } from '@/data/mockData';
import { CalendarDays, Clock, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

type FilterStatus = 'all' | 'pending' | 'approved' | 'completed' | 'cancelled';

export default function AppointmentsPage() {
  const [filter, setFilter] = useState<FilterStatus>('all');

  const filtered = filter === 'all' ? mockAppointments : mockAppointments.filter((a) => a.status === filter);
  const filters: FilterStatus[] = ['all', 'pending', 'approved', 'completed', 'cancelled'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Appointments</h1>
            <p className="text-muted-foreground text-sm">Manage your schedule</p>
          </div>
          <Button className="gradient-primary text-primary-foreground hover:opacity-90">
            <CalendarDays className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Appointments list */}
        <div className="bg-card rounded-xl border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Patient</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Date & Time</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Type</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((appt) => (
                  <tr key={appt.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-xs">
                          {appt.patientName.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium text-foreground">{appt.patientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-foreground">
                        <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                        {appt.date}
                        <Clock className="w-3.5 h-3.5 text-muted-foreground ml-2" />
                        {appt.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{appt.type}</td>
                    <td className="px-6 py-4"><StatusBadge status={appt.status} /></td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{appt.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">No appointments found.</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
