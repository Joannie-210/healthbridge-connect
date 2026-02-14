import { DashboardLayout } from '@/components/DashboardLayout';
import { mockMedicalRecords, mockPatients } from '@/data/mockData';
import { FileText, Lock } from 'lucide-react';

export default function RecordsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Medical Records</h1>
          <p className="text-muted-foreground text-sm flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> AES-encrypted storage · Access logged
          </p>
        </div>

        <div className="space-y-4">
          {mockMedicalRecords.map((record) => {
            const patient = mockPatients.find((p) => p.id === record.patientId);
            return (
              <div key={record.id} className="bg-card rounded-xl border shadow-card p-5 hover:shadow-elevated transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{patient?.name || 'Unknown'}</p>
                      <span className="text-xs font-medium uppercase text-primary">{record.type.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{record.date}</span>
                </div>
                <div className="ml-11 space-y-1">
                  <p className="text-sm text-foreground font-medium">{record.diagnosis}</p>
                  <p className="text-sm text-muted-foreground">Rx: {record.prescription}</p>
                  <p className="text-sm text-muted-foreground italic">{record.notes}</p>
                  <p className="text-xs text-muted-foreground mt-2">By {record.doctorName}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
