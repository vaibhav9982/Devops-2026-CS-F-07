import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/AuthService.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      if (res.success) {
        await checkAuth();
        navigate('/dashboard');
      } else {
        setError(res.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center p-7">
      <div className="w-full max-w-[440px] rounded-3xl border border-[rgba(151,156,255,.2)] bg-[linear-gradient(145deg,rgba(27,30,49,.94),rgba(15,17,30,.9))] p-[28px_22px] shadow-[0_28px_90px_rgba(0,0,0,.38),inset_0_1px_rgba(255,255,255,.05)] backdrop-blur-[18px] min-[481px]:p-[38px]">
        <div className="mb-[30px] text-center">
          <h1 className="mb-2 text-[30px] font-extrabold leading-tight tracking-[-1.35px]"><span className="mr-2.5 inline-grid size-[34px] place-items-center rounded-[10px] bg-[linear-gradient(135deg,#97f7e6,#7674ff)] align-[3px] font-mono text-xs font-bold text-[#0b1020]">&lt;/&gt;</span>Code Visualizer</h1>
          <p className="m-0 text-sm text-[#a7aac1]">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-[17px]">
          {error && <div className="rounded-xl border border-[rgba(255,100,130,.45)] bg-[rgba(128,25,48,.28)] px-[13px] py-[11px] text-[13px] leading-[1.45] text-[#ffc4ce]">{error}</div>}
          <div className="flex flex-1 flex-col gap-[7px]">
            <label htmlFor="email" className="text-xs font-bold tracking-[.02em] text-[#d6d8ea]">Email</label>
            <input
              className="w-full rounded-xl border border-[#373b58] bg-[rgba(6,8,18,.46)] px-[13px] py-3 text-[#f6f7ff] outline-none transition focus:border-[#807dff] focus:bg-[rgba(10,12,26,.8)] focus:shadow-[0_0_0_4px_rgba(113,110,255,.13)] placeholder:text-[#73778f]"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div className="flex flex-1 flex-col gap-[7px]">
            <label htmlFor="password" className="text-xs font-bold tracking-[.02em] text-[#d6d8ea]">Password</label>
            <input
              className="w-full rounded-xl border border-[#373b58] bg-[rgba(6,8,18,.46)] px-[13px] py-3 text-[#f6f7ff] outline-none transition focus:border-[#807dff] focus:bg-[rgba(10,12,26,.8)] focus:shadow-[0_0_0_4px_rgba(113,110,255,.13)] placeholder:text-[#73778f]"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="rounded-xl bg-[linear-gradient(105deg,#a4f8e8,#7775ff_62%,#a88bff)] px-[18px] py-[13px] text-sm font-extrabold text-[#0d1020] shadow-[0_12px_26px_rgba(104,95,255,.22)] transition hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_16px_34px_rgba(104,95,255,.32)] disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-center text-[13px] text-[#9a9db5]">
          Don't have an account? <Link className="font-extrabold text-[#a7a7ff] hover:underline" to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
