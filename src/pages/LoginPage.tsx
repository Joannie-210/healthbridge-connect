import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/healthcare';
import { Heart, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const roles: { value: UserRole; label: string; description: string }[] = [
  { value: 'admin', label: 'Admin', description: 'System management' },
  { value: 'doctor', label: 'Doctor', description: 'Patient care' },
  { value: 'patient', label: 'Patient', description: 'Personal health' },
  { value: 'nurse', label: 'Nurse', description: 'Care support' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password, selectedRole);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-info/20 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-lg text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary mb-8 shadow-elevated">
            <Heart className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-display font-bold text-primary-foreground mb-4">
            Smart Healthcare Management System
          </h1>
          <p className="text-lg text-primary-foreground/70 leading-relaxed">
            Secure, scalable, role-based platform for modern healthcare operations.
          </p>
          <div className="flex items-center justify-center gap-6 mt-10 text-primary-foreground/50 text-sm">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> RBAC Protected</span>
            <span>•</span>
            <span>AES Encrypted</span>
            <span>•</span>
            <span>Audit Logged</span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">SHMS</span>
          </div>

          <h2 className="text-2xl font-display font-bold text-foreground">Welcome back</h2>
          <p className="text-muted-foreground mt-1 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Role selector */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Login as</Label>
              <div className="grid grid-cols-4 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setSelectedRole(r.value)}
                    className={`p-3 rounded-lg border text-center transition-all text-xs ${
                      selectedRole === r.value
                        ? 'border-primary bg-primary/5 text-primary font-medium'
                        : 'border-border hover:border-primary/30 text-muted-foreground'
                    }`}
                  >
                    <div className="font-medium text-sm">{r.label}</div>
                    <div className="text-[10px] mt-0.5 opacity-70">{r.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
              Sign In
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Demo: select any role and click Sign In
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
