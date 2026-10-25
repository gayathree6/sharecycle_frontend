import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Heart,
  LayoutDashboard,
  MapPin,
  Menu,
  Package,
  Search,
  ShieldCheck,
  Shirt,
  Trash2,
  Utensils,
  Users,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./AdminDashboard.css";

const initialDonations = [
  {
    id: 1,
    item: "Fresh vegetables",
    category: "Food",
    donor: "Ananya Menon",
    quantity: "5 kg",
    location: "Palakkad Town",
    status: "Available",
    expiry: "2026-10-21",
  },
  {
    id: 2,
    item: "Packed meals",
    category: "Food",
    donor: "Rahul Nair",
    quantity: "20 meals",
    location: "Olavakkode",
    status: "Pending",
    expiry: "2026-10-20",
  },
  {
    id: 3,
    item: "Clean clothes",
    category: "Clothing",
    donor: "Meera Krishnan",
    quantity: "12 pieces",
    location: "Pallipuram",
    status: "Available",
    expiry: "",
  },
  {
    id: 4,
    item: "Essential care kits",
    category: "Essentials",
    donor: "Arjun Das",
    quantity: "8 kits",
    location: "Palakkad Stadium",
    status: "Completed",
    expiry: "",
  },
  {
    id: 5,
    item: "Fresh fruits",
    category: "Food",
    donor: "Priya S",
    quantity: "4 kg",
    location: "Kallekkad",
    status: "Unallocated",
    expiry: "2026-10-20",
  },
];

const initialVolunteers = [
  {
    id: 1,
    name: "Nikhil Kumar",
    organization: "Helping Hands",
    area: "Palakkad Town",
    activities: 12,
    status: "Active",
  },
  {
    id: 2,
    name: "Sneha Raj",
    organization: "Care Circle",
    area: "Olavakkode",
    activities: 8,
    status: "Active",
  },
  {
    id: 3,
    name: "Akhil Mohan",
    organization: "Hope Foundation",
    area: "Pallipuram",
    activities: 5,
    status: "Inactive",
  },
];

const initialAlerts = [
  {
    id: 1,
    type: "urgent",
    title: "Donation needs a volunteer",
    detail: "Fresh fruits · Kallekkad",
    time: "Requires attention",
  },
  {
    id: 2,
    type: "warning",
    title: "Food approaching its use-by date",
    detail: "Packed meals · Olavakkode",
    time: "Check pickup arrangements",
  },
  {
    id: 3,
    type: "info",
    title: "Pickup confirmation pending",
    detail: "Fresh vegetables · Palakkad Town",
    time: "Awaiting confirmation",
  },
];

function CategoryIcon({ category }) {
  if (category === "Food") return <Utensils size={18} />;
  if (category === "Clothing") return <Shirt size={18} />;
  return <Package size={18} />;
}

