import { DashboardLayout } from '@/components/DashboardLayout';
import { mockAuditLogs } from '@/data/mockData';
import { Shield, Eye, Edit, LogIn, UserCog } from 'lucide-react';

const actionIcons: Record<string, React.ElementType> = {
  VIEW_RECORD: Eye,
  UPDATE_RECORD: Edit,
  LOGIN: LogIn,
  ROLE_CHANGE: UserCog,
};

export default function AuditLogsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground text-sm flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Tamper-proof activity tracking
          </p>
        </div>

        <div className="bg-card rounded-xl border shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Action</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">User</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Resource</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Timestamp</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {mockAuditLogs.map((log) => {
                const Icon = actionIcons[log.action] || Shield;
                return (
                  <tr key={log.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{log.action.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{log.userName}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{log.resource}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{log.ipAddress}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
