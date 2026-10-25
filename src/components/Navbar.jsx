
import { Link } from "react-router-dom";
import { Sprout, ArrowUpRight, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg share-navbar">
      <div className="container">
        <Link className="navbar-brand brand-lockup" to="/">
          <span className="brand-icon">
            <Sprout size={23} strokeWidth={2.2} />
          </span>
          <span>
            ShareCycle
            <small>GOOD THINGS GO AROUND</small>
          </span>
        </Link>

        <button
          className="navbar-toggler custom-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#shareNavigation"
          aria-controls="shareNavigation"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <Menu size={23} />
        </button>

        <div
          className="collapse navbar-collapse"
          id="shareNavigation"
        >
          <ul className="navbar-nav mx-auto align-items-lg-center gap-lg-3">
            <li className="nav-item">
              <a className="nav-link" href="#how-it-works">
                How it works
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#categories">
                What we share
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#impact">
                Our impact
              </a>
            </li>
          </ul>

          <div className="navbar-actions d-flex align-items-center gap-3">
            <Link className="login-link" to="/login">
              Log in
            </Link>
            <Link className="btn btn-primary-green" to="/register">
              Join the movement <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
