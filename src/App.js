import './App.css';
import { useMemo, useState } from 'react';
import AdminHeader from './components/AdminHeader';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { apiRequest } from './config/api';

const STORAGE_KEY = 'umtc_admin_token';

function App() {
  const [username, setUsername] = useState('admin@umtc.com');
  const [password, setPassword] = useState('UMTC@7438#');
  const [token, setToken] = useState(localStorage.getItem(STORAGE_KEY) || '');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [candidate, setCandidate] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const isLoggedIn = useMemo(() => Boolean(token), [token]);

  const setStatus = (nextMessage = '', nextError = '') => {
    setMessage(nextMessage);
    setError(nextError);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus();

    try {
      const data = await apiRequest('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      localStorage.setItem(STORAGE_KEY, data.token);
      setToken(data.token);
      setStatus('Admin logged in successfully.');
    } catch (loginError) {
      setStatus('', loginError.message || 'Unable to login.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setToken('');
    setCandidate(null);
    setSelectedCenter('');
    setRegistrationNumber('');
    setStatus('Logged out successfully.');
  };

  const fetchCandidate = async (event) => {
    event.preventDefault();
    const regNo = registrationNumber.trim();

    if (!regNo) {
      setStatus('', 'Please enter a registration number.');
      return;
    }

    setLoading(true);
    setStatus();

    try {
      const data = await apiRequest(`/api/application/admin/candidate/${encodeURIComponent(regNo)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCandidate(data.candidate);
      setSelectedCenter(data.candidate?.examCenter || '');
      setStatus('Candidate details loaded.');
    } catch (fetchError) {
      setCandidate(null);
      setSelectedCenter('');
      setStatus('', fetchError.message || 'Unable to fetch candidate.');
    } finally {
      setLoading(false);
    }
  };

  const updateExamCenter = async () => {
    if (!candidate?.registrationNumber) {
      setStatus('', 'Load a candidate first.');
      return;
    }

    if (!selectedCenter) {
      setStatus('', 'Please select an exam center.');
      return;
    }

    const currentRegistrationNumber = candidate.registrationNumber;

    setLoading(true);
    setStatus();

    try {
      await apiRequest(
        `/api/application/admin/candidate/${encodeURIComponent(candidate.registrationNumber)}/exam-center`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ examCenter: selectedCenter }),
        }
      );

      setStatus(`Exam center updated for candidate ${currentRegistrationNumber}.`);
      setRegistrationNumber('');
      setSelectedCenter('');
      setCandidate(null);
    } catch (updateError) {
      setStatus('', updateError.message || 'Unable to update exam center.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <AdminHeader isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <main className="admin-shell">
        {message ? <p className="status success">{message}</p> : null}
        {error ? <p className="status error">{error}</p> : null}

        {!isLoggedIn ? (
          <AdminLoginPage
            username={username}
            password={password}
            loading={loading}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
            onSubmit={handleLogin}
          />
        ) : (
          <AdminDashboardPage
            loading={loading}
            registrationNumber={registrationNumber}
            candidate={candidate}
            selectedCenter={selectedCenter}
            onRegistrationNumberChange={setRegistrationNumber}
            onCenterChange={setSelectedCenter}
            onSearch={fetchCandidate}
            onUpdateCenter={updateExamCenter}
          />
        )}
      </main>
    </div>
  );
}

export default App;
