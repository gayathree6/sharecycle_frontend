
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  Heart,
  MapPin,
  Package,
  Search,
  Shirt,
  SlidersHorizontal,
  Utensils,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./VolunteerDashboard.css";

const sampleDonations = [
  {
    id: 1,
    title: "Fresh Vegetables",
    category: "Food",
    quantity: 5,
    unit: "kg",
    location: "Palakkad, Kerala",
    distance: "2.5 km away",
    pickupDate: "Available today",
    expiryDate: "20 Oct 2026",
    donor: "Green Garden",
    description:
      "Fresh vegetables available for families or organizations in need.",
    status: "Available",
  },
  {
    id: 2,
    title: "Clean Clothes",
    category: "Clothing",
    quantity: 12,
    unit: "pieces",
    location: "Olavakkode, Palakkad",
    distance: "4 km away",
    pickupDate: "Available tomorrow",
    expiryDate: "",
    donor: "Kind Hearts",
    description:
      "Clean clothes in good condition for adults and children.",
    status: "Available",
  },
  {
    id: 3,
    title: "Packed Meals",
    category: "Food",
    quantity: 15,
    unit: "meals",
    location: "Palakkad Town",
    distance: "1.2 km away",
    pickupDate: "Available today",
    expiryDate: "20 Oct 2026",
    donor: "Community Kitchen",
    description:
      "Freshly prepared meals that should be collected promptly.",
    status: "Available",
  },
  {
    id: 4,
    title: "School Supplies",
    category: "Essentials",
    quantity: 20,
    unit: "sets",
    location: "Kallekkad, Palakkad",
    distance: "5 km away",
    pickupDate: "Available this week",
    expiryDate: "",
    donor: "Helping Hands",
    description:
      "Notebooks, pencils and other useful school supplies.",
    status: "Available",
  },
  {
    id: 5,
    title: "Rice and Groceries",
    category: "Essentials",
    quantity: 10,
    unit: "kits",
    location: "Palakkad Town",
    distance: "3 km away",
    pickupDate: "Available today",
    expiryDate: "25 Oct 2026",
    donor: "Hope Foundation",
    description:
      "Grocery kits containing rice and other basic food essentials.",
    status: "Available",
  },
  {
    id: 6,
    title: "Blankets",
    category: "Clothing",
    quantity: 8,
    unit: "pieces",
    location: "Chandranagar, Palakkad",
    distance: "6 km away",
    pickupDate: "Available this week",
    expiryDate: "",
    donor: "Care Circle",
    description:
      "Clean blankets suitable for distribution to people in need.",
    status: "Available",
  },
];

function CategoryIcon({ category }) {
  if (category === "Food") return <Utensils size={23} />;
  if (category === "Clothing") return <Shirt size={23} />;
  return <Package size={23} />;
}

