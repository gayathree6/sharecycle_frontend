
import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import {
  MapPin,
  Search,
  Utensils,
  Shirt,
  Package,
  Navigation,
  Clock,
  ArrowRight,
  LocateFixed,
  List,
  Map as MapIcon,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "leaflet/dist/leaflet.css";
import "./MapPage.css";
import { ExternalLink } from "lucide-react";
const sampleDonations = [
  {
    id: 1,
    title: "Fresh Vegetables",
    category: "Food",
    quantity: "20 kg",
    location: "Palakkad, Kerala",
    pickup: "Today, 2 PM – 5 PM",
    latitude: 10.7867,
    longitude: 76.6548,
    color: "#258451",
  },
  {
    id: 2,
    title: "Packed Meals",
    category: "Food",
    quantity: "30 meals",
    location: "Kozhikode, Kerala",
    pickup: "Today, 12 PM – 3 PM",
    latitude: 11.2588,
    longitude: 75.7804,
    color: "#258451",
  },
  {
    id: 3,
    title: "Clean Clothes",
    category: "Clothing",
    quantity: "25 pieces",
    location: "Thrissur, Kerala",
    pickup: "21 October, 10 AM – 4 PM",
    latitude: 10.5276,
    longitude: 76.2144,
    color: "#8b5cc7",
  },
  {
    id: 4,
    title: "Essential Care Kits",
    category: "Essentials",
    quantity: "15 kits",
    location: "Palakkad, Kerala",
    pickup: "21 October, 9 AM – 1 PM",
    latitude: 10.7752,
    longitude: 76.6388,
    color: "#d49a32",
  },
  {
    id: 5,
    title: "Fresh Fruits",
    category: "Food",
    quantity: "12 kg",
    location: "Malappuram, Kerala",
    pickup: "Today, 3 PM – 6 PM",
    latitude: 11.051,
    longitude: 76.0711,
    color: "#258451",
  },
];

const categoryOptions = [
  { label: "All donations", value: "All" },
  { label: "Food", value: "Food" },
  { label: "Clothing", value: "Clothing" },
  { label: "Essentials", value: "Essentials" },
];

function RecenterMap({ donation }) {
  const map = useMap();

  const handleRecenter = () => {
    map.flyTo(
      [donation.latitude, donation.longitude],
      14,
      { duration: 1 }
    );
  };

  return (
    <button
      type="button"
      className="map-recenter-button"
      onClick={handleRecenter}
      title={`Focus on ${donation.title}`}
    >
      <LocateFixed size={17} />
      Focus selected
    </button>
  );
}

function FocusMapOnDonation({ donation }) {
  const map = useMap();

  useEffect(() => {
    if (!donation) return;

    map.flyTo(
      [donation.latitude, donation.longitude],
      14,
      { duration: 1.2 }
    );
  }, [
    map,
    donation?.id,
    donation?.latitude,
    donation?.longitude,
  ]);

  return null;
}

export default function MapPage() {
  
const [searchParams] = useSearchParams();

const requestedDonation = useMemo(() => {
  const title = searchParams.get("title");
  const location = searchParams.get("location");

  if (!title || !location) return null;

  const place = location.toLowerCase();

  let latitude = 10.8505;
  let longitude = 76.2711;

  if (place.includes("kozhikode")) {
    latitude = 11.2588;
    longitude = 75.7804;
  } else if (place.includes("thrissur")) {
    latitude = 10.5276;
    longitude = 76.2144;
  } else if (place.includes("malappuram")) {
    latitude = 11.051;
    longitude = 76.0711;
  } else if (place.includes("olavakkode")) {
    latitude = 10.798;
    longitude = 76.657;
  } else if (place.includes("kallekkad")) {
    latitude = 10.75;
    longitude = 76.68;
  } else if (place.includes("chandranagar")) {
    latitude = 10.78;
    longitude = 76.69;
  } else if (place.includes("palakkad")) {
    latitude = 10.7867;
    longitude = 76.6548;
  }

  const category = searchParams.get("category") || "Food";

  return {
    id: "requested",
    title,
    location,
    category,
    quantity: `${searchParams.get("quantity") || "1"} ${
      searchParams.get("unit") || "items"
    }`,
    pickup: "Check donation details",
    latitude,
    longitude,
    color:
      category === "Food"
        ? "#258451"
        : category === "Clothing"
          ? "#8b5cc7"
          : "#d49a32",
  };
}, [searchParams]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedDonation, setSelectedDonation] = useState("requested");
  const [view, setView] = useState("split");

  const filteredDonations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const donationsToShow = requestedDonation
  ? [requestedDonation, ...sampleDonations]
  : sampleDonations;

return donationsToShow.filter((donation) => {
      const matchesCategory =
        category === "All" || donation.category === category;

      const matchesSearch =
        !normalizedSearch ||
        donation.title.toLowerCase().includes(normalizedSearch) ||
        donation.location.toLowerCase().includes(normalizedSearch) ||
        donation.category.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
 }, [search, category, requestedDonation]);

  const activeDonation =
    filteredDonations.find(
      (donation) => donation.id === selectedDonation
    ) || filteredDonations[0];

  const getCategoryIcon = (donationCategory, size = 18) => {
    if (donationCategory === "Food") {
      return <Utensils size={size} />;
    }

    if (donationCategory === "Clothing") {
      return <Shirt size={size} />;
    }

    return <Package size={size} />;
  };

  return (
    <div className="sharecycle-map-page">
      <Navbar />

      <main className="sharecycle-map-main">
        <section className="map-page-heading">
          <div>
            <span className="map-eyebrow">DISCOVER NEARBY SUPPORT</span>
            <h1>Donation Map</h1>
            <p>
              Find available donations and explore their pickup
              locations across the community.
            </p>
          </div>

          <div className="map-heading-icon">
            <MapPin size={29} />
          </div>
        </section>

        <section className="map-search-panel">
          <div className="map-search-input-wrapper">
            <Search size={19} />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search donations, categories or locations..."
              aria-label="Search donations"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="map-clear-search"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="map-category-filters">
            {categoryOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                className={
                  category === option.value ? "selected" : ""
                }
                onClick={() => setCategory(option.value)}
              >
                {option.value !== "All" &&
                  getCategoryIcon(option.value, 15)}
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section className="map-results-heading">
          <div>
            <h2>Available nearby</h2>
            <p>
              {filteredDonations.length}{" "}
              {filteredDonations.length === 1
                ? "donation"
                : "donations"}{" "}
              found in the sample listings
            </p>
          </div>

          <div className="map-view-toggle">
            <button
              type="button"
              className={view === "split" ? "active" : ""}
              onClick={() => setView("split")}
              aria-label="Show map and donation list"
              title="Map and list"
            >
              <List size={17} />
            </button>

            <button
              type="button"
              className={view === "map" ? "active" : ""}
              onClick={() => setView("map")}
              aria-label="Show map only"
              title="Map only"
            >
              <MapIcon size={17} />
            </button>
          </div>
        </section>

        <section
          className={`map-workspace ${
            view === "map" ? "map-only-view" : ""
          }`}
        >
          <div className="map-visual-panel">
            <MapContainer
              center={[10.8505, 76.2711]}
              zoom={8}
              scrollWheelZoom={true}
              className="sharecycle-leaflet-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
<FocusMapOnDonation donation={activeDonation} />
              {filteredDonations.map((donation) => (
                <CircleMarker
                  key={donation.id}
                  center={[
                    donation.latitude,
                    donation.longitude,
                  ]}
                  radius={
                    selectedDonation === donation.id ? 11 : 8
                  }
                  pathOptions={{
                    color: "#ffffff",
                    weight: 3,
                    fillColor: donation.color,
                    fillOpacity: 1,
                  }}
                  eventHandlers={{
                    click: () =>
                      setSelectedDonation(donation.id),
                  }}
                >
                  <Tooltip>{donation.title}</Tooltip>

                  <Popup>
                    <div className="map-popup">
                      <strong>{donation.title}</strong>
                      <span>{donation.category}</span>
                      <p>{donation.quantity} available</p>
                      <p>{donation.location}</p>
                      <Link to={`/donation/${donation.id}`}>
                        View donation
                      </Link>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              {activeDonation && (
                <RecenterMap donation={activeDonation} />
              )}
            </MapContainer>

            <div className="map-legend">
              <span>
                <i className="legend-dot food-dot" />
                Food
              </span>
              <span>
                <i className="legend-dot clothing-dot" />
                Clothing
              </span>
              <span>
                <i className="legend-dot essentials-dot" />
                Essentials
              </span>
            </div>
          </div>

          {view === "split" && (
            <aside className="map-donation-list">
              <div className="map-list-header">
                <h3>Donation locations</h3>
                <span>{filteredDonations.length}</span>
              </div>

              <div className="map-list-scroll">
                {filteredDonations.length > 0 ? (
                  filteredDonations.map((donation) => (
                    <button
                      type="button"
                      key={donation.id}
                      className={`map-donation-item ${
                        activeDonation?.id === donation.id
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedDonation(donation.id)
                      }
                    >
                      <div
                        className={`map-list-icon ${
                          donation.category === "Food"
                            ? "food"
                            : donation.category === "Clothing"
                              ? "clothing"
                              : "essentials"
                        }`}
                      >
                        {getCategoryIcon(donation.category, 20)}
                      </div>

                      <div className="map-list-details">
                        <strong>{donation.title}</strong>

                        <span className="map-list-location">
                          <MapPin size={13} />
                          {donation.location}
                        </span>

                        <span className="map-list-quantity">
                          {donation.quantity} available
                        </span>

                        <span className="map-list-pickup">
                          <Clock size={12} />
                          {donation.pickup}
                        </span>
                      </div>

                      <ArrowRight
                        className="map-list-arrow"
                        size={17}
                      />
                    </button>
                  ))
                ) : (
                  <div className="map-no-results">
                    <Search size={28} />
                    <h3>No donations found</h3>
                    <p>Try another search or category.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setCategory("All");
                      }}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </aside>
          )}
        </section>

        {activeDonation && (
          <section className="map-selected-card">
            <div
              className={`map-selected-icon ${
                activeDonation.category === "Food"
                  ? "food"
                  : activeDonation.category === "Clothing"
                    ? "clothing"
                    : "essentials"
              }`}
            >
              {getCategoryIcon(activeDonation.category, 23)}
            </div>

            <div className="map-selected-details">
              <span className="map-selected-category">
                {activeDonation.category}
              </span>
              <h3>{activeDonation.title}</h3>
              <p>
                <MapPin size={14} />
                {activeDonation.location}
              </p>
              <p>
                <Package size={14} />
                {activeDonation.quantity} available
              </p>
            </div>

            <Link
              to={`/donation/${activeDonation.id}`}
              className="map-view-details-button"
            >
              View details
              <ArrowRight size={16} />
            </Link>
            <a
  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${activeDonation.latitude},${activeDonation.longitude}`
  )}&travelmode=driving`}
  target="_blank"
  rel="noopener noreferrer"
  className="map-view-details-button"
>
  <Navigation size={16} />
  Get Directions
  <ExternalLink size={15} />
</a>
          </section>
        )}

        <div className="map-demo-notice">
          <Navigation size={18} />
          <p>
            Map markers use sample coordinates and donation data.
            Live donor locations, volunteer routes, and location
            permissions will be connected later.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
