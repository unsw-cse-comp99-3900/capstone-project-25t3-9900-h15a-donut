import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  // UI state
  const [helpOpen, setHelpOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    objectives: "",
    start: "",
    end: "",
    budget: "",
    position: "",
    skills: "",
    salary: "50000",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  function onCreate() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setTouched({});
    setForm({
      name: "",
      objectives: "",
      start: "",
      end: "",
      budget: "",
      position: "",
      skills: "",
      salary: "",
    });
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") closeModal();
  }

  function setField<K extends keyof typeof form>(key: K, v: string) {
    setForm((f) => ({ ...f, [key]: v }));
  }

  // logout
  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("user_info");
    navigate("/login");
  }

  // check all require
  const allRequiredFilled = !!(
    form.name &&
    form.objectives &&
    form.start &&
    form.end &&
    form.budget &&
    form.position &&
    form.skills
  );

  // Minimal validations
  const errors = {
    name: touched.name && !form.name ? "Project name is required" : "",
    objectives:
      touched.objectives && !form.objectives ? "Objectives are required" : "",
    start: touched.start && !form.start ? "Start date is required" : "",
    end:
      touched.end &&
      form.start &&
      form.end &&
      new Date(form.end) < new Date(form.start)
        ? "End date must be after start"
        : touched.end && !form.end
        ? "End date is required"
        : "",
    budget: touched.budget && !form.budget ? "Budget is required" : "",
    position:
      touched.position && !form.position ? "Required position is required" : "",
    skills:
      touched.skills && !form.skills ? "Required skills are required" : "",
    salary: "",
  } as const;

  const hasErrors = !!(
    errors.name ||
    errors.objectives ||
    errors.start ||
    errors.end ||
    errors.budget ||
    errors.position ||
    errors.skills
  );

  // button condition
  const shouldDisableButton = !allRequiredFilled || hasErrors || submitting;

  // submit
  async function submitForm(e: React.FormEvent) {
    e.preventDefault();

    if (!allRequiredFilled || hasErrors) {
      setTouched({
        name: true,
        objectives: true,
        start: true,
        end: true,
        budget: true,
        position: true,
        skills: true,
      });
      return;
    }

    try {
      setSubmitting(true);
      alert("Project created successfully!");
      closeModal();
    } catch (error: any) {
      console.error("Failed to create project:", error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.page}>
      {/* Top navbar*/}
      <header style={styles.header}>
        <div style={styles.brand}>NextCoin</div>
        <h1 style={styles.navTitle}>Projects</h1>
        <button style={styles.navLinkBtn} onClick={() => setHelpOpen(true)}>
          Helps
        </button>

        <div style={styles.menuWrap}>
          <button
            style={styles.menuBtn}
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            ⋯
          </button>
          {menuOpen && (
            <div
              role="menu"
              style={styles.menu}
              onClick={() => setMenuOpen(false)}
            >
              <button
                role="menuitem"
                style={styles.menuItem}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main style={styles.main}>
        <section style={styles.emptyWrap}>
          <button style={styles.cta} onClick={onCreate}>
            <span style={styles.ctaIcon}>★</span>
            Create New Project
          </button>
          <p style={styles.hint}>
            No projects yet. Click the button to start your first one.
          </p>
        </section>
      </main>

      {/* Help card modal */}
      {helpOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-title"
          style={helpStyles.overlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setHelpOpen(false);
          }}
        >
          <div style={helpStyles.card}>
            <div style={helpStyles.icon}>☺️</div>
            <div style={helpStyles.inner}>
              <h2 id="help-title" style={helpStyles.title}>
                Helps
              </h2>
              <p>
                Please provide comprehensive details about your project while
                adhering to the specified prompts.
              </p>
              <p>
                <strong>Clear &amp; Concise</strong>
                <br />
                State the information clearly and concisely to ensure accurate
                transcription and draft generation.
              </p>
              <p>
                <strong>Organized</strong>
                <br />
                Follow the prompt order for better transcription accuracy and
                output quality.
              </p>
              <p>
                <strong>Editability</strong>
                <br />
                You'll be able to edit the draft later to perfect your brief.
              </p>
              <button
                style={helpStyles.closeBtn}
                onClick={() => setHelpOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New project modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="np-title"
          onKeyDown={onKeyDown}
          style={modalStyles.overlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div style={modalStyles.sheet}>
            <h2 id="np-title" style={modalStyles.title}>
              New Project – Form
            </h2>

            <form onSubmit={submitForm} noValidate>
              {/* Project name */}
              <label style={modalStyles.label}>Project name *</label>
              <div style={modalStyles.inputWrapper}>
                <input
                  type="text"
                  placeholder="enter project name"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  style={{
                    ...modalStyles.inputWithMic,
                    ...(errors.name ? modalStyles.inputError : {}),
                  }}
                  required
                />
                <button
                  type="button"
                  style={modalStyles.micButton}
                  onClick={() => console.log("Voice input for name")}
                >
                  🎙️
                </button>
              </div>
              {errors.name && (
                <div style={modalStyles.error}>{errors.name}</div>
              )}

              {/* Objectives */}
              <label style={modalStyles.label}>Objectives *</label>
              <div style={modalStyles.inputWrapper}>
                <textarea
                  placeholder="enter project description and objectives"
                  rows={3}
                  value={form.objectives}
                  onChange={(e) => setField("objectives", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, objectives: true }))}
                  style={{
                    ...modalStyles.textareaWithMic,
                    ...(errors.objectives ? modalStyles.inputError : {}),
                  }}
                  required
                />
                <button
                  type="button"
                  style={modalStyles.micButtonTextarea}
                  onClick={() => console.log("Voice input for objectives")}
                >
                  🎙️
                </button>
              </div>
              {errors.objectives && (
                <div style={modalStyles.error}>{errors.objectives}</div>
              )}

              {/* Timeline */}
              <div style={modalStyles.sectionHeader}>Timeline</div>
              <div style={modalStyles.row}>
                <div style={modalStyles.col}>
                  <label style={modalStyles.label}>Start date *</label>
                  <input
                    type="date"
                    value={form.start}
                    onChange={(e) => setField("start", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, start: true }))}
                    style={{
                      ...modalStyles.input,
                      ...(errors.start ? modalStyles.inputError : {}),
                    }}
                    required
                  />
                  {errors.start && (
                    <div style={modalStyles.error}>{errors.start}</div>
                  )}
                </div>
                <div style={modalStyles.col}>
                  <label style={modalStyles.label}>End date *</label>
                  <input
                    type="date"
                    value={form.end}
                    onChange={(e) => setField("end", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, end: true }))}
                    style={{
                      ...modalStyles.input,
                      ...(errors.end ? modalStyles.inputError : {}),
                    }}
                    required
                  />
                  {errors.end && (
                    <div style={modalStyles.error}>{errors.end}</div>
                  )}
                </div>
              </div>

              {/* Budget */}
              <label style={modalStyles.label}>Budget *</label>
              <select
                value={form.budget}
                onChange={(e) => setField("budget", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, budget: true }))}
                style={{
                  ...modalStyles.select,
                  ...(errors.budget ? modalStyles.inputError : {}),
                }}
                required
              >
                <option value="">Select budget range</option>
                <option value="under-10k">Under $10,000</option>
                <option value="10k-25k">$10,000 - $25,000</option>
                <option value="25k-50k">$25,000 - $50,000</option>
                <option value="50k-100k">$50,000 - $100,000</option>
                <option value="100k-250k">$100,000 - $250,000</option>
                <option value="250k-500k">$250,000 - $500,000</option>
                <option value="500k-1m">$500,000 - $1,000,000</option>
                <option value="over-1m">Over $1,000,000</option>
              </select>
              {errors.budget && (
                <div style={modalStyles.error}>{errors.budget}</div>
              )}

              {/* Position */}
              <label style={modalStyles.label}>Required Position *</label>
              <div style={modalStyles.inputWrapper}>
                <input
                  type="text"
                  placeholder="enter required position/role"
                  value={form.position}
                  onChange={(e) => setField("position", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, position: true }))}
                  style={{
                    ...modalStyles.inputWithMic,
                    ...(errors.position ? modalStyles.inputError : {}),
                  }}
                  required
                />
                <button
                  type="button"
                  style={modalStyles.micButton}
                  onClick={() => console.log("Voice input for position")}
                >
                  🎙️
                </button>
              </div>
              {errors.position && (
                <div style={modalStyles.error}>{errors.position}</div>
              )}

              {/* Skills */}
              <label style={modalStyles.label}>Required Skills *</label>
              <div style={modalStyles.inputWrapper}>
                <input
                  type="text"
                  placeholder="enter required skills"
                  value={form.skills}
                  onChange={(e) => setField("skills", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, skills: true }))}
                  style={{
                    ...modalStyles.inputWithMic,
                    ...(errors.skills ? modalStyles.inputError : {}),
                  }}
                  required
                />
                <button
                  type="button"
                  style={modalStyles.micButton}
                  onClick={() => console.log("Voice input for skills")}
                >
                  🎙️
                </button>
              </div>
              {errors.skills && (
                <div style={modalStyles.error}>{errors.skills}</div>
              )}

              {/* Salary */}
              <label style={modalStyles.label}>
                Salary Range: ${parseInt(form.salary).toLocaleString()} - $
                {(parseInt(form.salary) + 20000).toLocaleString()}
              </label>
              <div style={modalStyles.salaryContainer}>
                <span style={modalStyles.salaryLabel}>$30K</span>
                <input
                  type="range"
                  min="30000"
                  max="200000"
                  step="5000"
                  value={form.salary}
                  onChange={(e) => setField("salary", e.target.value)}
                  style={modalStyles.slider}
                />
                <span style={modalStyles.salaryLabel}>$200K</span>
              </div>
              <p style={modalStyles.salaryHint}>
                Selected range: ${parseInt(form.salary).toLocaleString()} - $
                {(parseInt(form.salary) + 20000).toLocaleString()} per year
              </p>

              {/* Actions */}
              <div style={modalStyles.actions}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={modalStyles.btnSecondary}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={shouldDisableButton}
                  style={{
                    ...modalStyles.btnPrimary,
                    ...(shouldDisableButton ? modalStyles.btnDisabled : {}),
                  }}
                  title={
                    !allRequiredFilled
                      ? "Please fill in all required fields"
                      : ""
                  }
                >
                  {submitting
                    ? "Creating..."
                    : !allRequiredFilled
                    ? "Fill Required Fields"
                    : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Styles ---------------- */

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100svh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(to bottom, #a2c8ff, #f0f6ff)",
  },
  header: {
    height: 72,
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr auto",
    alignItems: "center",
    paddingLeft: "6%",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    backdropFilter: "blur(6px)",
    gap: 16,
  },
  brand: {
    justifySelf: "start",
    fontSize: 40,
    fontFamily: "'Pacifico', cursive",
    fontWeight: 700,
    color: "#0f172a",
  },
  navTitle: {
    justifySelf: "center",
    fontSize: 22,
    margin: 0,
    color: "#0f172a",
  },
  navLinkBtn: {
    justifySelf: "center",
    background: "transparent",
    border: "none",
    color: "#0f172a",
    fontSize: 20,
    cursor: "pointer",
  },
  menuWrap: {
    justifySelf: "end",
    position: "relative",
  },
  menuBtn: {
    background: "transparent",
    border: "none",
    height: 36,
    width: 36,
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  menu: {
    position: "absolute",
    top: 44,
    right: 0,
    background: "#fff",
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 10,
    boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
    padding: 6,
    minWidth: 160,
    zIndex: 40,
  },
  menuItem: {
    display: "block",
    width: "100%",
    textAlign: "left",
    background: "transparent",
    border: "none",
    padding: "10px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loading: {
    fontSize: 18,
    color: "#64748b",
    padding: 40,
  },
  errorBanner: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    padding: "12px 16px",
    borderRadius: 8,
    marginBottom: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: 800,
  },
  errorClose: {
    background: "transparent",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    color: "#b91c1c",
  },
  emptyWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  cta: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    border: "none",
    background: "#3b66c6",
    color: "white",
    padding: "18px 28px",
    borderRadius: 18,
    fontSize: 22,
    fontWeight: 700,
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
    cursor: "pointer",
  },
  ctaIcon: { fontSize: 20 },
  hint: { color: "#334155", marginTop: 6 },
  gridWrap: {
    width: "100%",
    maxWidth: 1100,
  },
  gridHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  gridTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: "#0f172a",
    margin: 0,
  },
  createBtn: {
    background: "#3b66c6",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 16,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
  },
  cardTitle: { fontSize: 18, margin: 0, color: "#0f172a" },
  cardMeta: { fontSize: 12, color: "#64748b", marginTop: 6 },
  cardActions: { display: "flex", gap: 8, marginTop: 12 },
  cardBtn: {
    padding: "8px 12px",
    background: "#3b66c6",
    color: "white",
    borderRadius: 8,
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
  },
  cardBtnSecondary: {
    padding: "8px 12px",
    background: "#e2e8f0",
    color: "#0f172a",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },
};

