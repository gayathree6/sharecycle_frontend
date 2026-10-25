
import { useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Heart,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const [searchParams] = useSearchParams();

const initialRole =
  searchParams.get("role") === "volunteer" ? "volunteer" : "donor";

const [role, setRole] = useState(initialRole);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");

    if (password !== confirmPassword) {
      setError("Your passwords do not match. Please try again.");
      return;
    }

    
  };

  return (
    <main className="register-page">
      <section className="register-visual">
        <div className="register-visual-image" />

        <div className="register-visual-content">
          <Link to="/" className="register-logo">
            <span className="register-logo-icon">
              <HeartHandshake size={25} strokeWidth={1.8} />
            </span>
            <span>ShareCycle<span className="register-logo-dot">.</span></span>
          </Link>

          <div className="register-story">
            <span className="register-kicker">
              <Leaf size={15} />
              GIVE A LITTLE. CHANGE A LOT.
            </span>

            <h1>
              Good things
              <br />
              deserve a
              <br />
              <em>second life.</em>
            </h1>

            <p>
              Your extra can be someone else's enough.
              Join a community turning surplus into
              support, one thoughtful act at a time.
            </p>

            <div className="register-impact-card">
              <div className="register-impact-icon">
                <Sprout size={23} />
              </div>

              <div>
                <strong>Make kindness a habit.</strong>
                <span>Small contributions. Real-world impact.</span>
              </div>

              <Heart size={19} className="register-impact-heart" />
            </div>
          </div>

          <div className="register-visual-footer">
            <div className="register-footer-mark">
              <ShieldCheck size={16} />
              Community-powered giving
            </div>
            <span>Share more. Waste less.</span>
          </div>
        </div>
      </section>

      <section className="register-main">
        <div className="register-topbar">
          <Link to="/" className="register-back">
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <span className="register-step-label">
            ALREADY A MEMBER? <Link to="/login">Sign in</Link>
          </span>
        </div>

        <div className="register-form-wrap">
          <div className="register-mobile-logo">
            <HeartHandshake size={25} />
            ShareCycle<span>.</span>
          </div>

          <div className="register-heading">
            <span className="register-eyebrow">YOUR JOURNEY STARTS HERE</span>
            <h2>Create an account<span>.</span></h2>
            <p>
              Become part of something good. It only takes a minute.
            </p>
          </div>

          <form className="register-form" onSubmit={handleRegister}>
            <div className="register-role-label">
              <span>HOW WOULD YOU LIKE TO HELP?</span>
              <span className="register-optional">Choose a role</span>
            </div>

            <div className="register-role-options">
              <button
                type="button"
                className={`register-role-card ${role === "donor" ? "selected" : ""}`}
                onClick={() => setRole("donor")}
                aria-pressed={role === "donor"}
              >
                <span className="register-role-icon donor-icon">
                  <Heart size={20} />
                </span>
                <span className="register-role-copy">
                  <strong>I'm a Donor</strong>
                  <small>Share useful items</small>
                </span>
                <span className="register-role-check">
                  {role === "donor" && <Check size={14} />}
                </span>
              </button>

              <button
                type="button"
                className={`register-role-card ${role === "volunteer" ? "selected" : ""}`}
                onClick={() => setRole("volunteer")}
                aria-pressed={role === "volunteer"}
              >
                <span className="register-role-icon volunteer-icon">
                  <Sprout size={20} />
                </span>
                <span className="register-role-copy">
                  <strong>I'm a Volunteer</strong>
                  <small>Connect and deliver</small>
                </span>
                <span className="register-role-check">
                  {role === "volunteer" && <Check size={14} />}
                </span>
              </button>
            </div>

            <input type="hidden" name="role" value={role} />

            <div className="register-fields-grid">
              <div className="register-field">
                <label htmlFor="register-name">Full name</label>
                <input
                  id="register-name"
                  name="fullName"
                  type="text"
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="register-field">
                <label htmlFor="register-username">Username</label>
                <input
                  id="register-username"
                  name="username"
                  type="text"
                  placeholder="Choose a username"
                  autoComplete="username"
                  minLength={3}
                  required
                />
              </div>
            </div>

            <div className="register-field">
              <label htmlFor="register-email">Email address</label>
              <input
                id="register-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="register-fields-grid">
              <div className="register-field">
                <label htmlFor="register-password">Password</label>
                <div className="register-password-wrap">
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    className="register-eye"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="register-field">
                <label htmlFor="register-confirm">Confirm password</label>
                <div className="register-password-wrap">
                  <input
                    id="register-confirm"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    className="register-eye"
                    onClick={() =>
                      setShowConfirmPassword((value) => !value)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <label className="register-terms">
              <input type="checkbox" name="terms" required />
              <span>
                I agree to the <a href="#terms">Terms of Service</a> and{" "}
                <a href="#privacy">Privacy Policy</a>.
              </span>
            </label>

            {error && (
              <p className="register-feedback error" role="alert">
                {error}
              </p>
            )}

            {message && (
              <p className="register-feedback success" role="status">
                {message}
              </p>
            )}

            <button type="submit" className="register-submit">
              Create my account
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="register-secure-note">
            <ShieldCheck size={16} />
            <span>Your information stays private and secure.</span>
          </div>

          <p className="register-bottom-note">
            A little kindness goes a long way. <Heart size={13} />
          </p>
        </div>
      </section>
    </main>
  );
}

export default Register;
