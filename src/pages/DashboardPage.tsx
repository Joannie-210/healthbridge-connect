import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from "@/components/dashboards/AdminDashboard"
import { DoctorDashboard } from '@/components/dashboards/DoctorDashboard';
import { PatientDashboard } from '@/components/dashboards/PatientDashboard';
import { NurseDashboard } from '@/components/dashboards/NurseDashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'patient':
        return <PatientDashboard />;
      case 'nurse':
        return <NurseDashboard />;
      default:
        return <DoctorDashboard />;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
}
