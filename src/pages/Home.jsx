
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Leaf,
  MapPin,
  PackageCheck,
  Recycle,
  Shirt,
  Sprout,
  Users,
  Utensils,
  HandHeart,
  CheckCircle2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const categories = [
  {
    number: "01",
    title: "Fresh food",
    description:
      "Share surplus meals and good food before it goes to waste.",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=850&q=85",
    icon: Utensils,
    className: "category-food",
  },
  {
    number: "02",
    title: "Fruits & vegetables",
    description:
      "Pass on fresh produce to people who can use it.",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=850&q=85",
    icon: Sprout,
    className: "category-produce",
  },
  {
    number: "03",
    title: "Clothing",
    description:
      "Give wearable clothes a new home and a new purpose.",
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=850&q=85",
    icon: Shirt,
    className: "category-clothes",
  },
  {
    number: "04",
    title: "Everyday essentials",
    description:
      "Share useful items that can make daily life easier.",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=850&q=85",
    icon: PackageCheck,
    className: "category-essentials",
  },
];

const steps = [
  {
    number: "01",
    title: "Share what you have",
    description:
      "Post your surplus food, clothing or essentials with the quantity and collection details.",
    icon: Heart,
  },
  {
    number: "02",
    title: "Connect with nearby helpers",
    description:
      "Volunteers discover available donations near them and choose how much they can collect.",
    icon: MapPin,
  },
  {
    number: "03",
    title: "Deliver the good",
    description:
      "Donations are collected and distributed to people and communities who need them.",
    icon: HandHeart,
  },
];

