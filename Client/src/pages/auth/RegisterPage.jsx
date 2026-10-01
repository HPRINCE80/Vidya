import { yupResolver } from '@hookform/resolvers/yup';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as yup from 'yup';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { getApiErrorMessage } from '../../services/api.js';

const registerSchema = yup.object({
  name: yup.string().trim().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().trim().email('Please enter a valid email address').required('Email is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  role: yup.string().oneOf(['admin', 'teacher', 'student'], 'Please select a valid role').required('Role is required'),
  phone: yup.string().trim().optional(),
  className: yup.string().trim().optional(),
  teacherId: yup.string().trim().optional(),
  rollNumber: yup.string().trim().optional(),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'student',
      phone: '',
      className: '',
      teacherId: '',
      rollNumber: '',
    },
  });

  const [selectedRole, setSelectedRole] = useState('student');

  const onSubmit = async (values) => {
    setApiError('');

    const payload = {
      ...values,
      ...(values.className ? { class: values.className } : {}),
      ...(values.teacherId ? { teacherId: values.teacherId } : {}),
    };

    delete payload.className;

    try {
      await registerUser(payload);
      toast.success('Account created successfully');
      navigate('/');
    } catch (error) {
      const message = getApiErrorMessage(error);
      setApiError(message);
      toast.error(message);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-300">Create account</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Register a new user</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="name" label="Full name" placeholder="John Doe" register={register} error={errors.name?.message} required autoComplete="name" />
          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-medium text-slate-200">
              Role
            </label>
            <select
              id="role"
              {...register('role')}
              value={selectedRole}
              onChange={(event) => {
                register('role').onChange(event);
                setSelectedRole(event.target.value);
              }}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-3.5 py-2.5 text-sm text-white transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role?.message && <p className="text-sm text-rose-300">{errors.role.message}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="email" label="Email" type="email" placeholder="name@example.com" register={register} error={errors.email?.message} required autoComplete="email" />
          <Input id="phone" label="Phone" placeholder="Optional" register={register} error={errors.phone?.message} autoComplete="tel" />
        </div>

        <Input id="password" label="Password" type="password" placeholder="••••••••" register={register} error={errors.password?.message} required autoComplete="new-password" />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="className" label="Class" placeholder="Optional" register={register} error={errors.className?.message} autoComplete="off" />
          <Input id="rollNumber" label="Roll number" placeholder="Optional" register={register} error={errors.rollNumber?.message} autoComplete="off" />
        </div>

        {selectedRole === 'teacher' && (
          <Input
            id="teacherId"
            label="Teacher ID"
            placeholder="Enter teacher ID"
            register={register}
            error={errors.teacherId?.message}
            autoComplete="off"
          />
        )}

        {apiError && (
          <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            {apiError}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create account'}
          <UserPlus className="ml-2 h-4 w-4" />
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-300">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-sky-300 hover:text-sky-200">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
