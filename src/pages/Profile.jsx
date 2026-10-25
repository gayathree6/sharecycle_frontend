import { useRef, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  Heart,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Profile.css";

export default function Profile() {
  const [profile, setProfile] = useState({
    fullName: "ShareCycle User",
    username: "sharecycleuser",
    email: "user@example.com",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [notifications, setNotifications] = useState({
    donationUpdates: true,
    pickupReminders: true,
    expiryAlerts: true,
    achievementUpdates: true,
  });

  const [profileImage, setProfileImage] = useState("");
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [passwordNotice, setPasswordNotice] = useState("");
  const fileInputRef = useRef(null);

  function handleProfileChange(event) {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target;
    setPasswords((current) => ({ ...current, [name]: value }));
    setPasswordNotice("");
  }

  function handleProfileSave(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!profile.fullName.trim() || !profile.username.trim()) {
      setError("Please enter your full name and username.");
      return;
    }

    setProfile((current) => ({
      ...current,
      fullName: current.fullName.trim(),
      username: current.username.trim(),
    }));

    setEditing(false);
    setNotice("Profile updated in this demo.");
  }

  function handlePasswordSave(event) {
    event.preventDefault();
    setPasswordNotice("");

    if (!passwords.current || !passwords.newPassword || !passwords.confirmPassword) {
      setPasswordNotice("Please fill in all password fields.");
      return;
    }

    if (passwords.newPassword.length < 8) {
      setPasswordNotice("Your new password must contain at least 8 characters.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordNotice("The new password and confirmation do not match.");
      return;
    }

    setPasswordNotice(
      "Password form validated. Actual password changes require the backend."
    );

    setPasswords({
      current: "",
      newPassword: "",
      confirmPassword: "",
    });
  }

  function togglePassword(field) {
    setShowPasswords((current) => ({
      ...current,
      [field]: !current[field],
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Please select an image smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfileImage(String(reader.result));
      setNotice("Profile picture preview updated.");
      setError("");
    };

    reader.onerror = () => {
      setError("Unable to preview this image. Please try another file.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function toggleNotification(name) {
    setNotifications((current) => ({
      ...current,
      [name]: !current[name],
    }));

    setNotice("Notification preferences updated in this demo.");
  }

  function handleCancelEdit() {
    setEditing(false);
    setError("");
    setNotice("");
  }

  return (
    <div className="profile-page">
      <Navbar />

      <main className="container profile-container">
        <div className="profile-page-heading">
          <div>
            <div className="profile-eyebrow">
              <UserRound size={16} />
              YOUR ACCOUNT
            </div>

            <h1>Profile & Settings</h1>

            <p>
              Manage your personal details, password, and ShareCycle
              notification preferences.
            </p>
          </div>

          <Link to="/" className="profile-back-link">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>

        {notice && (
          <div className="profile-message success" role="status">
            <CheckCircle2 size={18} />
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss message"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {error && (
          <div className="profile-message error" role="alert">
            <X size={18} />
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <X size={17} />
            </button>
          </div>
        )}

        <div className="profile-layout">
          <aside className="profile-sidebar">
            <section className="profile-summary-card">
              <div className="profile-avatar-wrap">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile preview"
                    className="profile-avatar-image"
                  />
                ) : (
                  <div className="profile-avatar-placeholder">
                    <UserRound size={39} />
                  </div>
                )}

                <button
                  type="button"
                  className="profile-camera-btn"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Upload profile picture"
                  title="Upload profile picture"
                >
                  <Camera size={16} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </div>

              <h2>{profile.fullName || "Your name"}</h2>
              <p>@{profile.username || "username"}</p>

              <div className="profile-member-label">
                <Heart size={14} /> ShareCycle member
              </div>

              <div className="profile-summary-divider" />

              <div className="profile-summary-detail">
                <Mail size={16} />
                <span>{profile.email}</span>
              </div>

              <div className="profile-summary-detail">
                <ShieldCheck size={16} />
                <span>Account settings</span>
              </div>

              <p className="profile-photo-tip">
                JPG, PNG or another image format. Maximum size: 5 MB.
              </p>
            </section>

            <section className="profile-help-card">
              <div className="profile-help-icon">
                <ShieldCheck size={21} />
              </div>
              <h3>Keep your account safe</h3>
              <p>
                Use a strong password and keep your account details up to date.
              </p>
            </section>
          </aside>

          <div className="profile-content">
            <section className="profile-card">
              <div className="profile-card-heading">
                <div className="profile-heading-icon">
                  <UserRound size={20} />
                </div>

                <div>
                  <h2>Personal information</h2>
                  <p>Update the details associated with your account.</p>
                </div>

                {!editing && (
                  <button
                    type="button"
                    className="profile-edit-btn"
                    onClick={() => {
                      setEditing(true);
                      setNotice("");
                      setError("");
                    }}
                  >
                    Edit profile
                  </button>
                )}
              </div>

              <form onSubmit={handleProfileSave}>
                <div className="profile-form-grid">
                  <label className="profile-field">
                    Full name
                    <input
                      type="text"
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleProfileChange}
                      disabled={!editing}
                      required
                      maxLength={100}
                      placeholder="Enter your full name"
                    />
                  </label>

                  <label className="profile-field">
                    Username
                    <input
                      type="text"
                      name="username"
                      value={profile.username}
                      onChange={handleProfileChange}
                      disabled={!editing}
                      required
                      maxLength={30}
                      placeholder="Choose a username"
                    />
                  </label>

                  <label className="profile-field profile-full-width">
                    Email address
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      disabled
                      readOnly
                    />
                    <small>
                      Email changes will be handled through account
                      verification in the backend.
                    </small>
                  </label>
                </div>

                {editing && (
                  <div className="profile-form-actions">
                    <button
                      type="button"
                      className="profile-cancel-btn"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>

                    <button type="submit" className="profile-save-btn">
                      <Save size={17} /> Save changes
                    </button>
                  </div>
                )}
              </form>
            </section>

            <section className="profile-card">
              <div className="profile-card-heading">
                <div className="profile-heading-icon">
                  <LockKeyhole size={20} />
                </div>

                <div>
                  <h2>Change password</h2>
                  <p>Choose a strong password to protect your account.</p>
                </div>
              </div>

              <form onSubmit={handlePasswordSave}>
                <div className="profile-password-fields">
                  {[
                    {
                      name: "current",
                      label: "Current password",
                      placeholder: "Enter your current password",
                    },
                    {
                      name: "newPassword",
                      label: "New password",
                      placeholder: "At least 8 characters",
                    },
                    {
                      name: "confirmPassword",
                      label: "Confirm new password",
                      placeholder: "Re-enter your new password",
                    },
                  ].map((field) => (
                    <label className="profile-field" key={field.name}>
                      {field.label}

                      <div className="profile-password-wrap">
                        <input
                          type={
                            showPasswords[field.name] ? "text" : "password"
                          }
                          name={field.name}
                          value={passwords[field.name]}
                          onChange={handlePasswordChange}
                          placeholder={field.placeholder}
                          autoComplete="off"
                          required
                        />

                        <button
                          type="button"
                          onClick={() => togglePassword(field.name)}
                          aria-label={
                            showPasswords[field.name]
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showPasswords[field.name] ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </label>
                  ))}
                </div>

                {passwordNotice && (
                  <div className="profile-password-notice" role="status">
                    {passwordNotice}
                  </div>
                )}

                <div className="profile-form-actions">
                  <button type="submit" className="profile-save-btn">
                    <LockKeyhole size={17} /> Update password
                  </button>
                </div>
              </form>
            </section>

            <section className="profile-card">
              <div className="profile-card-heading">
                <div className="profile-heading-icon">
                  <Bell size={20} />
                </div>

                <div>
                  <h2>Notification preferences</h2>
                  <p>Choose which updates you want to see.</p>
                </div>
              </div>

              <div className="profile-notification-list">
                {[
                  {
                    name: "donationUpdates",
                    title: "Donation updates",
                    description:
                      "When donations are accepted, allocated, or completed.",
                  },
                  {
                    name: "pickupReminders",
                    title: "Pickup reminders",
                    description:
                      "Updates about pickup arrangements and distribution.",
                  },
                  {
                    name: "expiryAlerts",
                    title: "Expiry and deadline alerts",
                    description:
                      "Reminders for approaching food expiry and use-by dates.",
                  },
                  {
                    name: "achievementUpdates",
                    title: "Achievements and certificates",
                    description:
                      "Updates about earned badges and milestone certificates.",
                  },
                ].map((item) => (
                  <div className="profile-notification-row" key={item.name}>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </div>

                    <button
                      type="button"
                      className={`profile-toggle ${
                        notifications[item.name] ? "enabled" : ""
                      }`}
                      role="switch"
                      aria-checked={notifications[item.name]}
                      aria-label={item.title}
                      onClick={() => toggleNotification(item.name)}
                    >
                      <span />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <div className="profile-security-note">
              <ShieldCheck size={19} />
              <p>
                <strong>Your privacy matters.</strong> Account changes,
                password updates, and notification preferences will be
                securely saved after backend integration.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}