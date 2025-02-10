"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockClosedIcon, UserIcon, EnvelopeIcon, IdentificationIcon, PhoneIcon, HomeIcon } from '@heroicons/react/24/outline';

interface AuthFormData {
  nic: string;
  name: string;
  email: string;
  telephone: string;
  address: string;
  password: string;
}

export default function AuthForm() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<AuthFormData>({
    nic: '',
    name: '',
    email: '',
    telephone: '',
    address: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/api/user/login' : '/api/user/signup';

    try {
      const response = await fetch(`http://localhost:4000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Authentication failed');

      if (isLogin) {
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      } else {
        setIsLogin(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to authenticate');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="bg-indigo-600 p-4 rounded-full">
            <LockClosedIcon className="h-8 w-8 text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {isLogin ? 'Welcome Back!' : 'Get Started'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div className="relative">
                <IdentificationIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="NIC Number"
                  className="w-full pl-10 pr-4 py-3 text-gray-800 rounded-lg border border-gray-300 focus:border-indigo-600 focus:outline-none"
                  value={formData.nic}
                  onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                  required={!isLogin}
                />
              </div>

              <div className="relative">
                <UserIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 text-gray-800 rounded-lg border border-gray-300 focus:border-indigo-600 focus:outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={!isLogin}
                />
              </div>

              <div className="relative">
                <PhoneIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  placeholder="Telephone Number"
                  className="w-full pl-10 pr-4 py-3 text-gray-800 rounded-lg border border-gray-300 focus:border-indigo-600 focus:outline-none"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  required={!isLogin}
                />
              </div>

              <div className="relative">
                <HomeIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Address"
                  className="w-full pl-10 pr-4 py-3 text-gray-800 rounded-lg border border-gray-300 focus:border-indigo-600 focus:outline-none"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required={!isLogin}
                />
              </div>
            </>
          )}

          <div className="relative">
            <EnvelopeIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-3 text-gray-800 rounded-lg border border-gray-300 focus:border-indigo-600 focus:outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="relative">
            <LockClosedIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 text-gray-800 rounded-lg border border-gray-300 focus:border-indigo-600 focus:outline-none"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 font-semibold hover:underline focus:outline-none"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}