
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock3,
  Heart,
  ImagePlus,
  Leaf,
  MapPin,
  Package,
  Pencil,
  Plus,
  Save,
  Search,
  Shirt,
  Trash2,
  Utensils,
  X,
  Eye,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./DonorDashboard.css";
import "./CreateDonation.css";

const STORAGE_KEY = "sharecycleDemoDonations";
const SAMPLE_EDITS_KEY = "sharecycleDemoDonationEdits";
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

const initialDonations = [
  {
    id: "sample-1",
    title: "Fresh Vegetables",
    category: "Food",
    quantity: "5 kg",
    unit: "kg",
    location: "Palakkad",
    date: "",
    pickupDate: "",
    pickupStart: "",
    pickupEnd: "",
    preparationDate: "",
    preparationTime: "",
    expiryDate: "",
    contactName: "",
    contactPhone: "",
    photo: "",
    status: "Available",
    description: "Fresh vegetables available for donation.",
  },
  {
    id: "sample-2",
    title: "Clean Clothes",
    category: "Clothing",
    quantity: "8 pieces",
    unit: "pieces",
    location: "Palakkad",
    date: "",
    pickupDate: "",
    pickupStart: "",
    pickupEnd: "",
    preparationDate: "",
    preparationTime: "",
    expiryDate: "",
    contactName: "",
    contactPhone: "",
    photo: "",
    status: "Pending",
    description: "Clean clothes in good condition.",
  },
];

const unitsByCategory = {
  Food: ["kg", "g", "meals", "packets", "boxes"],
  Clothing: ["pieces", "bags", "boxes"],
  Essentials: ["kits", "pieces", "packs", "boxes"],
};

const emptyEditForm = {
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
  status: "Available",
};

function readLocalStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.error(`Could not read ${key}:`, error);
    return fallback;
  }
}

function getSavedDonations() {
  const saved = readLocalStorage(STORAGE_KEY, []);

  if (!Array.isArray(saved)) return [];

  return saved.map((item) => ({
    ...item,
    quantity: `${item.quantity ?? ""} ${item.unit || ""}`.trim(),
    location: item.location || "Location not specified",
    date: item.expiryDate || item.pickupDate || "",
    status: item.status || "Available",
    description: item.description || "",
  }));
}

function getAllDonations() {
  const sampleEdits = readLocalStorage(SAMPLE_EDITS_KEY, {});

  const updatedSamples = initialDonations
    .filter((item) => !sampleEdits[item.id]?.deleted)
    .map((item) => ({
      ...item,
      ...(sampleEdits[item.id] || {}),
    }));

  return [...getSavedDonations(), ...updatedSamples];
}

function getCategoryIcon(category) {
  if (category === "Food") return <Utensils size={22} />;
  if (category === "Clothing") return <Shirt size={22} />;
  return <Package size={22} />;
}

function parseQuantityAndUnit(quantity, category, storedUnit = "") {
  const match = String(quantity ?? "")
    .trim()
    .match(/^([\d.]+)\s*(.*)$/);

  if (match) {
    return {
      quantity: match[1],
      unit:
        storedUnit ||
        match[2] ||
        unitsByCategory[category]?.[0] ||
        "pieces",
    };
  }

  return {
    quantity: String(quantity ?? "").trim(),
    unit: storedUnit || unitsByCategory[category]?.[0] || "pieces",
  };
}

