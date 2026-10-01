import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as yup from 'yup';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { getApiErrorMessage } from '../../services/api.js';

const loginSchema = yup.object({
  email: yup.string().trim().email('Please enter a valid email address').required('Email is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    setApiError('');

    try {
      await login(values);
      toast.success('Login successful');
      const role = localStorage.getItem('school_user');
      const nextRole = role ? JSON.parse(role).role : 'student';
      navigate(`/${nextRole}`);
    } catch (error) {
      const message = getApiErrorMessage(error);
      setApiError(message);
      toast.error(message);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-300">Welcome back</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Sign in to your dashboard</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="name@example.com"
          register={register}
          error={errors.email?.message}
          required
        />

        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          register={register}
          error={errors.password?.message}
          required
        />

        {apiError && (
          <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            {apiError}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-3 text-sm text-slate-300">
          <div className="mb-1 flex items-center gap-2 text-slate-100">
            <Mail size={16} />
            Demo admin
          </div>
          admin@school.com
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-3 text-sm text-slate-300">
          <div className="mb-1 flex items-center gap-2 text-slate-100">
            <LockKeyhole size={16} />
            Demo password
          </div>
          Use your backend user password
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-slate-300">
        Need an account?{' '}
        <Link to="/register" className="font-medium text-sky-300 hover:text-sky-200">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
