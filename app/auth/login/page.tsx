'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2 } from 'lucide-react';
import { setUser, setToken } from '@/lib/redux-store';
import { cacheStorage } from '@/lib/cache-storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If user is already logged in (cached), send them straight to their dashboard
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedUserRaw = localStorage.getItem('user');
    if (!savedUserRaw) return;

    try {
      const savedUser = JSON.parse(savedUserRaw);
      if (savedUser?.role === 'patient') {
        router.replace('/dashboard/patient');
      } else if (savedUser?.role === 'doctor') {
        router.replace('/dashboard/doctor');
      } else if (savedUser?.role === 'admin') {
        router.replace('/dashboard/admin');
      }
    } catch {
      // ignore parse errors and stay on login
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // Persist auth in localStorage (for hooks / API headers)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Persist auth in Redux store
      dispatch(setUser(data.user));
      dispatch(setToken(data.token));

      // Persist auth in cacheStorage (for other parts of the app)
      cacheStorage.setUser(data.user);
      cacheStorage.setToken(data.token);

      if (data.user.role === 'patient') {
        router.push('/dashboard/patient');
      } else if (data.user.role === 'doctor') {
        router.push('/dashboard/doctor');
      } else {
        router.push('/dashboard/admin');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-block rounded-full bg-primary/10 p-4">
            <div className="text-3xl font-bold text-primary">⚕️</div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Liver Disease Prediction</h1>
          <p className="mt-2 text-muted-foreground">Sign in to access your health dashboard</p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Use your registered email and password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-primary hover:underline">
                Create your account
              </Link>
            </div>

            <div className="mt-6 rounded-lg bg-muted/60 p-4 text-xs text-muted-foreground">
              <p className="mb-1 font-semibold text-foreground">Demo Credentials</p>
              <p>Email: demo@example.com</p>
              <p>Password: any password</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>© 2026 Liver Disease Prediction. Your health, our priority.</p>
        </div>
      </div>
    </div>
  );
}

