'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (res.ok) {
        window.location.href = '/admin'; // Force full refresh to clear middleware cache
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-merriweather font-bold text-rose-900">Diya Store</h1>
          <p className="text-stone-500 mt-2">Admin Login</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-stone-800">Email Address</label>
            <input 
              required type="email" 
              className="w-full border border-stone-300 rounded p-2 focus:ring focus:ring-rose-200" 
              value={email} onChange={e => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-stone-800">Password</label>
            <input 
              required type="password" 
              className="w-full border border-stone-300 rounded p-2 focus:ring focus:ring-rose-200" 
              value={password} onChange={e => setPassword(e.target.value)} 
            />
          </div>
          <button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-rose-800 text-white font-bold py-3 rounded hover:bg-rose-900 transition-colors mt-4"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
