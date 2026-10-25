
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sprout,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
  ArrowLeft,
  Heart,
  Leaf,
  HandHeart,
} from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    
  }

  return (
    <main className="auth-page">
      <Link to="/" className="auth-back-home">
        <ArrowLeft size={17} />
        Back to home
      </Link>

      <div className="auth-layout">
        {/* LEFT SIDE */}
        <section className="auth-visual">
          <Link to="/" className="brand-lockup auth-brand">
            <span className="brand-icon">
              <Sprout size={23} />
            </span>
            <span>
              ShareCycle
              <small>GOOD THINGS GO AROUND</small>
            </span>
          </Link>

          <div className="auth-visual-content">
            <span className="eyebrow auth-eyebrow">
              A COMMUNITY BUILT ON SHARING
            </span>

            <h1>
              Together, we
              <br />
              can make <span>more</span>
              <br />
              possible.
            </h1>

            <p>
              Every shared meal, every donated dress, every
              helping hand makes a difference. Your next
              good thing starts here.
            </p>

            <div className="auth-photo">
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=85"
                alt="Volunteers preparing donations for their community"
              />

              <div className="auth-photo-caption">
                <span className="auth-photo-icon">
                  <HandHeart size={22} />
                </span>
                <div>
                  <strong>Goodness goes further together.</strong>
                  <span>Be part of something meaningful.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-visual-footer">
            <span><Heart size={15} /> Made for a kinder world</span>
            <span><Leaf size={15} /> Share more. Waste less.</span>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="auth-form-side">
          <div className="auth-form-container">
            <div className="auth-mobile-brand">
              <span className="brand-icon">
                <Sprout size={22} />
              </span>
              <strong>ShareCycle</strong>
            </div>

            <div className="auth-heading">
              <span className="eyebrow">WELCOME BACK</span>
              <h2>Good to see you again.</h2>
              <p>
                Sign in to continue making a difference.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label htmlFor="login-email">Email address</label>

                <div className="auth-input-wrap">
                  <Mail size={18} />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <div className="auth-label-row">
                  <label htmlFor="login-password">Password</label>
                </div>

                <div className="auth-input-wrap">
                  <LockKeyhole size={18} />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="auth-message" role="alert">
                  {error}
                </div>
              )}

              <button type="submit" className="auth-submit">
                Sign in <ArrowRight size={18} />
              </button>

              <p className="auth-terms">
                By continuing, you agree to use ShareCycle
                responsibly and respectfully.
              </p>
            </form>

            <div className="auth-divider">
              <span>NEW TO SHARECYCLE?</span>
            </div>

            <Link to="/register" className="auth-create-account">
              Create your account <ArrowRight size={17} />
            </Link>

            <div className="auth-bottom-note">
              <span className="auth-bottom-heart">
                <Heart size={16} />
              </span>
              <span>
                <strong>Every little act matters.</strong>
                <small>Thank you for being here.</small>
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
