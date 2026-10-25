
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock,
  ImagePlus,
  MapPin,
  Package,
  Save,
  Shirt,
  Trash2,
  Utensils,
  X,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./CreateDonation.css";

const initialForm = {
  title: "",
  category: "Food",
  description: "",
  quantity: "",
  unit: "kg",
  location: "",
  pickupDate: "",
  pickupStart: "",
  pickupEnd: "",
  preparationDate: "",
  preparationTime: "",
  expiryDate: "",
  contactName: "",
  contactPhone: "",
};

export default function CreateDonation() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const unitsByCategory = {
    Food: ["kg", "g", "meals", "packets", "boxes"],
    Clothing: ["pieces", "bags", "boxes"],
    Essentials: ["kits", "pieces", "packs", "boxes"],
  };

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "category"
        ? {
            unit:
              value === "Food"
                ? "kg"
                : value === "Clothing"
                  ? "pieces"
                  : "kits",
          }
        : {}),
    }));

    setError("");
    setSuccess(false);
  };

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Image size must be 5 MB or less.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setPhoto(reader.result);
      setPhotoError("");
    };

    reader.onerror = () => {
      setPhotoError("Unable to read this image. Please try again.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const removePhoto = () => {
    setPhoto("");
    setPhotoError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Please enter a donation title.");
      return;
    }

    if (!form.description.trim()) {
      setError("Please describe the items you are donating.");
      return;
    }

    if (!Number.isFinite(Number(form.quantity)) || Number(form.quantity) <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }

    if (!form.location.trim()) {
      setError("Please enter the pickup location.");
      return;
    }

    if (!form.pickupDate || !form.pickupStart || !form.pickupEnd) {
      setError("Please complete the pickup date and time.");
      return;
    }

    if (form.pickupEnd <= form.pickupStart) {
      setError("Pickup end time must be later than start time.");
      return;
    }

    if (
      form.category === "Food" &&
      form.expiryDate &&
      form.expiryDate < form.pickupDate
    ) {
      setError("The expiry date cannot be before the pickup date.");
      return;
    }

    const donation = {
      ...form,
      quantity: Number(form.quantity),
      availableQuantity: Number(form.quantity),
      photo,
      status: "Available",
      createdAt: new Date().toISOString(),
    };

    // Frontend demonstration only; not shared with other users.
    try {
      const existing = JSON.parse(
        localStorage.getItem("sharecycleDemoDonations") || "[]"
      );

      localStorage.setItem(
        "sharecycleDemoDonations",
        JSON.stringify([
          { ...donation, id: Date.now() },
          ...existing,
        ])
      );

      setSuccess(true);
    } catch {
      setError(
        "Unable to save this donation in your browser. Please try again."
      );
    }
  };

  if (success) {
    return (
      <div className="create-donation-page">
        <Navbar />

        <main className="donation-form-main">
          <section className="donation-created-success">
            <div className="donation-success-icon">
              <CheckCircle2 size={44} />
            </div>

            <h1>Donation saved!</h1>

            <p>
              Your donation has been saved in this browser for
              frontend testing. It has not been published to other
              users yet.
            </p>

            <div className="donation-success-summary">
              <strong>{form.title}</strong>
              <span>
                {form.quantity} {form.unit} · {form.category}
              </span>
              <span>
                <MapPin size={15} />
                {form.location}
              </span>
            </div>

            <div className="donation-success-actions">
              <button
                type="button"
                onClick={() => {
                  setForm(initialForm);
                  setPhoto("");
                  setSuccess(false);
                  setError("");
                }}
                className="donation-secondary-button"
              >
                Create another donation
              </button>

              <button
                type="button"
                onClick={() => navigate("/donor-dashboard")}
                className="donation-primary-button"
              >
                Go to dashboard
              </button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="create-donation-page">
      <Navbar />

      <main className="donation-form-main">
        <Link to="/donor-dashboard" className="create-donation-back">
          <ArrowLeft size={18} />
          Back to dashboard
        </Link>

        <section className="create-donation-heading">
          <span>SHARE WHAT YOU CAN</span>
          <h1>Create a donation</h1>
          <p>
            List surplus resources so volunteers can collect and
            distribute them to people who need them.
          </p>
        </section>

        <form className="create-donation-form" onSubmit={handleSubmit}>
          <section className="donation-form-section">
            <div className="donation-form-section-heading">
              <div className="donation-form-section-icon">
                <Package size={21} />
              </div>

              <div>
                <h2>Donation information</h2>
                <p>Tell volunteers what you want to share.</p>
              </div>
            </div>

            <div className="donation-form-grid">
              <div className="donation-field full-width">
                <label htmlFor="donation-title">
                  Donation title <span>*</span>
                </label>

                <input
                  id="donation-title"
                  name="title"
                  value={form.title}
                  onChange={updateField}
                  placeholder="e.g. Fresh vegetables"
                  maxLength={100}
                  required
                />
              </div>

              <div className="donation-field">
                <label htmlFor="donation-category">
                  Category <span>*</span>
                </label>

                <select
                  id="donation-category"
                  name="category"
                  value={form.category}
                  onChange={updateField}
                  required
                >
                  <option value="Food">Food</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Essentials">Essentials</option>
                </select>
              </div>

              <div className="donation-field">
                <label htmlFor="donation-quantity">
                  Quantity <span>*</span>
                </label>

                <div className="donation-quantity-field">
                  <input
                    id="donation-quantity"
                    name="quantity"
                    type="number"
                    min="0.01"
                    step="any"
                    value={form.quantity}
                    onChange={updateField}
                    placeholder="Enter quantity"
                    required
                  />

                  <select
                    name="unit"
                    aria-label="Quantity unit"
                    value={form.unit}
                    onChange={updateField}
                  >
                    {unitsByCategory[form.category].map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="donation-field full-width">
                <label htmlFor="donation-description">
                  Description <span>*</span>
                </label>

                <textarea
                  id="donation-description"
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  placeholder="Describe the quantity, condition, packaging, or other important details..."
                  rows={4}
                  maxLength={1000}
                  required
                />

                <small>{form.description.length}/1000 characters</small>
              </div>
            </div>
          </section>

          <section className="donation-form-section">
            <div className="donation-form-section-heading">
              <div className="donation-form-section-icon">
                <Camera size={21} />
              </div>

              <div>
                <h2>Donation photo</h2>
                <p>Help volunteers identify the items.</p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              hidden
            />

            {photo ? (
              <div className="donation-photo-preview">
                <img src={photo} alt="Donation preview" />

                <button
                  type="button"
                  onClick={removePhoto}
                  aria-label="Remove photo"
                >
                  <Trash2 size={17} />
                  Remove photo
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="donation-photo-upload"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus size={32} />
                <strong>Upload a photo</strong>
                <span>JPG, PNG or another image format · Max 5 MB</span>
                <span className="donation-upload-button">
                  Choose image
                </span>
              </button>
            )}

            {photoError && (
              <p className="donation-form-error" role="alert">
                {photoError}
              </p>
            )}
          </section>

          <section className="donation-form-section">
            <div className="donation-form-section-heading">
              <div className="donation-form-section-icon">
                <MapPin size={21} />
              </div>

              <div>
                <h2>Pickup details</h2>
                <p>Choose where and when volunteers can collect it.</p>
              </div>
            </div>

            <div className="donation-form-grid">
              <div className="donation-field full-width">
                <label htmlFor="donation-location">
                  Pickup location <span>*</span>
                </label>

                <input
                  id="donation-location"
                  name="location"
                  value={form.location}
                  onChange={updateField}
                  placeholder="Enter address, area, or landmark"
                  maxLength={250}
                  required
                />
              </div>

              <div className="donation-field">
                <label htmlFor="donation-pickup-date">
                  Pickup date <span>*</span>
                </label>

                <input
                  id="donation-pickup-date"
                  type="date"
                  name="pickupDate"
                  min={new Date().toLocaleDateString("en-CA")}
                  value={form.pickupDate}
                  onChange={updateField}
                  required
                />
              </div>

              <div className="donation-field">
                <label htmlFor="donation-pickup-start">
                  Pickup starts <span>*</span>
                </label>

                <input
                  id="donation-pickup-start"
                  type="time"
                  name="pickupStart"
                  value={form.pickupStart}
                  onChange={updateField}
                  required
                />
              </div>

              <div className="donation-field">
                <label htmlFor="donation-pickup-end">
                  Pickup ends <span>*</span>
                </label>

                <input
                  id="donation-pickup-end"
                  type="time"
                  name="pickupEnd"
                  value={form.pickupEnd}
                  onChange={updateField}
                  required
                />
              </div>
            </div>
          </section>

          {form.category === "Food" && (
            <section className="donation-form-section food-form-section">
              <div className="donation-form-section-heading">
                <div className="donation-form-section-icon">
                  <Utensils size={21} />
                </div>

                <div>
                  <h2>Food safety information</h2>
                  <p>
                    Provide accurate dates so volunteers can collect
                    and distribute food promptly.
                  </p>
                </div>
              </div>

              <div className="donation-form-grid">
                <div className="donation-field">
                  <label htmlFor="donation-preparation-date">
                    Preparation / collection date
                  </label>

                  <input
                    id="donation-preparation-date"
                    type="date"
                    name="preparationDate"
                    value={form.preparationDate}
                    onChange={updateField}
                    max={new Date().toLocaleDateString("en-CA")}
                  />
                </div>

                <div className="donation-field">
                  <label htmlFor="donation-preparation-time">
                    Preparation time (if applicable)
                  </label>

                  <input
                    id="donation-preparation-time"
                    type="time"
                    name="preparationTime"
                    value={form.preparationTime}
                    onChange={updateField}
                  />
                </div>

                <div className="donation-field">
                  <label htmlFor="donation-expiry-date">
                    Expiry / best-before date
                  </label>

                  <input
                    id="donation-expiry-date"
                    type="date"
                    name="expiryDate"
                    value={form.expiryDate}
                    min={form.pickupDate || new Date().toLocaleDateString("en-CA")}
                    onChange={updateField}
                  />
                </div>
              </div>

              <div className="donation-food-warning">
                <Clock size={18} />
                <p>
                  Share accurate preparation and expiry details. Do not
                  donate food that is unsafe or past its safe consumption
                  period.
                </p>
              </div>
            </section>
          )}

          <section className="donation-form-section">
            <div className="donation-form-section-heading">
              <div className="donation-form-section-icon">
                <Shirt size={21} />
              </div>

              <div>
                <h2>Donor contact details</h2>
                <p>Provide contact information for pickup coordination.</p>
              </div>
            </div>

            <div className="donation-form-grid">
              <div className="donation-field">
                <label htmlFor="donation-contact-name">
                  Contact name
                </label>

                <input
                  id="donation-contact-name"
                  name="contactName"
                  value={form.contactName}
                  onChange={updateField}
                  placeholder="Your name or organization"
                  maxLength={100}
                />
              </div>

              <div className="donation-field">
                <label htmlFor="donation-contact-phone">
                  Contact phone
                </label>

                <input
                  id="donation-contact-phone"
                  type="tel"
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={updateField}
                  placeholder="Your contact number"
                  maxLength={20}
                />
              </div>
            </div>
          </section>

          {error && (
            <div className="donation-form-error donation-form-error-box" role="alert">
              <X size={18} />
              {error}
            </div>
          )}

          <div className="donation-form-bottom">
            <p>
              <span>*</span> Required fields
            </p>

            <div>
              <Link
                to="/donor-dashboard"
                className="donation-secondary-button"
              >
                Cancel
              </Link>

              <button type="submit" className="donation-primary-button">
                <Save size={17} />
                Save donation
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
