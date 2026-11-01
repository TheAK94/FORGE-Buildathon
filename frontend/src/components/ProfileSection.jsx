
const ProfileSection = ({ title, icon, children }) => {
  return (
    <section className="profile-section">
      <div className="section-heading">
        <div className="section-icon">
          <i className={`bi ${icon}`}></i>
        </div>
        <h5>{title}</h5>
      </div>

      <div className="section-content">
        {children}
      </div>
    </section>
  );
};

export default ProfileSection;