/* -------------- Help card styles -------------- */
const helpStyles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 60,
  },
  card: {
    position: "relative",
    width: "min(560px, 92vw)",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
    padding: 18,
  },
  icon: {
    position: "absolute",
    top: 14,
    left: 14,
    width: 28,
    height: 28,
    display: "grid",
    placeItems: "center",
    borderRadius: 6,
    background: "#fff",
    fontSize: 18,
  },
  inner: {
    padding: 16,
    marginTop: 24,
  },
  title: { margin: "0 0 8px 0" },
  closeBtn: {
    marginTop: 12,
    background: "#93c5fd",
    color: "#0f172a",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },
};

/* -------------- New project modal styles -------------- */
const modalStyles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 50,
  },
  sheet: {
    width: "min(900px, 96vw)",
    maxHeight: "90vh",
    overflow: "auto",
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
    padding: 24,
  },
  title: { textAlign: "center", fontSize: 28, margin: "4px 0 18px" },
  label: {
    fontSize: 14,
    fontWeight: 600,
    margin: "12px 0 6px",
    display: "block",
  },
  input: {
    width: "100%",
    height: 40,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    padding: "0 12px",
    fontSize: 14,
    background: "#fff",
    boxSizing: "border-box",
  },
  inputError: {
    borderColor: "#ef4444",
    boxShadow: "0 0 0 3px rgba(239,68,68,0.12)",
  },
  textarea: {
    width: "100%",
    minHeight: 80,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    padding: 12,
    fontSize: 14,
    resize: "vertical",
    boxSizing: "border-box",
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 700,
  },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  col: {},
  error: { color: "#ef4444", fontSize: 12, marginTop: 6 },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 22,
  },
  btnSecondary: {
    background: "#e2e8f0",
    color: "#0f172a",
    borderRadius: 8,
    padding: "10px 16px",
    border: "none",
    cursor: "pointer",
  },
  btnPrimary: {
    background: "#3b66c6",
    color: "#fff",
    borderRadius: 8,
    padding: "10px 16px",
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
  },
  btnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    background: "#94a3b8",
  },
  salaryContainer: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "8px 0",
  },
  salaryLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: 600,
    minWidth: "40px",
  },
  slider: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    background: "#e2e8f0",
    outline: "none",
    appearance: "none",
    cursor: "pointer",
  },
  salaryHint: {
    fontSize: 12,
    color: "#64748b",
    margin: "4px 0 0 0",
    fontStyle: "italic",
  },
  select: {
    width: "100%",
    height: 40,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    padding: "0 12px",
    fontSize: 14,
    background: "#fff",
    boxSizing: "border-box",
    cursor: "pointer",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputWithMic: {
    width: "100%",
    height: 40,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    padding: "0 40px 0 12px",
    fontSize: 14,
    background: "#fff",
    boxSizing: "border-box",
  },
  textareaWithMic: {
    width: "100%",
    minHeight: 80,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    padding: "12px 40px 12px 12px",
    fontSize: 14,
    resize: "vertical",
    boxSizing: "border-box",
  },
  micButton: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    fontSize: 16,
    cursor: "pointer",
    padding: 4,
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  micButtonTextarea: {
    position: "absolute",
    right: 8,
    top: 12,
    background: "transparent",
    border: "none",
    fontSize: 16,
    cursor: "pointer",
    padding: 4,
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
