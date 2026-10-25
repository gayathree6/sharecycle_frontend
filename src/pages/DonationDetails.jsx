
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Clock,
  Package,
  Heart,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Utensils,
  Shirt,
  HandHeart,
  Building2,
  UserRound,
  Phone,
  Info,
   
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./DonationDetails.css";

const sampleDonations = {
  1: {
    id: 1,
    title: "Fresh Vegetables",
    category: "Food",
    description:
      "Fresh vegetables collected from our local store. Suitable for preparing healthy meals for families in need. Please collect within the stated pickup period.",
    quantity: 20,
    unit: "kg",
    available: 20,
    location: "Palakkad, Kerala",
    donor: "Green Basket Store",
    donorType: "Local store",
    date: "20 October 2026",
    pickup: "Today, 2:00 PM – 5:00 PM",
    expiry: "21 October 2026",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=85",
    status: "Available",
    preparation: "Prepared / collected today",
    consumption: "Consume as soon as possible",
  },
  2: {
    id: 2,
    title: "Packed Meals",
    category: "Food",
    description:
      "Freshly prepared vegetarian meals available for collection and distribution. Please coordinate pickup so that the food reaches recipients promptly.",
    quantity: 30,
    unit: "meals",
    available: 30,
    location: "Kozhikode, Kerala",
    donor: "Community Kitchen",
    donorType: "Organization",
    date: "20 October 2026",
    pickup: "Today, 12:00 PM – 3:00 PM",
    expiry: "20 October 2026",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85",
    status: "Available",
    preparation: "Prepared today at 10:00 AM",
    consumption: "Collect and distribute promptly",
  },
  3: {
    id: 3,
    title: "Clean Clothes",
    category: "Clothing",
    description:
      "Clean, gently used clothing in good condition. Available for individuals or organizations that can distribute the items to people who need them.",
    quantity: 25,
    unit: "pieces",
    available: 25,
    location: "Thrissur, Kerala",
    donor: "Community Donor",
    donorType: "Individual",
    date: "19 October 2026",
    pickup: "21 October, 10:00 AM – 4:00 PM",
    expiry: "Not applicable",
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=85",
    status: "Available",
    preparation: "Clean and ready for collection",
    consumption: "Not applicable",
  },
  4: {
    id: 4,
    title: "Essential Care Kits",
    category: "Essentials",
    description:
      "Essential personal care supplies packed into kits. Available for collection by volunteers and organizations supporting local communities.",
    quantity: 15,
    unit: "kits",
    available: 15,
    location: "Palakkad, Kerala",
    donor: "Helping Hands Organization",
    donorType: "Organization",
    date: "20 October 2026",
    pickup: "21 October, 9:00 AM – 1:00 PM",
    expiry: "Check individual product labels",
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85",
    status: "Available",
    preparation: "Packed and ready",
    consumption: "Follow individual product labels",
  },
};

