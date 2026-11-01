
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile } from "../services/profileService";
import { getDocuments } from "../services/documentService";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [profileData, documentData] = await Promise.all([
          getProfile(),
          getDocuments()
        ]);

        setProfile(profileData);
        setDocuments(documentData);
      } catch (error) {
        console.error("Dashboard loading failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const personal = profile?.personal || {};
  const address = profile?.address || {};

  const profileFields = [
    personal.fullName,
    personal.dateOfBirth,
    personal.gender,
    personal.phone,
    personal.email,
    address.house,
    address.street,
    address.village,
    address.district,
    address.state,
    address.pincode,
    profile?.family?.fatherName,
    profile?.family?.motherName,
    profile?.occupation,
    profile?.annualIncome !== undefined &&
      profile?.annualIncome !== null &&
      profile?.annualIncome !== "",
    profile?.education
  ];

  const completedFields = profileFields.filter(Boolean).length;
  const profileProgress = Math.round(
    (completedFields / profileFields.length) * 100
  );

  const recentDocuments = documents.slice(0, 4);

  if (loading) {
    return (
      <main className="main-content">
        <p>Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="main-content">

      {/* Welcome */}
      <div className="page-header">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h2>
            Welcome back{personal.fullName
              ? `, ${personal.fullName.split(" ")[0]}`
              : ""}!
          </h2>
          <p>Manage your information and government services in one place.</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="dashboard-stats">

        <div className="dashboard-stat-card">
          <div className="stat-icon">
            <i className="bi bi-person-check"></i>
          </div>
          <div>
            <span>Profile Completion</span>
            <h3>{profileProgress}%</h3>
          </div>
          <div className="progress dashboard-progress">
            <div
              className="progress-bar"
              style={{ width: `${profileProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">
            <i className="bi bi-folder2-open"></i>
          </div>
          <div>
            <span>Stored Documents</span>
            <h3>{documents.length}</h3>
          </div>
          <p>Documents in your personal vault</p>
        </div>

      </div>

      {/* Quick Actions */}
      <section className="dashboard-section">
        <div className="section-heading">
          <h5>Quick Actions</h5>
        </div>

        <div className="quick-actions">

          <Link to="/profile" className="quick-action-card">
            <i className="bi bi-person-lines-fill"></i>
            <div>
              <h6>My Profile</h6>
              <p>View and update your information</p>
            </div>
            <i className="bi bi-arrow-up-right"></i>
          </Link>

          <Link to="/documents" className="quick-action-card">
            <i className="bi bi-file-earmark-text"></i>
            <div>
              <h6>Document Vault</h6>
              <p>Manage your uploaded documents</p>
            </div>
            <i className="bi bi-arrow-up-right"></i>
          </Link>

        </div>
      </section>

      {/* Government Services */}
      <section className="service-banner">
        <div>
          <span className="eyebrow">YOUR NEXT STEP</span>
          <h4>Ready to access a government service?</h4>
          <p>
            FORGE will help you find the right service and prepare
            your application.
          </p>
          <button className="btn btn-primary" disabled>
            <i className="bi bi-stars me-2"></i>
            Explore Services – Coming Soon
          </button>
        </div>
        <i className="bi bi-buildings service-banner-icon"></i>
      </section>

      {/* Recent Documents */}
      <section className="dashboard-section">
        <div className="documents-heading">
          <div>
            <h5>Recent Documents</h5>
            <p>Your recently uploaded files</p>
          </div>

          <Link to="/documents" className="view-all-link">
            View all <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        {recentDocuments.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-folder2-open"></i>
            <h5>No documents yet</h5>
            <p>Upload your important documents to your vault.</p>
            <Link to="/documents" className="btn btn-primary">
              Upload Document
            </Link>
          </div>
        ) : (
          <div className="recent-documents">
            {recentDocuments.map((doc) => (
              <div className="recent-document-card" key={doc._id}>
                <div className="recent-document-icon">
                  <i className={
                    doc.mimeType === "application/pdf"
                      ? "bi bi-file-earmark-pdf"
                      : "bi bi-file-earmark-image"
                  }></i>
                </div>

                <div>
                  <h6>{doc.documentName}</h6>
                  <p>{doc.originalName}</p>
                  <small>
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </main>
  );
};

export default Dashboard;
