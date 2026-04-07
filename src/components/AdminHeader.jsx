function AdminHeader({ isLoggedIn, onLogout }) {
  return (
    <header className="admin-header-wrap">
      <div className="admin-header">
        <div className="brand">
          <img
            src="https://umtcapply.com/wp-content/uploads/2026/01/logo-new-1.png"
            alt="UMTC Logo"
            className="brand-logo"
          />
          <div>
            <p className="brand-caption">Urban Mass Transit Company Limited</p>
            <h1>Admin Portal</h1>
          </div>
        </div>
        {isLoggedIn ? (
          <button className="btn btn-outline" type="button" onClick={onLogout}>
            Logout
          </button>
        ) : null}
      </div>
    </header>
  );
}

export default AdminHeader;
