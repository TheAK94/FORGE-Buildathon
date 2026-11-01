
import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile
} from "../services/profileService";

import ProfileSection from "../components/ProfileSection";

const initialProfile = {
  personal: {
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: ""
  },
  address: {
    house: "",
    street: "",
    village: "",
    district: "",
    state: "",
    pincode: ""
  },
  family: {
    fatherName: "",
    motherName: ""
  },
  occupation: "",
  annualIncome: "",
  education: ""
};

const Profile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile({
          ...initialProfile,
          ...data,
          personal: {
            ...initialProfile.personal,
            ...data.personal,
            dateOfBirth: data.personal?.dateOfBirth
              ? data.personal.dateOfBirth.slice(0, 10)
              : ""
          },
          address: {
            ...initialProfile.address,
            ...data.address
          },
          family: {
            ...initialProfile.family,
            ...data.family
          }
        });
      } catch (error) {
        setMessage("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [section, field] = name.split(".");

      setProfile(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const result = await updateProfile({
        ...profile,
        annualIncome: profile.annualIncome === ""
          ? undefined
          : Number(profile.annualIncome)
      });

      setProfile(prev => ({
        ...prev,
        ...result.profile
      }));

      setEditing(false);
      setMessage("Profile saved successfully!");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to save profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const field = (label, name, type = "text") => (
    <div className="col-md-6 mb-3">
      <label className="form-label">{label}</label>
      <input
        type={type}
        className="form-control"
        name={name}
        value={name.split(".").reduce((obj, key) => obj?.[key], profile) ?? ""}
        onChange={handleChange}
        disabled={!editing}
      />
    </div>
  );

  if (loading) {
    return <div className="p-5">Loading profile...</div>;
  }

  return (
    <main className="main-content">
      <div className="page-header">
        <div>
          <span className="eyebrow">PERSONAL VAULT</span>
          <h2>My Profile</h2>
          <p>Manage your personal information in one place.</p>
        </div>

        <button
          className={`btn ${editing ? "btn-success" : "btn-primary"}`}
          onClick={() => editing ? handleSave() : setEditing(true)}
          disabled={saving}
        >
          <i className={`bi ${editing ? "bi-check-lg" : "bi-pencil"} me-2`}></i>
          {saving ? "Saving..." : editing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      {message && (
        <div className="alert alert-info">{message}</div>
      )}

      <div className="profile-banner">
        <div className="profile-avatar">
          {(profile.personal.fullName || "U").charAt(0).toUpperCase()}
        </div>
        <div>
          <h4>{profile.personal.fullName || "Your Name"}</h4>
          <p>
            {profile.occupation || "Occupation not added"}
          </p>
        </div>
      </div>

      <ProfileSection title="Personal Information" icon="bi-person">
        <div className="row">
          {field("Full Name", "personal.fullName")}
          {field("Date of Birth", "personal.dateOfBirth", "date")}

          <div className="col-md-6 mb-3">
            <label className="form-label">Gender</label>
            <select
              className="form-select"
              name="personal.gender"
              value={profile.personal.gender}
              onChange={handleChange}
              disabled={!editing}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {field("Phone Number", "personal.phone", "tel")}
          {field("Email", "personal.email", "email")}
        </div>
      </ProfileSection>

      <ProfileSection title="Address Information" icon="bi-geo-alt">
        <div className="row">
          {field("House / Flat", "address.house")}
          {field("Street", "address.street")}
          {field("Village / City", "address.village")}
          {field("District", "address.district")}
          {field("State", "address.state")}
          {field("PIN Code", "address.pincode")}
        </div>
      </ProfileSection>

      <ProfileSection title="Family Information" icon="bi-people">
        <div className="row">
          {field("Father's Name", "family.fatherName")}
          {field("Mother's Name", "family.motherName")}
        </div>
      </ProfileSection>

      <ProfileSection title="Additional Information" icon="bi-briefcase">
        <div className="row">
          {field("Occupation", "occupation")}
          {field("Annual Income (₹)", "annualIncome", "number")}
          {field("Education", "education")}
        </div>
      </ProfileSection>
    </main>
  );
};

export default Profile;
