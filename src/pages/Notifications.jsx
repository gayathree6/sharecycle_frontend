
import { useState } from "react";
import {
  Bell,
  CheckCheck,
  Clock,
  Heart,
  Package,
  Shirt,
  Utensils,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Filter,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Notifications.css";

const initialNotifications = [
  {
    id: 1,
    type: "donation",
    title: "Donation accepted",
    message:
      "Your donation of fresh vegetables has been accepted by Green Hope Organization.",
    time: "5 minutes ago",
    unread: true,
    icon: "package",
  },
  {
    id: 2,
    type: "pickup",
    title: "Pickup reminder",
    message:
      "A volunteer is scheduled to collect your packed meals today. Keep the donation ready.",
    time: "30 minutes ago",
    unread: true,
    icon: "clock",
  },
  {
    id: 3,
    type: "expiry",
    title: "Donation expiry alert",
    message:
      "Your fresh fruits donation is approaching its recommended consumption date.",
    time: "1 hour ago",
    unread: true,
    icon: "alert",
  },
  {
    id: 4,
    type: "donation",
    title: "Partial quantity accepted",
    message:
      "A volunteer has accepted 10 out of 20 available food packets. The remaining quantity is still available.",
    time: "3 hours ago",
    unread: false,
    icon: "food",
  },
  {
    id: 5,
    type: "achievement",
    title: "Donation completed",
    message:
      "Your clothing donation has been successfully collected and distributed. Thank you for making a difference!",
    time: "Yesterday",
    unread: false,
    icon: "heart",
  },
  {
    id: 6,
    type: "donation",
    title: "Donation still available",
    message:
      "No volunteers have accepted your essential care kits yet. Your donation is still waiting for support.",
    time: "Yesterday",
    unread: false,
    icon: "shirt",
  },
];

const iconComponents = {
  package: Package,
  clock: Clock,
  alert: AlertTriangle,
  food: Utensils,
  heart: Heart,
  shirt: Shirt,
};

const filterOptions = [
  { label: "All notifications", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Donations", value: "donation" },
  { label: "Pickups", value: "pickup" },
  { label: "Expiry alerts", value: "expiry" },
  { label: "Achievements", value: "achievement" },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(
    initialNotifications
  );
  const [activeFilter, setActiveFilter] = useState("all");
  const [notice, setNotice] = useState("");

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return notification.unread;

    return notification.type === activeFilter;
  });

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
    setNotice("All notifications marked as read.");
  };

  const dismissNotification = (id) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );
    setNotice("Notification dismissed.");
  };

  const getIcon = (iconName) => {
    const IconComponent = iconComponents[iconName] || Bell;
    return <IconComponent size={21} />;
  };

  return (
    <div className="notifications-page">
      <Navbar />

      <main className="notifications-main">
        <section className="notifications-heading">
          <div>
            <span className="notifications-eyebrow">
              STAY INFORMED
            </span>

            <h1>Notifications</h1>

            <p>
              Keep track of your donations, pickups, and
              activities in one place.
            </p>
          </div>

          <div className="notification-heading-icon">
            <Bell size={30} />
            {unreadCount > 0 && (
              <span className="notification-count">
                {unreadCount}
              </span>
            )}
          </div>
        </section>

        <section className="notification-summary">
          <div className="notification-summary-icon">
            <Bell size={22} />
          </div>

          <div className="notification-summary-text">
            <strong>
              {unreadCount === 0
                ? "You're all caught up!"
                : `You have ${unreadCount} unread ${
                    unreadCount === 1
                      ? "notification"
                      : "notifications"
                  }`}
            </strong>

            <p>
              Important updates about your ShareCycle activities
              will appear here.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              className="mark-all-button"
              onClick={markAllAsRead}
              type="button"
            >
              <CheckCheck size={17} />
              <span>Mark all as read</span>
            </button>
          )}
        </section>

        {notice && (
          <div className="notification-feedback" role="status">
            <CheckCircle2 size={18} />
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Close message"
            >
              ×
            </button>
          </div>
        )}

        <section className="notification-content">
          <div className="notification-toolbar">
            <div className="notification-toolbar-title">
              <Filter size={19} />
              <h2>Your updates</h2>
            </div>

            <span className="notification-total">
              {filteredNotifications.length}{" "}
              {filteredNotifications.length === 1
                ? "notification"
                : "notifications"}
            </span>
          </div>

          <div className="notification-filters">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`notification-filter ${
                  activeFilter === option.value ? "active" : ""
                }`}
                onClick={() => setActiveFilter(option.value)}
              >
                {option.label}

                {option.value === "unread" && unreadCount > 0 && (
                  <span className="filter-count">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>

          <div className="notification-list">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <article
                  key={notification.id}
                  className={`notification-item ${
                    notification.unread ? "is-unread" : ""
                  }`}
                >
                  <div
                    className={`notification-type-icon type-${notification.type}`}
                  >
                    {getIcon(notification.icon)}
                  </div>

                  <div className="notification-item-body">
                    <div className="notification-item-title-row">
                      <h3>{notification.title}</h3>

                      {notification.unread && (
                        <span className="unread-indicator">
                          New
                        </span>
                      )}
                    </div>

                    <p>{notification.message}</p>

                    <span className="notification-time">
                      <Clock size={14} />
                      {notification.time}
                    </span>

                    <div className="notification-actions">
                      {notification.unread && (
                        <button
                          type="button"
                          onClick={() => markAsRead(notification.id)}
                          className="notification-action primary"
                        >
                          <CheckCheck size={15} />
                          Mark as read
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          dismissNotification(notification.id)
                        }
                        className="notification-action"
                      >
                        <Trash2 size={15} />
                        Dismiss
                      </button>
                    </div>
                  </div>

                  {notification.unread && (
                    <span
                      className="notification-unread-dot"
                      aria-label="Unread"
                    />
                  )}
                </article>
              ))
            ) : (
              <div className="notifications-empty">
                <div className="notifications-empty-icon">
                  <CheckCircle2 size={32} />
                </div>

                <h3>
                  {activeFilter === "unread"
                    ? "You're all caught up!"
                    : "No notifications found"}
                </h3>

                <p>
                  {activeFilter === "unread"
                    ? "You don't have any unread notifications."
                    : "There are no notifications in this category yet."}
                </p>

                {activeFilter !== "all" && (
                  <button
                    type="button"
                    onClick={() => setActiveFilter("all")}
                    className="view-all-notifications"
                  >
                    View all notifications
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        <div className="notifications-note">
          <ShieldIcon />
          <p>
            These are sample notifications for the frontend.
            Real-time alerts will be connected to the backend later.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ShieldIcon() {
  return <CheckCircle2 size={19} />;
}