export default function AdminDashboard() {
  const [donations, setDonations] = useState(initialDonations);
  const [volunteers, setVolunteers] = useState(initialVolunteers);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [activeSection, setActiveSection] = useState("overview");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [volunteerSearch, setVolunteerSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const totalDonations = donations.length;
  const availableCount = donations.filter(
    (item) => item.status === "Available"
  ).length;
  const pendingCount = donations.filter(
    (item) => item.status === "Pending" || item.status === "Unallocated"
  ).length;
  const completedCount = donations.filter(
    (item) => item.status === "Completed"
  ).length;

  const filteredDonations = useMemo(() => {
    return donations.filter((item) => {
      const matchesSearch = [
        item.item,
        item.donor,
        item.location,
        item.category,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [donations, search, statusFilter, categoryFilter]);

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((volunteer) =>
      [
        volunteer.name,
        volunteer.organization,
        volunteer.area,
      ]
        .join(" ")
        .toLowerCase()
        .includes(volunteerSearch.toLowerCase())
    );
  }, [volunteers, volunteerSearch]);

  function showNotice(message) {
    setNotice(message);
  }

  function changeSection(section) {
    setActiveSection(section);
    setSidebarOpen(false);
    setNotice("");
  }

  function updateDonationStatus(id, status) {
    setDonations((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
    showNotice(`Donation status changed to ${status}.`);
  }

  function deleteDonation(id) {
    const item = donations.find((donation) => donation.id === id);
    if (!item) return;

    if (!window.confirm(`Delete "${item.item}" from this demo?`)) return;

    setDonations((current) =>
      current.filter((donation) => donation.id !== id)
    );
    showNotice("Sample donation removed.");
  }

  function toggleVolunteerStatus(id) {
    setVolunteers((current) =>
      current.map((volunteer) =>
        volunteer.id === id
          ? {
              ...volunteer,
              status:
                volunteer.status === "Active" ? "Inactive" : "Active",
            }
          : volunteer
      )
    );
    showNotice("Volunteer status updated in this demo.");
  }

  function dismissAlert(id) {
    setAlerts((current) => current.filter((alert) => alert.id !== id));
    showNotice("Sample alert dismissed.");
  }

  function getSectionTitle() {
    const titles = {
      overview: "Dashboard overview",
      donations: "Manage donations",
      volunteers: "Manage volunteers",
      alerts: "Alerts and monitoring",
    };
    return titles[activeSection];
  }

  return (
    <div className="admin-page">
      <Navbar />

      <div className="admin-layout">
        {sidebarOpen && (
          <button
            className="admin-sidebar-backdrop"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="admin-sidebar-brand">
            <div className="admin-brand-icon">
              <Heart size={22} />
            </div>
            <div>
              <strong>ShareCycle</strong>
              <span>ADMIN PANEL</span>
            </div>
            <button
              className="admin-mobile-close"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          <div className="admin-sidebar-label">WORKSPACE</div>

          <nav className="admin-nav">
            <button
              className={activeSection === "overview" ? "active" : ""}
              onClick={() => changeSection("overview")}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>

            <button
              className={activeSection === "donations" ? "active" : ""}
              onClick={() => changeSection("donations")}
            >
              <Package size={18} />
              Donations
              <span className="admin-nav-count">{totalDonations}</span>
            </button>

            <button
              className={activeSection === "volunteers" ? "active" : ""}
              onClick={() => changeSection("volunteers")}
            >
              <Users size={18} />
              Volunteers
            </button>

            <button
              className={activeSection === "alerts" ? "active" : ""}
              onClick={() => changeSection("alerts")}
            >
              <Bell size={18} />
              Alerts
              {alerts.length > 0 && (
                <span className="admin-nav-count">{alerts.length}</span>
              )}
            </button>
          </nav>

          <div className="admin-sidebar-bottom">
            <div className="admin-security-icon">
              <ShieldCheck size={19} />
            </div>
            <strong>Community impact</strong>
            <p>Helping useful items reach the people who need them.</p>
            <div className="admin-sidebar-progress">
              <span />
            </div>
            <small>Every contribution matters.</small>
          </div>
        </aside>

        <main className="admin-main">
          <header className="admin-topbar">
            <button
              className="admin-menu-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={21} />
            </button>

            <div className="admin-breadcrumb">
              <span>ShareCycle</span>
              <span className="admin-breadcrumb-separator">/</span>
              <strong>{getSectionTitle()}</strong>
            </div>

            <div className="admin-topbar-right">
              <span className="admin-demo-label">DEMO DATA</span>
              <div className="admin-avatar">A</div>
              <div className="admin-user-info">
                <strong>Administrator</strong>
                <span>Admin workspace</span>
              </div>
            </div>
          </header>

          <div className="admin-content">
            <div className="admin-page-heading">
              <div>
                <span className="admin-eyebrow">
                  <Activity size={15} />
                  SHARECYCLE MANAGEMENT
                </span>
                <h1>{getSectionTitle()}</h1>
                <p>
                  Monitor donations, support volunteers, and keep community
                  activities moving.
                </p>
              </div>

              <div className="admin-date-chip">
                <Clock3 size={16} />
                <span>Activity overview</span>
              </div>
            </div>

            {notice && (
              <div className="admin-notice" role="status">
                <CheckCircle2 size={18} />
                <span>{notice}</span>
                <button
                  onClick={() => setNotice("")}
                  aria-label="Dismiss message"
                >
                  <X size={17} />
                </button>
              </div>
            )}

            {activeSection === "overview" && (
              <>
                <section className="admin-stat-grid">
                  <div className="admin-stat-card">
                    <div className="admin-stat-icon green">
                      <Package size={21} />
                    </div>
                    <div className="admin-stat-top">
                      <span>Total donations</span>
                      <span className="admin-stat-tag">All listings</span>
                    </div>
                    <strong>{totalDonations}</strong>
                    <small>Donations in this demo</small>
                  </div>

                  <div className="admin-stat-card">
                    <div className="admin-stat-icon mint">
                      <Heart size={21} />
                    </div>
                    <div className="admin-stat-top">
                      <span>Available</span>
                      <span className="admin-stat-tag">Open listings</span>
                    </div>
                    <strong>{availableCount}</strong>
                    <small>Waiting for allocation</small>
                  </div>

                  <div className="admin-stat-card">
                    <div className="admin-stat-icon amber">
                      <Clock3 size={21} />
                    </div>
                    <div className="admin-stat-top">
                      <span>Needs attention</span>
                      <span className="admin-stat-tag">Pending</span>
                    </div>
                    <strong>{pendingCount}</strong>
                    <small>Pending or unallocated</small>
                  </div>

                  <div className="admin-stat-card">
                    <div className="admin-stat-icon blue">
                      <CheckCircle2 size={21} />
                    </div>
                    <div className="admin-stat-top">
                      <span>Completed</span>
                      <span className="admin-stat-tag">Finished</span>
                    </div>
                    <strong>{completedCount}</strong>
                    <small>Completed sample listings</small>
                  </div>
                </section>

                <section className="admin-overview-grid">
                  <div className="admin-panel admin-overview-donations">
                    <div className="admin-panel-heading">
                      <div>
                        <h2>Recent donations</h2>
                        <p>Latest sample listings in ShareCycle.</p>
                      </div>
                      <button
                        className="admin-text-btn"
                        onClick={() => changeSection("donations")}
                      >
                        View all <ChevronDown size={15} />
                      </button>
                    </div>

                    <div className="admin-table-wrap">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Donation</th>
                            <th>Quantity</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donations.slice(0, 4).map((item) => (
                            <tr key={item.id}>
                              <td>
                                <div className="admin-table-item">
                                  <div
                                    className={`admin-table-icon ${item.category.toLowerCase()}`}
                                  >
                                    <CategoryIcon category={item.category} />
                                  </div>
                                  <div>
                                    <strong>{item.item}</strong>
                                    <span>{item.location}</span>
                                  </div>
                                </div>
                              </td>
                              <td>{item.quantity}</td>
                              <td>
                                <span
                                  className={`admin-status ${item.status.toLowerCase()}`}
                                >
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="admin-panel admin-alert-panel">
                    <div className="admin-panel-heading">
                      <div>
                        <h2>Needs attention</h2>
                        <p>Review these sample alerts.</p>
                      </div>
                      <AlertTriangle size={20} color="#b77b27" />
                    </div>

                    {alerts.length === 0 ? (
                      <div className="admin-no-alerts">
                        <CheckCircle2 size={24} />
                        <p>All sample alerts have been dismissed.</p>
                      </div>
                    ) : (
                      <div className="admin-alert-list">
                        {alerts.slice(0, 3).map((alert) => (
                          <div
                            className="admin-alert-item"
                            key={alert.id}
                          >
                            <div className={`admin-alert-dot ${alert.type}`} />
                            <div className="admin-alert-copy">
                              <strong>{alert.title}</strong>
                              <span>{alert.detail}</span>
                              <small>{alert.time}</small>
                            </div>
                            <button
                              onClick={() => dismissAlert(alert.id)}
                              aria-label={`Dismiss ${alert.title}`}
                              title="Dismiss alert"
                            >
                              <X size={15} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      className="admin-secondary-action"
                      onClick={() => changeSection("alerts")}
                    >
                      View all alerts
                    </button>
                  </div>
                </section>

                <section className="admin-panel admin-volunteer-panel">
                  <div className="admin-panel-heading">
                    <div>
                      <h2>Volunteer overview</h2>
                      <p>Sample registered volunteers and their activity.</p>
                    </div>
                    <button
                      className="admin-text-btn"
                      onClick={() => changeSection("volunteers")}
                    >
                      Manage volunteers <ChevronDown size={15} />
                    </button>
                  </div>

                  <div className="admin-volunteer-mini-grid">
                    {volunteers.slice(0, 3).map((volunteer) => (
                      <div
                        className="admin-volunteer-mini"
                        key={volunteer.id}
                      >
                        <div className="admin-volunteer-avatar">
                          {volunteer.name.charAt(0)}
                        </div>
                        <div className="admin-volunteer-mini-info">
                          <strong>{volunteer.name}</strong>
                          <span>{volunteer.organization}</span>
                          <small>
                            {volunteer.activities} successful activities
                          </small>
                        </div>
                        <span
                          className={`admin-status ${volunteer.status.toLowerCase()}`}
                        >
                          {volunteer.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {activeSection === "donations" && (
              <section className="admin-panel">
                <div className="admin-panel-heading">
                  <div>
                    <h2>All donations</h2>
                    <p>Search, filter, and manage sample donation records.</p>
                  </div>
                  <span className="admin-record-count">
                    {filteredDonations.length} records
                  </span>
                </div>

                <div className="admin-filter-row">
                  <div className="admin-search">
                    <Search size={18} />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search item, donor or location..."
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    aria-label="Filter by status"
                  >
                    <option value="All">All statuses</option>
                    <option value="Available">Available</option>
                    <option value="Pending">Pending</option>
                    <option value="Unallocated">Unallocated</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <select
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                    aria-label="Filter by category"
                  >
                    <option value="All">All categories</option>
                    <option value="Food">Food</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Essentials">Essentials</option>
                  </select>
                </div>

                <div className="admin-table-wrap">
                  <table className="admin-table admin-full-table">
                    <thead>
                      <tr>
                        <th>Donation</th>
                        <th>Donor</th>
                        <th>Quantity</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDonations.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="admin-table-item">
                              <div
                                className={`admin-table-icon ${item.category.toLowerCase()}`}
                              >
                                <CategoryIcon category={item.category} />
                              </div>
                              <div>
                                <strong>{item.item}</strong>
                                <span>{item.category}</span>
                              </div>
                            </div>
                          </td>
                          <td>{item.donor}</td>
                          <td>{item.quantity}</td>
                          <td>
                            <span className="admin-location-cell">
                              <MapPin size={14} /> {item.location}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`admin-status ${item.status.toLowerCase()}`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td>
                            <div className="admin-row-actions">
                              <select
                                value={item.status}
                                onChange={(event) =>
                                  updateDonationStatus(
                                    item.id,
                                    event.target.value
                                  )
                                }
                                aria-label={`Change ${item.item} status`}
                              >
                                <option>Available</option>
                                <option>Pending</option>
                                <option>Unallocated</option>
                                <option>Completed</option>
                              </select>
                              <button
                                className="admin-delete-btn"
                                onClick={() => deleteDonation(item.id)}
                                aria-label={`Delete ${item.item}`}
                                title="Delete sample listing"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredDonations.length === 0 && (
                    <div className="admin-table-empty">
                      <Package size={27} />
                      <strong>No matching donations</strong>
                      <span>Try a different search or filter.</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeSection === "volunteers" && (
              <section className="admin-panel">
                <div className="admin-panel-heading">
                  <div>
                    <h2>Volunteer directory</h2>
                    <p>
                      Review volunteer profiles and change their demo status.
                    </p>
                  </div>
                  <span className="admin-record-count">
                    {filteredVolunteers.length} volunteers
                  </span>
                </div>

                <div className="admin-filter-row">
                  <div className="admin-search">
                    <Search size={18} />
                    <input
                      value={volunteerSearch}
                      onChange={(event) =>
                        setVolunteerSearch(event.target.value)
                      }
                      placeholder="Search name, organization or area..."
                    />
                  </div>
                </div>

                <div className="admin-table-wrap">
                  <table className="admin-table admin-full-table">
                    <thead>
                      <tr>
                        <th>Volunteer</th>
                        <th>Organization</th>
                        <th>Service area</th>
                        <th>Activities</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVolunteers.map((volunteer) => (
                        <tr key={volunteer.id}>
                          <td>
                            <div className="admin-table-item">
                              <div className="admin-volunteer-avatar">
                                {volunteer.name.charAt(0)}
                              </div>
                              <div>
                                <strong>{volunteer.name}</strong>
                                <span>Volunteer</span>
                              </div>
                            </div>
                          </td>
                          <td>{volunteer.organization}</td>
                          <td>{volunteer.area}</td>
                          <td>{volunteer.activities}</td>
                          <td>
                            <span
                              className={`admin-status ${volunteer.status.toLowerCase()}`}
                            >
                              {volunteer.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="admin-volunteer-toggle"
                              onClick={() =>
                                toggleVolunteerStatus(volunteer.id)
                              }
                            >
                              Set{" "}
                              {volunteer.status === "Active"
                                ? "inactive"
                                : "active"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredVolunteers.length === 0 && (
                    <div className="admin-table-empty">
                      <Users size={27} />
                      <strong>No volunteers found</strong>
                      <span>Try another search term.</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeSection === "alerts" && (
              <section className="admin-panel">
                <div className="admin-panel-heading">
                  <div>
                    <h2>Alerts and monitoring</h2>
                    <p>
                      Review sample alerts that may require admin attention.
                    </p>
                  </div>
                  <span className="admin-record-count">
                    {alerts.length} active alerts
                  </span>
                </div>

                {alerts.length === 0 ? (
                  <div className="admin-table-empty">
                    <CheckCircle2 size={30} />
                    <strong>No active sample alerts</strong>
                    <span>There are no remaining demo alerts to review.</span>
                  </div>
                ) : (
                  <div className="admin-alerts-page-list">
                    {alerts.map((alert) => (
                      <article className="admin-alert-page-card" key={alert.id}>
                        <div className={`admin-alert-large-icon ${alert.type}`}>
                          {alert.type === "urgent" ? (
                            <AlertTriangle size={22} />
                          ) : alert.type === "warning" ? (
                            <Clock3 size={22} />
                          ) : (
                            <Bell size={22} />
                          )}
                        </div>

                        <div className="admin-alert-page-copy">
                          <span className={`admin-alert-type ${alert.type}`}>
                            {alert.type === "urgent"
                              ? "Urgent"
                              : alert.type === "warning"
                                ? "Expiry reminder"
                                : "Pickup update"}
                          </span>
                          <h3>{alert.title}</h3>
                          <p>{alert.detail}</p>
                          <small>{alert.time}</small>
                        </div>

                        <button
                          className="admin-secondary-action"
                          onClick={() => dismissAlert(alert.id)}
                        >
                          Dismiss
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            <footer className="admin-page-footer">
              <span>ShareCycle Administration</span>
              <span>
                <ShieldCheck size={14} /> Frontend demo — no live records
              </span>
            </footer>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}