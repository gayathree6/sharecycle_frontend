
import { Link } from "react-router-dom";
import { Sprout, Heart, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main row g-4">
          <div className="col-lg-5">
            <Link to="/" className="brand-lockup footer-brand">
              <span className="brand-icon">
                <Sprout size={23} />
              </span>
              <span>
                ShareCycle
                <small>GOOD THINGS GO AROUND</small>
              </span>
            </Link>

            <p className="footer-description">
              Turning what we have into what someone needs.
              Together, we can build a world where less goes
              to waste and more goes to people.
            </p>

            <span className="footer-heart">
              Made for a kinder world <Heart size={15} />
            </span>
          </div>

          <div className="col-6 col-lg-2 offset-lg-1">
            <h6>Explore</h6>
            <a href="#how-it-works">How it works</a>
            <a href="#categories">What we share</a>
            <a href="#impact">Our impact</a>
          </div>

          <div className="col-6 col-lg-2">
            <h6>Get involved</h6>
            <Link to="/register">Become a donor</Link>
            <Link to="/register">Volunteer with us</Link>
            <Link to="/login">Member login</Link>
          </div>

          <div className="col-lg-2">
            <h6>Be part of it</h6>
            <p className="footer-small">
              Every useful item deserves a second chance.
            </p>
            <Link to="/register" className="footer-cta">
              Join ShareCycle <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ShareCycle</span>
          <span>Share more. Waste less. Help more.</span>
        </div>
      </div>
    </footer>
  );
}
