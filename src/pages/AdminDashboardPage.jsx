import { useState } from 'react';
import { EXAM_CENTERS } from '../constants/examCenters';
import { API_BASE } from '../config/api';

function formatPermanentAddress(permanentAddress) {
  if (!permanentAddress) return 'Not Provided';

  const parts = [
    permanentAddress.address,
    permanentAddress.city,
    permanentAddress.district,
    permanentAddress.state,
    permanentAddress.pincode,
  ].filter(Boolean);

  return parts.length ? parts.join(', ') : 'Not Provided';
}

function getCandidatePhotoUrl(candidate) {
  const photoUrl = candidate?.documents?.photoUrl;
  if (!photoUrl) return '';
  if (photoUrl.startsWith('http')) return photoUrl;
  return `${API_BASE}${photoUrl}`;
}

function AdminDashboardPage({
  loading,
  registrationNumber,
  candidate,
  selectedCenter,
  onRegistrationNumberChange,
  onCenterChange,
  onSearch,
  onUpdateCenter,
}) {
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const photoUrl = getCandidatePhotoUrl(candidate);

  const currentCenter = candidate?.examCenter || 'Not Assigned';
  const nextCenter = selectedCenter || 'Not Selected';

  const handleOpenConfirmPopup = () => {
    if (!selectedCenter) {
      onUpdateCenter();
      return;
    }
    setShowConfirmPopup(true);
  };

  const handleConfirmUpdate = async () => {
    await onUpdateCenter();
    setShowConfirmPopup(false);
  };

  return (
    <>
      <section className="card">
        <h2>Find Candidate</h2>
        <form className="search-row" onSubmit={onSearch}>
          <input
            type="text"
            value={registrationNumber}
            onChange={(event) => onRegistrationNumberChange(event.target.value)}
            placeholder="Enter registration number (e.g. UMTC727453590)"
            required
          />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </section>

      {candidate ? (
        <section className="card">
          <h2>Candidate Details</h2>

          <div className="candidate-top">
            <img
              src={photoUrl || 'https://via.placeholder.com/140x160?text=No+Photo'}
              alt="Candidate Profile"
              className="candidate-photo"
            />
            <div className="candidate-top-meta">
              <p><span>Status:</span> {candidate.applicationStatus || 'Not Available'}</p>
              <p><span>Post Applied For:</span> {candidate.basicDetails?.postAppliedFor || 'Not Provided'}</p>
            </div>
          </div>

          <div className="details-grid">
            <div>
              <span>Registration No</span>
              <strong>{candidate.registrationNumber || '-'}</strong>
            </div>
            <div>
              <span>Name</span>
              <strong>{candidate.candidateName || '-'}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{candidate.email || '-'}</strong>
            </div>
            <div>
              <span>Mobile</span>
              <strong>{candidate.mobile || '-'}</strong>
            </div>
            <div>
              <span>DOB</span>
              <strong>{candidate.dob || 'Not Provided'}</strong>
            </div>
            <div>
              <span>Gender</span>
              <strong>{candidate.gender || 'Not Provided'}</strong>
            </div>
            <div>
              <span>Nationality</span>
              <strong>{candidate.nationality || 'Not Provided'}</strong>
            </div>
            <div>
              <span>Category</span>
              <strong>{candidate.category || 'Not Provided'}</strong>
            </div>
            <div>
              <span>Father Name</span>
              <strong>{candidate.basicDetails?.fatherName || 'Not Provided'}</strong>
            </div>
            <div>
              <span>Application Status</span>
              <strong>{candidate.applicationStatus || 'Not Available'}</strong>
            </div>
            <div>
              <span>Post Applied For</span>
              <strong>{candidate.basicDetails?.postAppliedFor || 'Not Provided'}</strong>
            </div>
            <div>
              <span>Permanent Address</span>
              <strong>{formatPermanentAddress(candidate.address?.permanentAddress)}</strong>
            </div>
            <div>
              <span>Current Exam Center</span>
              <strong>{candidate.examCenter || 'Not Assigned'}</strong>
            </div>
            <div>
              <span>Tentative Exam Date</span>
              <strong>{candidate.tentativeExamDate || 'Not Assigned'}</strong>
            </div>
          </div>

          <div className="search-row mt16">
            <select value={selectedCenter} onChange={(event) => onCenterChange(event.target.value)}>
              <option value="">Select exam center</option>
              {EXAM_CENTERS.map((center) => (
                <option key={center} value={center}>
                  {center}
                </option>
              ))}
            </select>
            <button className="btn btn-accent" type="button" onClick={handleOpenConfirmPopup} disabled={loading}>
              {loading ? 'Updating...' : 'Update Exam Center'}
            </button>
          </div>

          {showConfirmPopup ? (
            <div className="confirm-overlay">
              <div className="confirm-modal">
                <h3>Confirm Exam Center Update</h3>
                <p>
                  Are you sure you want to update the exam center from
                  <strong> {currentCenter} </strong>
                  to
                  <strong> {nextCenter}</strong>?
                </p>
                <div className="confirm-actions">
                  <button type="button" className="btn btn-outline-modal" onClick={() => setShowConfirmPopup(false)} disabled={loading}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-accent" onClick={handleConfirmUpdate} disabled={loading}>
                    {loading ? 'Updating...' : 'Confirm'}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </>
  );
}

export default AdminDashboardPage;