export default function DonorDashboard() {
  const [donations, setDonations] = useState(() => getAllDonations());
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [editingDonation, setEditingDonation] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [editPhoto, setEditPhoto] = useState("");
  const [editPhotoError, setEditPhotoError] = useState("");
  const [editError, setEditError] = useState("");
  const [viewingDonation, setViewingDonation] = useState(null);

  const editFileInputRef = useRef(null);

  useEffect(() => {
    const refreshDonations = () => {
      setDonations(getAllDonations());
    };

    refreshDonations();

    window.addEventListener("focus", refreshDonations);
    window.addEventListener("pageshow", refreshDonations);

    return () => {
      window.removeEventListener("focus", refreshDonations);
      window.removeEventListener("pageshow", refreshDonations);
    };
  }, []);

  const filteredDonations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return donations.filter((donation) => {
      const matchesSearch = [
        donation.title,
        donation.category,
        donation.location,
        donation.description,
        donation.quantity,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);

      const matchesFilter =
        activeFilter === "All" || donation.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [donations, searchTerm, activeFilter]);

  const availableCount = donations.filter(
    (item) => item.status === "Available"
  ).length;

  const pendingCount = donations.filter(
    (item) => item.status === "Pending"
  ).length;

  const completedCount = donations.filter(
    (item) => item.status === "Completed"
  ).length;

  function handleEditClick(donation) {
    const parsed = parseQuantityAndUnit(
      donation.quantity,
      donation.category,
      donation.unit
    );

    setEditingDonation(donation.id);
    setEditError("");
    setEditPhotoError("");
    setEditPhoto(donation.photo || "");

    setEditForm({
      ...emptyEditForm,
      ...donation,
      title: donation.title || "",
      category: donation.category || "Food",
      description: donation.description || "",
      quantity: parsed.quantity,
      unit: parsed.unit,
      location:
        donation.location === "Location not specified"
          ? ""
          : donation.location || "",
      pickupDate: donation.pickupDate || "",
      pickupStart: donation.pickupStart || "",
      pickupEnd: donation.pickupEnd || "",
      preparationDate: donation.preparationDate || "",
      preparationTime: donation.preparationTime || "",
      expiryDate: donation.expiryDate || "",
      contactName: donation.contactName || "",
      contactPhone: donation.contactPhone || "",
      status: donation.status || "Available",
    });
  }

  function updateEditField(event) {
    const { name, value } = event.target;

    setEditForm((current) => {
      if (name === "category") {
        return {
          ...current,
          category: value,
          unit: unitsByCategory[value][0],
        };
      }

      return {
        ...current,
        [name]: value,
      };
    });

    setEditError("");
  }

  function handleEditPhoto(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setEditPhotoError("Please choose an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_PHOTO_SIZE) {
      setEditPhotoError("Image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setEditPhoto(String(reader.result || ""));
      setEditPhotoError("");
    };

    reader.onerror = () => {
      setEditPhotoError(
        "Could not read this image. Please try another one."
      );
    };

    reader.readAsDataURL(file);
  }

  function closeEditForm() {
    setEditingDonation(null);
    setEditForm(emptyEditForm);
    setEditPhoto("");
    setEditPhotoError("");
    setEditError("");

    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  }

  function handleEditSave(event) {
    event.preventDefault();
    setEditError("");

    const quantityNumber = Number(editForm.quantity);

    if (
      !editForm.title.trim() ||
      !editForm.description.trim() ||
      !editForm.location.trim()
    ) {
      setEditError(
        "Please complete the title, description, and pickup location."
      );
      return;
    }

    if (!Number.isFinite(quantityNumber) || quantityNumber <= 0) {
      setEditError("Quantity must be a number greater than zero.");
      return;
    }

    if (
      !editForm.pickupDate ||
      !editForm.pickupStart ||
      !editForm.pickupEnd
    ) {
      setEditError(
        "Please select the pickup date, start time, and end time."
      );
      return;
    }

    if (editForm.pickupEnd <= editForm.pickupStart) {
      setEditError(
        "Pickup end time must be later than the start time."
      );
      return;
    }

    if (
      editForm.category === "Food" &&
      editForm.expiryDate &&
      editForm.expiryDate < editForm.pickupDate
    ) {
      setEditError(
        "Food expiry date cannot be earlier than the pickup date."
      );
      return;
    }

    const original = donations.find(
      (item) => String(item.id) === String(editingDonation)
    );

    if (!original) {
      setEditError(
        "This donation could not be found. Close the form and try again."
      );
      return;
    }

    const updatedDonation = {
      ...original,
      ...editForm,
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      location: editForm.location.trim(),
      quantity: `${quantityNumber} ${editForm.unit}`.trim(),
      availableQuantity: quantityNumber,
      unit: editForm.unit,
      photo: editPhoto,
      date: editForm.expiryDate || editForm.pickupDate,
    };

    try {
      const saved = readLocalStorage(STORAGE_KEY, []);

      const savedIndex = saved.findIndex(
        (item) => String(item.id) === String(editingDonation)
      );

      if (savedIndex !== -1) {
        const updatedSaved = saved.map((item) => {
          if (String(item.id) !== String(editingDonation)) {
            return item;
          }

          return {
            ...item,
            ...editForm,
            title: editForm.title.trim(),
            description: editForm.description.trim(),
            location: editForm.location.trim(),
            quantity: quantityNumber,
            availableQuantity: quantityNumber,
            unit: editForm.unit,
            photo: editPhoto,
            date: editForm.expiryDate || editForm.pickupDate,
          };
        });

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedSaved)
        );
      } else {
        const sampleEdits = readLocalStorage(SAMPLE_EDITS_KEY, {});

        sampleEdits[editingDonation] = {
          ...updatedDonation,
          deleted: false,
        };

        localStorage.setItem(
          SAMPLE_EDITS_KEY,
          JSON.stringify(sampleEdits)
        );
      }

      setDonations((current) =>
        current.map((item) =>
          String(item.id) === String(editingDonation)
            ? updatedDonation
            : item
        )
      );

      closeEditForm();
      window.alert("Donation updated successfully!");
    } catch (error) {
      console.error("Could not save donation changes:", error);

      setEditError(
        "Unable to save changes. Your browser storage may be full. Try a smaller image."
      );
    }
  }

  function handleDelete(id) {
    const donation = donations.find(
      (item) => String(item.id) === String(id)
    );

    if (!donation) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${donation.title}"?`
    );

    if (!confirmed) return;

    try {
      const saved = readLocalStorage(STORAGE_KEY, []);

      const remainingSaved = saved.filter(
        (item) => String(item.id) !== String(id)
      );

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(remainingSaved)
      );

      if (String(id).startsWith("sample-")) {
        const sampleEdits = readLocalStorage(SAMPLE_EDITS_KEY, {});

        sampleEdits[id] = {
          ...(sampleEdits[id] || {}),
          deleted: true,
        };

        localStorage.setItem(
          SAMPLE_EDITS_KEY,
          JSON.stringify(sampleEdits)
        );
      }

      setDonations((current) =>
        current.filter((item) => String(item.id) !== String(id))
      );

      if (String(editingDonation) === String(id)) {
        closeEditForm();
      }
    } catch (error) {
      console.error("Could not delete the donation:", error);
      window.alert("Unable to delete this donation. Please try again.");
    }
  }

  function exportDonations() {
    const headers = [
      "Title",
      "Category",
      "Quantity",
      "Location",
      "Status",
      "Pickup date",
      "Expiry date",
      "Description",
    ];

    const rows = donations.map((item) => [
      item.title,
      item.category,
      item.quantity,
      item.location,
      item.status,
      item.pickupDate || "",
      item.expiryDate || "",
      item.description,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "sharecycle-donations.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <>
      <Navbar />

      <main className="donor-dashboard-page">
        <div className="donor-dashboard">
          <section className="donor-welcome">
            <div>
              <p className="donor-eyebrow">DONOR DASHBOARD</p>
              <h1>Welcome back, Donor!</h1>
              <p>
                Every donation makes a difference. Manage your donations
                and help essential items reach people who need them.
              </p>
            </div>

            <Link
              to="/create-donation"
              className="donor-primary-btn donor-create-link"
            >
              <Plus size={19} />
              Create Donation
            </Link>
          </section>

          <section className="donor-stats-grid">
            <div className="donor-stat-card">
              <div>
                <p>Total Donations</p>
                <h2>{donations.length}</h2>
              </div>
              <span><Package size={24} /></span>
            </div>

            <div className="donor-stat-card">
              <div>
                <p>Available</p>
                <h2>{availableCount}</h2>
              </div>
              <span><CheckCircle2 size={24} /></span>
            </div>

            <div className="donor-stat-card">
              <div>
                <p>Pending</p>
                <h2>{pendingCount}</h2>
              </div>
              <span><Clock3 size={24} /></span>
            </div>

            <div className="donor-stat-card">
              <div>
                <p>Completed</p>
                <h2>{completedCount}</h2>
              </div>
              <span><Heart size={24} /></span>
            </div>
          </section>

          <section className="donor-list-section">
            <div className="donor-list-heading">
              <div>
                <h2>My Donations</h2>
                <p>View and manage the items you have listed.</p>
              </div>

              <button
                type="button"
                className="donor-secondary-btn"
                onClick={exportDonations}
              >
                <Package size={17} />
                Export CSV
              </button>
            </div>

            <div className="donor-list-controls">
              <label className="donor-search">
                <Search size={18} />
                <input
                  type="search"
                  placeholder="Search donations..."
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                />

                {searchTerm && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearchTerm("")}
                  >
                    <X size={16} />
                  </button>
                )}
              </label>

              <div className="donor-filter-tabs">
                {["All", "Available", "Pending", "Completed"].map(
                  (filter) => (
                    <button
                      type="button"
                      key={filter}
                      className={
                        activeFilter === filter ? "active" : ""
                      }
                      onClick={() => setActiveFilter(filter)}
                    >
                      {filter}
                    </button>
                  )
                )}
              </div>
            </div>

            {filteredDonations.length > 0 ? (
              <div className="donor-donation-list">
                {filteredDonations.map((donation) => (
                  <article
                    className="donor-donation-card"
                    key={donation.id}
                  >
                    <div className="donor-item-icon">
                      {getCategoryIcon(donation.category)}
                    </div>

                    <div className="donor-item-main">
                      <div className="donor-item-title-row">
                        <h3>{donation.title}</h3>

                        <span
                          className={`donor-status ${(
                            donation.status || "Available"
                          )
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {donation.status || "Available"}
                        </span>
                      </div>

                      {donation.photo && (
                        <img
                          className="donor-card-photo"
                          src={donation.photo}
                          alt={donation.title}
                        />
                      )}

                      <p>{donation.description}</p>

                      <div className="donor-item-meta">
                        <span>
                          <Package size={15} />
                          {donation.quantity}
                        </span>

                        <span>
                          <MapPin size={15} />
                          {donation.location}
                        </span>

                        {(donation.pickupDate || donation.date) && (
                          <span>
                            <CalendarDays size={15} />
                            {donation.pickupDate || donation.date}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="donor-card-actions">
                      <button
  type="button"
  className="donor-icon-btn donor-view-btn"
  title="View donation"
  aria-label={`View ${donation.title}`}
  onClick={() => setViewingDonation(donation)}
>
  <Eye size={18} />
</button>
                      <button
                        type="button"
                        className="donor-icon-btn donor-edit-btn"
                        title="Edit donation"
                        aria-label={`Edit ${donation.title}`}
                        onClick={() => handleEditClick(donation)}
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        type="button"
                        className="donor-icon-btn"
                        title="Delete donation"
                        aria-label={`Delete ${donation.title}`}
                        onClick={() => handleDelete(donation.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="donor-empty-state">
                <Package size={38} />
                <h3>No donations found</h3>

                <p>
                  {searchTerm || activeFilter !== "All"
                    ? "Try changing your search or filter."
                    : "Create your first donation to start helping others."}
                </p>

                {!searchTerm && activeFilter === "All" && (
                  <Link
                    to="/create-donation"
                    className="donor-primary-btn"
                  >
                    <Plus size={18} />
                    Create Donation
                  </Link>
                )}
              </div>
            )}
          </section>

          <section className="donor-kindness-banner">
            <div><Leaf size={28} /></div>
            <div>
              <h3>Small acts, big impact</h3>
              <p>
                Your generosity helps reduce waste and supports people
                in your community.
              </p>
            </div>
          </section>
          
{viewingDonation && (
  <div
    className="donor-edit-backdrop"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) {
        setViewingDonation(null);
      }
    }}
  >
    <section
      className="donor-view-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="donor-view-title"
    >
      <div className="donor-edit-heading">
        <div>
          <p className="donor-eyebrow">DONATION DETAILS</p>
          <h2 id="donor-view-title">{viewingDonation.title}</h2>
        </div>

        <button
          type="button"
          className="donor-icon-btn"
          aria-label="Close donation details"
          onClick={() => setViewingDonation(null)}
        >
          <X size={19} />
        </button>
      </div>

      {(viewingDonation.photo || viewingDonation.image) ? (
  <img
    className="donor-view-photo"
    src={viewingDonation.photo || viewingDonation.image}
    alt={viewingDonation.title}
    onError={(e) => {
      e.currentTarget.style.display = "none";
    }}
  />
) : (
  <div className="donor-view-photo-placeholder">
    <ImagePlus size={40} />
    <p>No picture uploaded</p>
  </div>
)}

      <p>
        <strong>Category:</strong> {viewingDonation.category}
      </p>
      <p>
        <strong>Quantity:</strong> {viewingDonation.quantity}
      </p>
      <p>
        <strong>Status:</strong> {viewingDonation.status}
      </p>
      <p>
        <strong>Description:</strong>{" "}
        {viewingDonation.description || "Not provided"}
      </p>
      <p>
        <strong>Pickup location:</strong> {viewingDonation.location}
      </p>
      <p>
        <strong>Pickup date:</strong>{" "}
        {viewingDonation.pickupDate || "Not provided"}
      </p>
      <p>
        <strong>Pickup time:</strong>{" "}
        {viewingDonation.pickupStart || "Not provided"}
        {" – "}
        {viewingDonation.pickupEnd || "Not provided"}
      </p>

      {viewingDonation.category === "Food" && (
        <>
          <p>
            <strong>Preparation date:</strong>{" "}
            {viewingDonation.preparationDate || "Not provided"}
          </p>
          <p>
            <strong>Preparation time:</strong>{" "}
            {viewingDonation.preparationTime || "Not provided"}
          </p>
          <p>
            <strong>Expiry date:</strong>{" "}
            {viewingDonation.expiryDate || "Not provided"}
          </p>
        </>
      )}

      <p>
        <strong>Contact name:</strong>{" "}
        {viewingDonation.contactName || "Not provided"}
      </p>
      <p>
        <strong>Contact phone:</strong>{" "}
        {viewingDonation.contactPhone || "Not provided"}
      </p>

      <div className="donor-edit-actions">
        <button
          type="button"
          className="donor-secondary-btn"
          onClick={() => setViewingDonation(null)}
        >
          Close
        </button>

        <button
          type="button"
          className="donor-primary-btn"
          onClick={() => {
            const donation = viewingDonation;
            setViewingDonation(null);
            handleEditClick(donation);
          }}
        >
          <Pencil size={16} />
          Edit Donation
        </button>
      </div>
    </section>
  </div>
)}


          {editingDonation !== null && (
            <div
              className="donor-edit-backdrop"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  closeEditForm();
                }
              }}
            >
              <form
                className="donor-edit-modal create-donation-form"
                onSubmit={handleEditSave}
              >
                <div className="donor-edit-heading">
                  <div>
                    <p className="donor-eyebrow">MANAGE DONATION</p>
                    <h2>Edit Donation</h2>
                    <p>Update the donation information below.</p>
                  </div>

                  <button
                    type="button"
                    className="donor-icon-btn"
                    aria-label="Close edit form"
                    onClick={closeEditForm}
                  >
                    <X size={19} />
                  </button>
                </div>

                {editError && (
                  <p className="donor-edit-error" role="alert">
                    {editError}
                  </p>
                )}

                <section className="donation-form-section">
                  <h3><Package size={19} /> Donation information</h3>

                  <div className="donation-form-grid">
                    <label className="donation-field">
                      <span>Donation title *</span>
                      <input
                        name="title"
                        type="text"
                        value={editForm.title}
                        onChange={updateEditField}
                        placeholder="e.g. Fresh vegetables"
                        required
                        maxLength={100}
                      />
                    </label>

                    <label className="donation-field">
                      <span>Category *</span>
                      <select
                        name="category"
                        value={editForm.category}
                        onChange={updateEditField}
                        required
                      >
                        <option value="Food">Food</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Essentials">Essentials</option>
                      </select>
                    </label>

                    <div className="donation-field">
                      <span>Quantity *</span>
                      <div className="donor-edit-quantity-row">
                        <input
                          name="quantity"
                          type="number"
                          min="0.01"
                          step="any"
                          value={editForm.quantity}
                          onChange={updateEditField}
                          placeholder="Enter quantity"
                          required
                        />

                        <select
                          name="unit"
                          value={editForm.unit}
                          onChange={updateEditField}
                          aria-label="Quantity unit"
                        >
                          {(
                            unitsByCategory[editForm.category] ||
                            unitsByCategory.Food
                          ).map((unit) => (
                            <option key={unit} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <label className="donation-field donation-field-full">
                      <span>Description *</span>
                      <textarea
                        name="description"
                        rows="4"
                        value={editForm.description}
                        onChange={updateEditField}
                        placeholder="Describe the items, condition, or important details"
                        required
                        maxLength={1000}
                      />
                    </label>
                  </div>
                </section>

                <section className="donation-form-section">
                  <h3><Camera size={19} /> Donation photo</h3>

                  {editPhoto ? (
                    <div className="donation-photo-preview">
                      <img src={editPhoto} alt="Donation preview" />

                      <button
                        type="button"
                        className="donation-secondary-button"
                        onClick={() => {
                          setEditPhoto("");
                          setEditPhotoError("");

                          if (editFileInputRef.current) {
                            editFileInputRef.current.value = "";
                          }
                        }}
                      >
                        <Trash2 size={16} />
                        Remove photo
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="donation-photo-upload"
                      onClick={() => editFileInputRef.current?.click()}
                    >
                      <ImagePlus size={25} />
                      <strong>Add a photo</strong>
                      <span>Choose an image up to 5 MB</span>
                    </button>
                  )}

                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleEditPhoto}
                  />

                  {editPhoto && (
                    <button
                      type="button"
                      className="donation-secondary-button"
                      onClick={() => editFileInputRef.current?.click()}
                    >
                      <Camera size={16} />
                      Change photo
                    </button>
                  )}

                  {editPhotoError && (
                    <p className="donor-edit-error" role="alert">
                      {editPhotoError}
                    </p>
                  )}
                </section>

                <section className="donation-form-section">
                  <h3><MapPin size={19} /> Pickup details</h3>

                  <div className="donation-form-grid">
                    <label className="donation-field donation-field-full">
                      <span>Pickup location *</span>
                      <input
                        name="location"
                        type="text"
                        value={editForm.location}
                        onChange={updateEditField}
                        placeholder="Enter area, town, or address"
                        required
                        maxLength={200}
                      />
                    </label>

                    <label className="donation-field">
                      <span>Pickup date *</span>
                      <input
                        name="pickupDate"
                        type="date"
                        value={editForm.pickupDate}
                        onChange={updateEditField}
                        required
                      />
                    </label>

                    <label className="donation-field">
                      <span>Pickup starts at *</span>
                      <input
                        name="pickupStart"
                        type="time"
                        value={editForm.pickupStart}
                        onChange={updateEditField}
                        required
                      />
                    </label>

                    <label className="donation-field">
                      <span>Pickup ends at *</span>
                      <input
                        name="pickupEnd"
                        type="time"
                        value={editForm.pickupEnd}
                        onChange={updateEditField}
                        required
                      />
                    </label>
                  </div>
                </section>

                {editForm.category === "Food" && (
                  <section className="donation-form-section">
                    <h3><Clock3 size={19} /> Food safety details</h3>

                    <div className="donation-form-grid">
                      <label className="donation-field">
                        <span>Preparation date</span>
                        <input
                          name="preparationDate"
                          type="date"
                          value={editForm.preparationDate}
                          onChange={updateEditField}
                        />
                      </label>

                      <label className="donation-field">
                        <span>Preparation time</span>
                        <input
                          name="preparationTime"
                          type="time"
                          value={editForm.preparationTime}
                          onChange={updateEditField}
                        />
                      </label>

                      <label className="donation-field">
                        <span>Expiry date</span>
                        <input
                          name="expiryDate"
                          type="date"
                          value={editForm.expiryDate}
                          onChange={updateEditField}
                          min={editForm.pickupDate || undefined}
                        />
                      </label>
                    </div>
                  </section>
                )}

                <section className="donation-form-section">
                  <h3><Heart size={19} /> Donor contact</h3>

                  <div className="donation-form-grid">
                    <label className="donation-field">
                      <span>Contact name</span>
                      <input
                        name="contactName"
                        type="text"
                        value={editForm.contactName}
                        onChange={updateEditField}
                        placeholder="Your name"
                        maxLength={100}
                      />
                    </label>

                    <label className="donation-field">
                      <span>Contact phone</span>
                      <input
                        name="contactPhone"
                        type="tel"
                        value={editForm.contactPhone}
                        onChange={updateEditField}
                        placeholder="Phone number"
                        maxLength={20}
                      />
                    </label>

                    <label className="donation-field">
                      <span>Donation status</span>
                      <select
                        name="status"
                        value={editForm.status}
                        onChange={updateEditField}
                      >
                        <option value="Available">Available</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </label>
                  </div>
                </section>

                <div className="donor-edit-actions">
                  <button
                    type="button"
                    className="donation-secondary-button"
                    onClick={closeEditForm}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="donation-primary-button"
                  >
                    <Save size={17} />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
