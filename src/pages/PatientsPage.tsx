import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { mockPatients, mockMedicalRecords } from '@/data/mockData';
import { Search, FileText, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function PatientsPage() {
  const [search, setSearch] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const filtered = mockPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.conditions.some((c) => c.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedPatient = mockPatients.find((p) => p.id === selectedPatientId);
  const patientRecords = mockMedicalRecords.filter((r) => r.patientId === selectedPatientId);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Patients</h1>
            <p className="text-muted-foreground text-sm">{mockPatients.length} total patients</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search patients or conditions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex gap-6">
          {/* Patient list */}
          <div className={`flex-1 space-y-2 ${selectedPatientId ? 'hidden lg:block lg:max-w-md' : ''}`}>
            {filtered.map((patient) => (
              <button
                key={patient.id}
                onClick={() => setSelectedPatientId(patient.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all hover:shadow-card ${
                  selectedPatientId === patient.id ? 'border-primary bg-primary/5' : 'bg-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm shrink-0">
                      {patient.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {patient.age}y · {patient.gender} · {patient.bloodType}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={patient.status} />
                </div>
                <div className="flex flex-wrap gap-1 mt-2 ml-13">
                  {patient.conditions.map((c) => (
                    <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{c}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Patient detail */}
          {selectedPatient && (
            <div className="flex-1 bg-card rounded-xl border shadow-card p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                    {selectedPatient.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="font-display font-semibold text-foreground">{selectedPatient.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedPatient.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedPatientId(null)} className="lg:hidden p-2 text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  ['Age', `${selectedPatient.age} years`],
                  ['Gender', selectedPatient.gender],
                  ['Blood Type', selectedPatient.bloodType],
                  ['Phone', selectedPatient.phone],
                  ['Last Visit', selectedPatient.lastVisit],
                  ['Status', selectedPatient.status],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium text-foreground capitalize">{value}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Medical Records
                </h3>
                {patientRecords.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No records found for this patient.</p>
                ) : (
                  <div className="space-y-3">
                    {patientRecords.map((record) => (
                      <div key={record.id} className="p-3 rounded-lg bg-muted/50 border">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium uppercase text-primary">{record.type.replace('_', ' ')}</span>
                          <span className="text-xs text-muted-foreground">{record.date}</span>
                        </div>
                        <p className="text-sm font-medium text-foreground">{record.diagnosis}</p>
                        <p className="text-xs text-muted-foreground mt-1">{record.prescription}</p>
                        <p className="text-xs text-muted-foreground mt-1 italic">{record.notes}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
