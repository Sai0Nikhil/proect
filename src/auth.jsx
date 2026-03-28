import { useState } from 'react';
import './auth.css';

function Auth({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
    setError('');
    setMessage('');
  };

const handleSubmit = (e) => {
  e.preventDefault();
  setError('');
  setMessage('');

  if (!form.role) {
    setError('Please select your role.');
    return;
  }

  if (!form.email || !form.password) {
    setError('Please enter email and password.');
    return;
  }

  // temporary fake user check
  if (
    form.email === 'reachsainikhil@gmail.com' &&
    form.password === '1234'
  ) {
    setMessage(`Logged in as demo ${form.role}.`);

    if (onAuthSuccess) {
      onAuthSuccess({
        id: 'demo-user-1',
        name: form.name || 'Sai Nikhil',
        email: form.email,
        role: form.role, // Student / Librarian / Staff chosen in dropdown
      });
    }
  } else {
    setError('Invalid demo credentials. Use reachsainikhil@gmail.com / 1234');
  }
};



  return (
    <div className="auth-shell">
      <div className="auth-card">

        <header className="auth-header">
          <h1>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
          <p>
            {mode === 'login'
              ? 'Log in to continue'
              : 'Sign up to get started'}
          </p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* ROLE DROPDOWN (VISIBLE ALWAYS) */}
          <div className="auth-field">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              className="auth-select"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="">Select your role</option>
              <option value="Student">Student</option>
              <option value="Librarian">Librarian</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          {mode === 'signup' && (
            <>
              <div className="auth-field">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>


            </>
          )}

          <div className="auth-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">
              Password
              <span className="auth-hint">(min 6 characters)</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-message">{message}</p>}

          <button
            type="submit"
            className="auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? mode === 'login'
                ? 'Logging in...'
                : 'Creating account...'
              : mode === 'login'
                ? 'Log In'
                : 'Sign Up'}
          </button>
        </form>

        <footer className="auth-footer">
          <p>
            {mode === 'login'
              ? "Don't have an account?"
              : 'Already have an account?'}
            <button
              type="button"
              className="auth-switch"
              onClick={toggleMode}
            >
              {mode === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </footer>

      </div>
    </div>
  );
}

export default Auth;