export default function DonationDetails() {
  const { id } = useParams();

  const donation = sampleDonations[id] || sampleDonations[1];

  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [requested, setRequested] = useState(false);
  const [saved, setSaved] = useState(false);

  const categoryIcon =
    donation.category === "Food" ? (
      <Utensils size={17} />
    ) : donation.category === "Clothing" ? (
      <Shirt size={17} />
    ) : (
      <Package size={17} />
    );

  const handleRequest = (event) => {
    event.preventDefault();

    if (quantity < 1 || quantity > donation.available) {
      setMessage("Please enter a valid available quantity.");
      return;
    }

    setRequested(true);
    setMessage(
      `Demo request submitted for ${quantity} ${donation.unit}. Backend integration is required to notify the donor.`
    );
  };

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: donation.title,
          text: `View this ShareCycle donation: ${donation.title}`,
          url,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setMessage("Donation link copied to clipboard.");
      } else {
        setMessage("Copy this page URL to share the donation.");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setMessage("Unable to share right now. Please copy the page URL.");
      }
    }
  };

  return (
    <div className="donation-details-page">
      <Navbar />

      <main className="donation-details-main">
        <Link to="/volunteer-dashboard" className="donation-back-link">
          <ArrowLeft size={18} />
          Back to donations
        </Link>

        <div className="donation-details-layout">
          <section className="donation-details-left">
            <div className="donation-photo-wrapper">
              <img
                src={donation.image}
                alt={donation.title}
                className="donation-main-photo"
              />

              <span className="donation-availability-badge">
                <span />
                {donation.status}
              </span>

              <button
                type="button"
                className={`donation-save-button ${
                  saved ? "is-saved" : ""
                }`}
                onClick={() => setSaved((current) => !current)}
                aria-label={saved ? "Remove from saved" : "Save donation"}
                title={saved ? "Remove from saved" : "Save donation"}
              >
                <Heart size={20} fill={saved ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="donation-detail-card">
              <div className="donation-detail-title-row">
                <div>
                  <span className="donation-category-label">
                    {categoryIcon}
                    {donation.category}
                  </span>

                  <h1>{donation.title}</h1>
                </div>

                <button
                  type="button"
                  className="donation-share-button"
                  onClick={handleShare}
                  aria-label="Share donation"
                >
                  <Share2 size={18} />
                </button>
              </div>

              <p className="donation-description">
                {donation.description}
              </p>

              <div className="donation-quantity-panel">
                <div>
                  <span>Available quantity</span>
                  <strong>
                    {donation.available} {donation.unit}
                  </strong>
                </div>

                <div className="donation-quantity-progress">
                  <div
                    style={{
                      width: `${
                        (donation.available / donation.quantity) * 100
                      }%`,
                    }}
                  />
                </div>

                <span className="donation-quantity-caption">
                  Available for volunteer requests
                </span>
              </div>

              <div className="donation-information-grid">
                <div className="donation-information-item">
                  <div className="donation-information-icon">
                    <MapPin size={19} />
                  </div>

                  <div>
                    <span>Pickup location</span>
                    <strong>{donation.location}</strong>
                  </div>
                </div>

                <div className="donation-information-item">
                  <div className="donation-information-icon">
                    <CalendarDays size={19} />
                  </div>

                  <div>
                    <span>Listed on</span>
                    <strong>{donation.date}</strong>
                  </div>
                </div>

                <div className="donation-information-item">
                  <div className="donation-information-icon">
                    <Clock size={19} />
                  </div>

                  <div>
                    <span>Pickup availability</span>
                    <strong>{donation.pickup}</strong>
                  </div>
                </div>

                <div className="donation-information-item">
                  <div className="donation-information-icon">
                    <Package size={19} />
                  </div>

                  <div>
                    <span>Expiry / best-before</span>
                    <strong>{donation.expiry}</strong>
                  </div>
                </div>
              </div>
              
<Link
  to={`/map?title=${encodeURIComponent(donation.title)}&location=${encodeURIComponent(donation.location)}&category=${encodeURIComponent(donation.category)}&quantity=${donation.available}&unit=${encodeURIComponent(donation.unit)}`}
  className="donation-view-map-button"
>
  <MapPin size={18} />
  View on Map
</Link>

            </div>

            <div className="donation-handling-card">
              <div className="donation-handling-heading">
                <Info size={19} />
                <h2>Important information</h2>
              </div>

              {donation.category === "Food" && (
                <>
                  <div className="donation-handling-row">
                    <CheckCircle2 size={17} />
                    <div>
                      <strong>Preparation / collection</strong>
                      <p>{donation.preparation}</p>
                    </div>
                  </div>

                  <div className="donation-handling-row">
                    <AlertTriangle size={17} />
                    <div>
                      <strong>Recommended consumption</strong>
                      <p>{donation.consumption}</p>
                    </div>
                  </div>
                </>
              )}

              {donation.category !== "Food" && (
                <div className="donation-handling-row">
                  <CheckCircle2 size={17} />
                  <div>
                    <strong>Condition and handling</strong>
                    <p>
                      {donation.preparation}. Check product labels or
                      item condition before distribution.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <aside className="donation-details-right">
            <div className="donation-donor-card">
              <span className="donation-card-eyebrow">DONATED BY</span>

              <div className="donation-donor-profile">
                <div className="donation-donor-avatar">
                  <Building2 size={23} />
                </div>

                <div>
                  <h2>{donation.donor}</h2>
                  <span>{donation.donorType}</span>
                </div>
              </div>

              <div className="donation-donor-note">
                <HandHeart size={18} />
                <p>
                  This donor is sharing useful resources with people
                  who need them.
                </p>
              </div>
            </div>

            <div className="donation-request-card">
              <h2>Request this donation</h2>

              <p>
                Choose the quantity you can collect and distribute.
                Partial quantities help more volunteers participate.
              </p>

              {requested ? (
                <div className="donation-request-success">
                  <CheckCircle2 size={31} />
                  <h3>Request recorded</h3>
                  <p>
                    {message}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setRequested(false);
                      setMessage("");
                    }}
                  >
                    Make another demo request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRequest}>
                  <label htmlFor="donation-quantity">
                    Quantity to collect
                  </label>

                  <div className="donation-quantity-input">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((current) => Math.max(1, current - 1))
                      }
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <input
                      id="donation-quantity"
                      type="number"
                      min="1"
                      max={donation.available}
                      value={quantity}
                      onChange={(event) => {
                        setQuantity(Number(event.target.value));
                        setMessage("");
                      }}
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((current) =>
                          Math.min(donation.available, current + 1)
                        )
                      }
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <span className="donation-maximum">
                    Maximum available: {donation.available} {donation.unit}
                  </span>

                  <label htmlFor="donation-volunteer-note">
                    Message (optional)
                  </label>

                  <textarea
                    id="donation-volunteer-note"
                    placeholder="Add pickup or distribution details..."
                    rows="3"
                  />

                  {message && (
                    <p className="donation-request-message" role="status">
                      {message}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="donation-request-submit"
                    disabled={
                      quantity < 1 || quantity > donation.available
                    }
                  >
                    <HandHeart size={18} />
                    Request donation
                  </button>
                </form>
              )}

              <div className="donation-request-disclaimer">
                <UserRound size={16} />
                <span>
                  Requests are demonstrated locally. Donor notification
                  and quantity allocation require the backend.
                </span>
              </div>
            </div>

            <div className="donation-safety-card">
              <ShieldIcon />
              <div>
                <h3>Collect responsibly</h3>
                <p>
                  Confirm the pickup time, check the item condition,
                  and distribute resources safely.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ShieldIcon() {
  return <CheckCircle2 size={22} />;
}