function SectionHeading({ eyebrow, title, description, centered = false }) {
  return (
    <div className={`section-heading ${centered ? "text-center mx-auto" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* HERO */}
        <section className="hero-section">
          <div className="container">
            <div className="hero-grid">
              <div className="hero-copy">
                <div className="hero-pill">
                  <span className="live-dot" />
                  A little sharing goes a long way
                </div>

                <h1>
                  Don’t Waste It.
                  <span>Share It.</span>
                </h1>

                <p className="hero-description">
                  From surplus meals to everyday essentials,
                  ShareCycle connects what we can give with
                  the people who need it most.
                </p>

                
<div className="hero-actions">
  <Link
    to="/register?role=donor"
    className="btn btn-primary-green btn-lg"
  >
    I want to donate <ArrowUpRight size={19} />
  </Link>

  <Link
    to="/register?role=volunteer"
    className="btn btn-outline-green btn-lg"
  >
    Become a volunteer <ArrowRight size={18} />
  </Link>
</div>


                <div className="hero-trust">
                  <div className="trust-icon">
                    <Heart size={18} />
                  </div>
                  <div>
                    <strong>Small acts. Real impact.</strong>
                    <span>Every contribution matters.</span>
                  </div>
                </div>
              </div>

              <div className="hero-visual">
                <div className="hero-image-frame">
                  <img
                    src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1100&q=90"
                    alt="Fresh, nourishing food ready to be shared"
                  />

                  <div className="image-label">
                    <span className="image-label-icon">
                      <Sprout size={20} />
                    </span>
                    <span>
                      <strong>Goodness, passed on.</strong>
                      <small>Make the most of what we have.</small>
                    </span>
                  </div>
                </div>

                <div className="floating-note floating-note-top">
                  <span className="floating-icon coral-icon">
                    <Recycle size={19} />
                  </span>
                  <span>
                    <strong>Waste less</strong>
                    <small>Give things a second life</small>
                  </span>
                </div>

                <div className="floating-note floating-note-bottom">
                  <span className="floating-icon sage-icon">
                    <HandHeart size={19} />
                  </span>
                  <span>
                    <strong>Help more</strong>
                    <small>One community at a time</small>
                  </span>
                </div>

                <div className="hero-decoration hero-decoration-one" />
                <div className="hero-decoration hero-decoration-two" />
              </div>
            </div>

            <div className="hero-bottom-note">
              <span>FOOD</span>
              <span className="note-dot" />
              <span>CLOTHING</span>
              <span className="note-dot" />
              <span>ESSENTIALS</span>
              <span className="note-dot" />
              <span>COMMUNITY</span>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="categories-section section-padding" id="categories">
          <div className="container">
            <div className="section-top-row">
              <SectionHeading
                eyebrow="A SECOND LIFE FOR GOOD THINGS"
                title="Good things deserve to be shared."
                description="A little extra in one place can mean a lot to someone somewhere else."
              />
              <Link to="/register" className="text-link desktop-link">
                Start sharing <ArrowUpRight size={17} />
              </Link>
            </div>

            <div className="row g-4 category-row">
              {categories.map((category) => {
                const Icon = category.icon;

                return (
                  <div className="col-12 col-sm-6 col-lg-3" key={category.number}>
                    <article className={`category-card ${category.className}`}>
                      <div className="category-image">
                        <img src={category.image} alt={category.title} loading="lazy" />
                        <span className="category-number">{category.number}</span>
                        <span className="category-icon">
                          <Icon size={20} />
                        </span>
                      </div>

                      <div className="category-content">
                        <h3>{category.title}</h3>
                        <p>{category.description}</p>
                        <Link
                          to="/register"
                          className="category-link"
                          aria-label={`Share ${category.title}`}
                        >
                          Share something <ArrowRight size={16} />
                        </Link>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="how-section section-padding" id="how-it-works">
          <div className="container">
            <SectionHeading
              eyebrow="THREE SIMPLE STEPS"
              title="From extra to essential."
              description="Making a difference doesn't have to be complicated. Here's how we make sharing happen."
              centered
            />

            <div className="row g-4 steps-row">
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <div className="col-md-4" key={step.number}>
                    <article className="step-card">
                      <div className="step-top">
                        <span className="step-number">{step.number}</span>
                        <span className="step-icon">
                          <Icon size={24} />
                        </span>
                      </div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </article>
                  </div>
                );
              })}
            </div>

            <div className="how-bottom">
              <span><CheckCircle2 size={17} /> Easy to get started</span>
              <span><CheckCircle2 size={17} /> Local community connections</span>
              <span><CheckCircle2 size={17} /> Every contribution counts</span>
            </div>
          </div>
        </section>

        {/* IMPACT */}
        <section className="impact-section section-padding" id="impact">
          <div className="container">
            <div className="impact-panel">
              <div className="impact-copy">
                <span className="eyebrow light-eyebrow">THE DIFFERENCE WE CAN MAKE</span>
                <h2>
                  Imagine what we could do
                  <br />
                  <span>if nothing useful went to waste.</span>
                </h2>
                <p>
                  Every shared meal, every donated dress and every
                  useful item can help build a more caring community.
                  It starts with one person choosing to share.
                </p>
                <Link to="/register" className="btn btn-coral btn-lg">
                  Be part of the change <ArrowUpRight size={18} />
                </Link>
              </div>

              <div className="impact-art">
                <div className="impact-orbit orbit-one" />
                <div className="impact-orbit orbit-two" />
                <div className="impact-center">
                  <Sprout size={61} strokeWidth={1.3} />
                </div>
                <div className="impact-bubble bubble-one">
                  <Heart size={23} />
                </div>
                <div className="impact-bubble bubble-two">
                  <Leaf size={23} />
                </div>
                <div className="impact-bubble bubble-three">
                  <Users size={23} />
                </div>
              </div>
            </div>

            <div className="impact-footnote">
              <span className="impact-footnote-icon"><Sprout size={18} /></span>
              <p>
                ShareCycle is built around a simple belief: what one person
                no longer needs might be exactly what another person needs.
              </p>
            </div>
          </div>
        </section>

        {/* COMMUNITY CTA */}
        <section className="community-section">
          <div className="container">
            <div className="community-card">
              <div>
                <span className="eyebrow">YOUR COMMUNITY NEEDS YOU</span>
                <h2>There's always something good to pass on.</h2>
                <p>
                  Be the reason something useful finds the right home.
                  Start your ShareCycle journey today.
                </p>
              </div>

              <div className="community-actions">
                <Link to="/register" className="btn btn-primary-green btn-lg">
                  Get started <ArrowUpRight size={18} />
                </Link>
                <span>No contribution is too small.</span>
              </div>

              <div className="community-decoration">
                <Sprout size={135} strokeWidth={0.8} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;
