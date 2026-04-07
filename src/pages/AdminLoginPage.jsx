function AdminLoginPage({ username, password, loading, onUsernameChange, onPasswordChange, onSubmit }) {
  return (
    <section className="card narrow">
      <h2>Admin Login</h2>
      <p className="muted">Sign in to search candidates and update exam center details.</p>

      <form className="grid" onSubmit={onSubmit}>
        <label>
          Username
          <input
            type="email"
            value={username}
            onChange={(event) => onUsernameChange(event.target.value)}
            placeholder="admin@umtc.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder="Enter password"
            required
          />
        </label>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </section>
  );
}

export default AdminLoginPage;
