
import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import {
  Award,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Crown,
  Download,
  Eye,
  Gift,
  HandHeart,
  Heart,
  Leaf,
  Medal,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./BadgesCertificates.css";

// TEMPORARY FRONTEND DATA.
// Replace with logged-in user and API data when the backend is ready.
const previewUser = {
  fullName: "Your Name",
  role: "Donor",
  completedActivities: 12,
};

const MILESTONE = 5;

const getLevel = (activities) => Math.floor(activities / MILESTONE);

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

function buildCertificates(user) {
  const level = getLevel(user.completedActivities);

  return Array.from({ length: level }, (_, index) => {
    const certificateLevel = index + 1;
    const milestone = certificateLevel * MILESTONE;

    return {
      level: certificateLevel,
      milestone,
      certificateId: `SC-${String(certificateLevel).padStart(3, "0")}-PREVIEW`,
      issuedAt: new Date().toISOString(),
      title:
        user.role === "Donor" ? "Donation Champion" : "Community Hero",
      description:
        user.role === "Donor"
          ? "For sharing surplus items and helping reduce waste."
          : "For helping collect and distribute donations successfully.",
    };
  });
}

function createCertificatePdf(user, certificate) {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const w = 297;
  const h = 210;
  const activityLabel =
    user.role === "Donor"
      ? "successful donations"
      : "successful volunteering activities";

  // Ivory paper and double gold frame.
  pdf.setFillColor(253, 251, 244);
  pdf.rect(0, 0, w, h, "F");

  pdf.setDrawColor(177, 137, 61);
  pdf.setLineWidth(1.4);
  pdf.rect(7, 7, w - 14, h - 14);

  pdf.setLineWidth(0.35);
  pdf.rect(12, 12, w - 24, h - 24);

  // Decorative corner accents.
  pdf.setLineWidth(0.7);
  [
    [17, 17, 12, 0],
    [17, 17, 0, 12],
    [w - 17, 17, -12, 0],
    [w - 17, 17, 0, 12],
    [17, h - 17, 12, 0],
    [17, h - 17, 0, -12],
    [w - 17, h - 17, -12, 0],
    [w - 17, h - 17, 0, -12],
  ].forEach(([x, y, dx, dy]) => pdf.line(x, y, x + dx, y + dy));

  // Brand.
  pdf.setTextColor(35, 103, 62);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(17);
  pdf.text("SHARECYCLE", w / 2, 29, { align: "center" });

  pdf.setTextColor(157, 119, 43);
  pdf.setFontSize(9);
  pdf.text("RECOGNITION OF COMMUNITY IMPACT", w / 2, 37, {
    align: "center",
  });

  // Certificate heading.
  pdf.setTextColor(35, 70, 48);
  pdf.setFont("times", "bold");
  pdf.setFontSize(27);
  pdf.text("CERTIFICATE OF ACHIEVEMENT", w / 2, 52, {
    align: "center",
  });

  pdf.setTextColor(102, 108, 97);
  pdf.setFont("times", "italic");
  pdf.setFontSize(13);
  pdf.text("This certificate is proudly presented to", w / 2, 65, {
    align: "center",
  });

  pdf.setTextColor(32, 61, 42);
  pdf.setFont("times", "bold");
  pdf.setFontSize(25);

  pdf.text(user.fullName, w / 2, 81, {
    align: "center",
    maxWidth: 225,
  });

  pdf.setDrawColor(177, 137, 61);
  pdf.line(68, 86, 229, 86);

  pdf.setTextColor(49, 86, 58);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text(`POSITION: ${user.role.toUpperCase()}`, w / 2, 97, {
    align: "center",
  });

  pdf.setTextColor(83, 91, 82);
  pdf.setFont("times", "normal");
  pdf.setFontSize(12);
  pdf.text(
    `For successfully completing ${certificate.milestone} ${activityLabel}`,
    w / 2,
    110,
    { align: "center" }
  );
  pdf.text(
    "and making a meaningful contribution through ShareCycle.",
    w / 2,
    118,
    { align: "center" }
  );

  pdf.setTextColor(35, 103, 62);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text(
    `${certificate.title}  |  LEVEL ${certificate.level}`,
    w / 2,
    135,
    { align: "center" }
  );

  // Gold seal.
  pdf.setDrawColor(177, 137, 61);
  pdf.setLineWidth(1);
  pdf.circle(w / 2, 151, 9);
  pdf.setFontSize(7);
  pdf.setTextColor(143, 104, 36);
  pdf.text("AWARDED", w / 2, 150, { align: "center" });
  pdf.text("WITH PRIDE", w / 2, 154, { align: "center" });

  // Footer metadata.
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(83, 91, 82);
  pdf.text(`Certificate ID: ${certificate.certificateId}`, 23, 180);
  pdf.text(`Issued on: ${formatDate(certificate.issuedAt)}`, 23, 186);

  pdf.setDrawColor(177, 137, 61);
  pdf.line(210, 179, 267, 179);
  pdf.setFontSize(9);
  pdf.text("ShareCycle Community", 238.5, 185, { align: "center" });

  return pdf;
}

export default function BadgesCertificates() {
  // These values are preview data until the backend is connected.
  const [user] = useState(previewUser);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showAllCertificates, setShowAllCertificates] = useState(false);

  const certificates = useMemo(() => buildCertificates(user), [user]);

  const currentLevel = getLevel(user.completedActivities);
  const nextMilestone = (currentLevel + 1) * MILESTONE;
  const remaining = nextMilestone - user.completedActivities;
  const progress = (user.completedActivities % MILESTONE) * 20;
  const isDonor = user.role === "Donor";

  const displayedCertificates = showAllCertificates
    ? certificates
    : certificates.slice(-3).reverse();

  function downloadCertificate(certificate) {
    createCertificatePdf(user, certificate).save(
      `ShareCycle-Level-${certificate.level}-${certificate.certificateId}.pdf`
    );
  }

  function viewCertificate(certificate) {
    const pdf = createCertificatePdf(user, certificate);
    const blobUrl = URL.createObjectURL(pdf.output("blob"));

    const newTab = window.open(blobUrl, "_blank");

    if (!newTab) {
      URL.revokeObjectURL(blobUrl);
      alert("Allow pop-ups in your browser to view the certificate.");
      return;
    }

    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
  }

  return (
    <>
      <Navbar />

      <main className="sc-achievements">
        <section className="sc-achievements-hero">
          <div className="sc-hero-glow sc-hero-glow-one" />
          <div className="sc-hero-glow sc-hero-glow-two" />

          <div className="sc-hero-copy">
            <span className="sc-eyebrow">
              <Leaf size={15} />
              EVERY ACT OF KINDNESS COUNTS
            </span>

            <h1>
              Small actions.
              <br />
              <span>Lasting impact.</span>
            </h1>

            <p>
              Every donation shared and every volunteering effort brings
              us closer to a community where nothing useful goes to waste.
              Celebrate the difference you make.
            </p>

            <a href="#sc-progress" className="sc-hero-link">
              Explore your achievements <ArrowRight size={17} />
            </a>
          </div>

          <div className="sc-hero-art" aria-hidden="true">
            <div className="sc-art-orbit sc-art-orbit-one" />
            <div className="sc-art-orbit sc-art-orbit-two" />
            <div className="sc-art-medal">
              <div className="sc-art-medal-inner">
                <Award size={76} strokeWidth={1.15} />
                <Sparkles className="sc-art-sparkle" size={27} />
              </div>
            </div>
            <span className="sc-art-leaf sc-art-leaf-one">
              <Leaf size={32} />
            </span>
            <span className="sc-art-leaf sc-art-leaf-two">
              <Heart size={26} />
            </span>
            <span className="sc-art-star">✦</span>
          </div>

          <div className="sc-hero-bottom">
            <span><ShieldCheck size={15} /> Community contribution</span>
            <span><Award size={15} /> Milestone certificates</span>
            <span><Heart size={15} /> Positive impact</span>
          </div>
        </section>

        <section className="sc-welcome-row">
          <div className="sc-welcome-avatar">
            {isDonor ? <Heart size={28} /> : <HandHeart size={28} />}
          </div>

          <div className="sc-welcome-text">
            <span className="sc-section-kicker">YOUR SHARECYCLE JOURNEY</span>
            <h2>Keep making a difference, {user.fullName}.</h2>
            <p>
              Your {user.role.toLowerCase()} journey is about more than
              numbers. It is about the people and communities you help.
            </p>
          </div>

          <div className="sc-role-pill">
            {isDonor ? <Heart size={15} /> : <HandHeart size={15} />}
            {user.role}
          </div>
        </section>

        <section className="sc-stats-grid" id="sc-progress">
          <article className="sc-stat-card sc-stat-green">
            <div className="sc-stat-icon"><CheckCircle2 size={23} /></div>
            <span className="sc-stat-label">Completed activities</span>
            <strong>{user.completedActivities}</strong>
            <span className="sc-stat-foot">Your contribution so far</span>
          </article>

          <article className="sc-stat-card sc-stat-gold">
            <div className="sc-stat-icon"><Trophy size={23} /></div>
            <span className="sc-stat-label">Certificates earned</span>
            <strong>{certificates.length}</strong>
            <span className="sc-stat-foot">One for every 5 activities</span>
          </article>

          <article className="sc-stat-card sc-stat-cream">
            <div className="sc-stat-icon"><Crown size={23} /></div>
            <span className="sc-stat-label">Current level</span>
            <strong>{currentLevel}</strong>
            <span className="sc-stat-foot">
              {currentLevel > 0 ? "Milestone unlocked" : "Your journey starts here"}
            </span>
          </article>
        </section>

        <section className="sc-progress-panel">
          <div className="sc-panel-heading">
            <div>
              <span className="sc-section-kicker">YOUR NEXT MILESTONE</span>
              <h2>You're building something meaningful.</h2>
              <p>Every five successfully completed activities unlocks a certificate.</p>
            </div>
            <div className="sc-progress-award"><Gift size={29} /></div>
          </div>

          <div className="sc-progress-summary">
            <div>
              <span className="sc-muted-label">Progress to Level {currentLevel + 1}</span>
              <strong>{user.completedActivities} / {nextMilestone} activities</strong>
            </div>
            <span className="sc-progress-percent">{progress}%</span>
          </div>

          <div
            className="sc-progress-track"
            role="progressbar"
            aria-label="Progress to next certificate"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="sc-progress-fill" style={{ width: `${progress}%` }}>
              <span />
            </div>
          </div>

          <div className="sc-progress-footer">
            <span><Sparkles size={15} /> {remaining} more to reach your next level</span>
            <span>Next reward: Level {currentLevel + 1}</span>
          </div>

          <div className="sc-milestone-track">
            {[5, 10, 15, 20].map((milestone) => {
              const reached = user.completedActivities >= milestone;

              return (
                <div
                  className={`sc-milestone ${reached ? "is-reached" : ""}`}
                  key={milestone}
                >
                  <div className="sc-milestone-node">
                    {reached ? <CheckCircle2 size={19} /> : <span>{milestone / 5}</span>}
                  </div>
                  <strong>Level {milestone / 5}</strong>
                  <span>{milestone} activities</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="sc-achievement-types">
          <div className="sc-section-heading">
            <div>
              <span className="sc-section-kicker">RECOGNITION THAT MATTERS</span>
              <h2>Achievements with purpose</h2>
              <p>Each milestone celebrates your contribution to a better community.</p>
            </div>
          </div>

          <div className="sc-type-grid">
            <article className="sc-type-card sc-type-donor">
              <div className="sc-type-icon"><Heart size={26} /></div>
              <span className="sc-type-number">01 / DONOR</span>
              <h3>Donation Champion</h3>
              <p>
                Recognising every five successfully completed donations
                that help useful items reach people who need them.
              </p>
              <div className="sc-type-bottom">
                <span><Award size={16} /> Every 5 donations</span>
                <BadgeCheck size={21} />
              </div>
            </article>

            <article className="sc-type-card sc-type-volunteer">
              <div className="sc-type-icon"><HandHeart size={26} /></div>
              <span className="sc-type-number">02 / VOLUNTEER</span>
              <h3>Community Hero</h3>
              <p>
                Honouring every five successfully completed volunteering
                activities that support collection and distribution.
              </p>
              <div className="sc-type-bottom">
                <span><Award size={16} /> Every 5 activities</span>
                <BadgeCheck size={21} />
              </div>
            </article>
          </div>
        </section>

        <section className="sc-certificates-section">
          <div className="sc-section-heading sc-cert-heading">
            <div>
              <span className="sc-section-kicker">YOUR PERSONAL COLLECTION</span>
              <h2>Certificates of achievement</h2>
              <p>Each certificate represents a milestone in your ShareCycle journey.</p>
            </div>

            {certificates.length > 3 && (
              <button
                className="sc-text-button"
                type="button"
                onClick={() => setShowAllCertificates((value) => !value)}
              >
                {showAllCertificates ? "Show recent" : "View all"}
                <ChevronRight size={17} />
              </button>
            )}
          </div>

          {certificates.length === 0 ? (
            <div className="sc-empty-state">
              <div className="sc-empty-icon"><Award size={37} /></div>
              <h3>Your first certificate is waiting.</h3>
              <p>
                Complete five successful {isDonor ? "donations" : "volunteering activities"}
                {" "}to unlock your first achievement certificate.
              </p>
              <div className="sc-empty-progress">
                <span style={{ width: `${progress}%` }} />
              </div>
              <small>{user.completedActivities} of 5 completed activities</small>
            </div>
          ) : (
            <div className="sc-certificate-grid">
              {displayedCertificates.map((certificate) => (
                <article className="sc-certificate-card" key={certificate.certificateId}>
                  <div className="sc-certificate-preview">
                    <div className="sc-certificate-preview-frame">
                      <div className="sc-mini-brand">
                        <Leaf size={14} /> SHARECYCLE
                      </div>
                      <div className="sc-mini-seal"><Award size={27} /></div>
                      <span className="sc-mini-kicker">CERTIFICATE OF</span>
                      <h3>Achievement</h3>
                      <div className="sc-mini-line" />
                      <p>{user.fullName}</p>
                      <span className="sc-mini-level">LEVEL {certificate.level}</span>
                      <span className="sc-mini-bottom">RECOGNITION OF COMMUNITY IMPACT</span>
                    </div>
                  </div>

                  <div className="sc-certificate-info">
                    <div className="sc-certificate-topline">
                      <span className="sc-earned-tag">
                        <BadgeCheck size={14} /> EARNED
                      </span>
                      <span className="sc-level-tag">LEVEL {certificate.level}</span>
                    </div>

                    <h3>{certificate.title}</h3>
                    <p>{certificate.description}</p>

                    <div className="sc-certificate-meta">
                      <span><CalendarDays size={15} /> {formatDate(certificate.issuedAt)}</span>
                      <span><Trophy size={15} /> {certificate.milestone} activities</span>
                    </div>

                    <div className="sc-certificate-id">
                      Certificate ID: {certificate.certificateId}
                    </div>

                    <div className="sc-certificate-actions">
                      <button
                        type="button"
                        className="sc-view-button"
                        onClick={() => {
                          setSelectedCertificate(certificate);
                          viewCertificate(certificate);
                        }}
                      >
                        <Eye size={17} /> View
                      </button>
                      <button
                        type="button"
                        className="sc-download-button"
                        onClick={() => downloadCertificate(certificate)}
                      >
                        <Download size={17} /> Download PDF
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="sc-closing-banner">
          <div className="sc-closing-icon"><Leaf size={30} /></div>
          <div>
            <span>THE SHARECYCLE PROMISE</span>
            <h2>A little help can create a lasting change.</h2>
            <p>Thank you for helping build a community that shares more and wastes less.</p>
          </div>
          <Sparkles className="sc-closing-sparkle" size={30} />
        </section>

        {selectedCertificate && (
          <div className="sc-modal-backdrop" onClick={() => setSelectedCertificate(null)}>
            <section
              className="sc-certificate-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="sc-modal-title"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="sc-modal-close"
                aria-label="Close certificate details"
                onClick={() => setSelectedCertificate(null)}
              >
                <X size={20} />
              </button>

              <div className="sc-modal-icon"><Award size={32} /></div>
              <span className="sc-section-kicker">CERTIFICATE DETAILS</span>
              <h2 id="sc-modal-title">{selectedCertificate.title}</h2>
              <p>
                Awarded to <strong>{user.fullName}</strong> for completing{" "}
                {selectedCertificate.milestone} successful activities as a {user.role.toLowerCase()}.
              </p>
              <div className="sc-modal-details">
                <span>Certificate level</span><strong>Level {selectedCertificate.level}</strong>
                <span>Issue date</span><strong>{formatDate(selectedCertificate.issuedAt)}</strong>
                <span>Certificate ID</span><strong>{selectedCertificate.certificateId}</strong>
              </div>
              <button
                type="button"
                className="sc-download-button sc-modal-download"
                onClick={() => downloadCertificate(selectedCertificate)}
              >
                <Download size={18} /> Download certificate PDF
              </button>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