export default function VolunteerDashboard() {
  const [donations, setDonations] = useState(sampleDonations);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [acceptedIds, setAcceptedIds] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [quantities, setQuantities] = useState({});

  const visibleDonations = useMemo(() => {
    let result = donations.filter((donation) => {
      const matchesSearch = [
        donation.title,
        donation.category,
        donation.location,
        donation.donor,
        donation.description,
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        activeCategory === "All" ||
        donation.category === activeCategory;

      return (
        matchesSearch &&
        matchesCategory &&
        donation.status === "Available"
      );
    });

    if (sortBy === "quantity") {
      result = [...result].sort((a, b) => b.quantity - a.quantity);
    }

    if (sortBy === "title") {
      result = [...result].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    return result;
  }, [donations, searchTerm, activeCategory, sortBy]);

  function handleAccept(donation) {
    const quantity = Number(quantities[donation.id] || donation.quantity);

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      quantity > donation.quantity
    ) {
      window.alert(
        `Enter a quantity between 1 and ${donation.quantity}.`
      );
      return;
    }

    const confirmed = window.confirm(
      `Accept ${quantity} ${donation.unit} of "${donation.title}"?`
    );

    if (!confirmed) return;

    setAcceptedIds((previous) => [...previous, donation.id]);

    setDonations((previous) =>
      previous.map((item) => {
        if (item.id !== donation.id) return item;

        const remaining = item.quantity - quantity;

        return {
          ...item,
          quantity: remaining,
          status: remaining === 0 ? "Accepted" : "Available",
        };
      })
    );

    setSelectedDonation(null);

    window.alert(
      "Demo acceptance recorded. This action is temporary and is not yet saved to MongoDB."
    );
  }

  const totalAvailable = donations
    .filter((item) => item.status === "Available")
    .reduce((total, item) => total + item.quantity, 0);

  const foodCount = donations.filter(
    (item) => item.category === "Food" && item.status === "Available"
  ).length;

  const essentialsCount = donations.filter(
    (item) => item.category === "Essentials" && item.status === "Available"
  ).length;

  return (
    <>
      <Navbar />

      <main className="volunteer-page">
        <div className="volunteer-container">
          <section className="volunteer-welcome">
            <div>
              <p className="volunteer-eyebrow">VOLUNTEER DASHBOARD</p>
              <h1>Make a difference today!</h1>
              <p>
                Find donations in your community and help deliver essentials
                to people who need them.
              </p>
            </div>

            <div className="volunteer-welcome-icon">
              <Heart size={42} />
            </div>
          </section>

          <section className="volunteer-stats">
            <article className="volunteer-stat-card">
              <span className="volunteer-stat-icon green">
                <Package size={22} />
              </span>
              <div>
                <p>Available Listings</p>
                <h2>
                  {donations.filter(
                    (item) => item.status === "Available"
                  ).length}
                </h2>
              </div>
            </article>

            <article className="volunteer-stat-card">
              <span className="volunteer-stat-icon orange">
                <Utensils size={22} />
              </span>
              <div>
                <p>Food Donations</p>
                <h2>{foodCount}</h2>
              </div>
            </article>

            <article className="volunteer-stat-card">
              <span className="volunteer-stat-icon blue">
                <Package size={22} />
              </span>
              <div>
                <p>Available Quantity</p>
                <h2>{totalAvailable}</h2>
              </div>
            </article>

            <article className="volunteer-stat-card">
              <span className="volunteer-stat-icon purple">
                <Shirt size={22} />
              </span>
              <div>
                <p>Essential Listings</p>
                <h2>{essentialsCount}</h2>
              </div>
            </article>
          </section>

          <section className="volunteer-listing-section">
            <div className="volunteer-section-heading">
              <div>
                <p className="volunteer-eyebrow">DISCOVER DONATIONS</p>
                <h2>Available near you</h2>
                <p>Browse listings and choose what you can help collect.</p>
              </div>
            </div>

            <div className="volunteer-toolbar">
              <label className="volunteer-search">
                <Search size={19} />
                <input
                  type="search"
                  placeholder="Search donations, categories or locations..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </label>

              <label className="volunteer-sort">
                <SlidersHorizontal size={17} />
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="default">Sort: Default</option>
                  <option value="quantity">Largest quantity</option>
                  <option value="title">Name A–Z</option>
                </select>
              </label>
            </div>

            <div className="volunteer-category-tabs">
              {["All", "Food", "Clothing", "Essentials"].map((category) => (
                <button
                  type="button"
                  key={category}
                  className={activeCategory === category ? "active" : ""}
                  onClick={() => setActiveCategory(category)}
                >
                  {category === "All" && <Filter size={16} />}
                  {category === "Food" && <Utensils size={16} />}
                  {category === "Clothing" && <Shirt size={16} />}
                  {category === "Essentials" && <Package size={16} />}
                  {category}
                </button>
              ))}
            </div>

            <div className="volunteer-results-heading">
              <span>{visibleDonations.length} donations found</span>
              <span>Sample listings for design preview</span>
            </div>

            {visibleDonations.length > 0 ? (
              <div className="volunteer-donation-grid">
                {visibleDonations.map((donation) => (
                  <article
                    className="volunteer-donation-card"
                    key={donation.id}
                  >
                    <div className={`volunteer-card-banner ${donation.category.toLowerCase()}`}>
                      <span className="volunteer-category-label">
                       <CategoryIcon category={donation.category} />
                        {donation.category}
                      </span>
                      <span className="volunteer-available-label">
                        Available
                      </span>
                    </div>

                    <div className="volunteer-card-body">
                      <div className="volunteer-card-title">
                        <h3>{donation.title}</h3>
                        <span className="volunteer-quantity">
                          {donation.quantity} {donation.unit}
                        </span>
                      </div>

                      <p className="volunteer-card-description">
                        {donation.description}
                      </p>

                      <div className="volunteer-card-info">
                        <span>
                          <MapPin size={16} />
                          {donation.location}
                        </span>
                        <span>
                          <Clock3 size={16} />
                          {donation.pickupDate}
                        </span>
                        {donation.expiryDate && (
                          <span>
                            <CalendarDays size={16} />
                            Best before: {donation.expiryDate}
                          </span>
                        )}
                      </div>

                      <div className="volunteer-donor-info">
                        <span className="volunteer-donor-avatar">
                          {donation.donor.charAt(0)}
                        </span>
                        <div>
                          <small>Donated by</small>
                          <strong>{donation.donor}</strong>
                        </div>
                        <span className="volunteer-distance">
                          {donation.distance}
                        </span>
                      </div>

                      
<div className="volunteer-card-actions">
  <Link
    to={`/donation/${donation.id}`}
    className="volunteer-outline-btn"
  >
    View Details
  </Link>

  <Link
    to={`/map?title=${encodeURIComponent(donation.title)}&location=${encodeURIComponent(donation.location)}&category=${encodeURIComponent(donation.category)}&quantity=${donation.quantity}&unit=${encodeURIComponent(donation.unit)}`}
    className="volunteer-outline-btn volunteer-view-map-btn"
  >
    <MapPin size={16} />
    View on Map
  </Link>

  <button
    type="button"
    className="volunteer-accept-btn"
    onClick={() => setSelectedDonation(donation)}
  >
    Accept Donation
  </button>
</div>

                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="volunteer-empty-state">
                <Package size={42} />
                <h3>No donations found</h3>
                <p>Try another search term or select a different category.</p>
                <button
                  type="button"
                  className="volunteer-outline-btn"
                  onClick={() => {
                    setSearchTerm("");
                    setActiveCategory("All");
                    setSortBy("default");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>

          <section className="volunteer-impact-banner">
            <div className="volunteer-impact-icon">
              <Heart size={26} />
            </div>
            <div>
              <h3>Your time can change someone's day.</h3>
              <p>
                Every successful pickup helps reduce waste and brings useful
                items to someone who needs them.
              </p>
            </div>
            <Link to="/achievements" className="volunteer-impact-link">
              My achievements
            </Link>
          </section>

          {selectedDonation && (
            <div
              className="volunteer-modal-backdrop"
              onClick={() => setSelectedDonation(null)}
              role="presentation"
            >
              <section
                className="volunteer-detail-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="volunteer-modal-title"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  className="volunteer-modal-close"
                  aria-label="Close donation details"
                  onClick={() => setSelectedDonation(null)}
                >
                  ×
                </button>

                <p className="volunteer-eyebrow">DONATION DETAILS</p>
                <h2 id="volunteer-modal-title">{selectedDonation.title}</h2>
                <p>{selectedDonation.description}</p>

                <div className="volunteer-modal-details">
                  <span>
                    <Package size={17} />
                    Available: {selectedDonation.quantity} {selectedDonation.unit}
                  </span>
                  <span>
                    <MapPin size={17} />
                    {selectedDonation.location}
                  </span>
                  <span>
                    <Clock3 size={17} />
                    {selectedDonation.pickupDate}
                  </span>
                  <span>
                    <Heart size={17} />
                    Donor: {selectedDonation.donor}
                  </span>
                </div>

                <label className="volunteer-quantity-label">
                  Quantity you can collect
                  <input
                    type="number"
                    min="1"
                    max={selectedDonation.quantity}
                    value={
                      quantities[selectedDonation.id] ??
                      selectedDonation.quantity
                    }
                    onChange={(event) =>
                      setQuantities((previous) => ({
                        ...previous,
                        [selectedDonation.id]: event.target.value,
                      }))
                    }
                  />
                </label>

                <p className="volunteer-demo-note">
                  Demo only: acceptance is temporary and is not sent to a donor
                  or stored in MongoDB yet.
                </p>

                <button
                  type="button"
                  className="volunteer-accept-btn volunteer-modal-accept"
                  onClick={() => handleAccept(selectedDonation)}
                >
                  <CheckCircle2 size={18} />
                  Confirm Acceptance
                </button>
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
