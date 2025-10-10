import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  // Data (mock for now)
  const [projects, setProjects] = useState<
    Array<{ id: string; name: string; updatedAt: string }>
  >([]);

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
    salary: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function onCreate() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setTouched({});
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") closeModal();
  }

  function setField<K extends keyof typeof form>(key: K, v: string) {
    setForm((f) => ({ ...f, [key]: v }));
  }

  // Minimal validations
  const errors = {
    name: touched.name && !form.name ? "Project name is required" : "",
    objectives: "",
    start: touched.start && !form.start ? "Start date required" : "",
    end:
      touched.end &&
      form.start &&
      form.end &&
      new Date(form.end) < new Date(form.start)
        ? "End date must be after start"
        : touched.end && !form.end
        ? "End date required"
        : "",
  } as const;

  const invalid = !!(errors.name || errors.start || errors.end);

  function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, start: true, end: true });
    if (invalid) return;

    const id = Math.random().toString(36).slice(2, 8);
    setProjects((ps) => [
      ...ps,
      { id, name: form.name, updatedAt: new Date().toISOString() },
    ]);
    closeModal();
    navigate(`/projects/${id}`);
  }

  return (
    <div style={styles.page}>
      {/* Top navbar: 4 columns = brand | title | helps | menu */}
      <header style={styles.header}>
        <div style={styles.brand}>Nextcoin</div>
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
                onClick={() => navigate("/login")}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main style={styles.main}>
        {projects.length === 0 ? (
          <section style={styles.emptyWrap}>
            <button style={styles.cta} onClick={onCreate}>
              <span style={styles.ctaIcon}>★</span>
              Create New Project
            </button>
            <p style={styles.hint}>
              No projects yet. Click the button to start your first one.
            </p>
          </section>
        ) : (
          <section style={styles.grid}>
            {projects.map((p) => (
              <article key={p.id} style={styles.card}>
                <h3 style={styles.cardTitle}>{p.name}</h3>
                <p style={styles.cardMeta}>
                  Updated {new Date(p.updatedAt).toLocaleString()}
                </p>
                <div style={styles.cardActions}>
                  <button style={styles.cardBtn}>Open</button>
                  <button style={styles.cardBtnSecondary}>⋯</button>
                </div>
              </article>
            ))}
          </section>
        )}
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
              <label style={modalStyles.label}>Project name</label>
              <input
                type="text"
                placeholder="enter project name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                style={{
                  ...modalStyles.input,
                  ...(errors.name ? modalStyles.inputError : {}),
                }}
                required
              />
              {errors.name && (
                <div style={modalStyles.error}>{errors.name}</div>
              )}

              {/* Objectives */}
              <label style={modalStyles.label}>Objectives</label>
              <textarea
                placeholder="enter project keyword"
                rows={3}
                value={form.objectives}
                onChange={(e) => setField("objectives", e.target.value)}
                style={modalStyles.textarea}
              />

              {/* Timeline */}
              <div style={modalStyles.sectionHeader}>Timeline</div>
              <div style={modalStyles.row}>
                <div style={modalStyles.col}>
                  <label style={modalStyles.label}>Start date</label>
                  <input
                    type="date"
                    value={form.start}
                    onChange={(e) => setField("start", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, start: true }))}
                    style={{
                      ...modalStyles.input,
                      ...(errors.start ? modalStyles.inputError : {}),
                    }}
                  />
                  {errors.start && (
                    <div style={modalStyles.error}>{errors.start}</div>
                  )}
                </div>
                <div style={modalStyles.col}>
                  <label style={modalStyles.label}>End date</label>
                  <input
                    type="date"
                    value={form.end}
                    onChange={(e) => setField("end", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, end: true }))}
                    style={{
                      ...modalStyles.input,
                      ...(errors.end ? modalStyles.inputError : {}),
                    }}
                  />
                  {errors.end && (
                    <div style={modalStyles.error}>{errors.end}</div>
                  )}
                </div>
              </div>

              {/* Budget */}
              <label style={modalStyles.label}>Budget</label>
              <input
                type="text"
                placeholder="e.g. $60,000–$100,000"
                value={form.budget}
                onChange={(e) => setField("budget", e.target.value)}
                style={modalStyles.input}
              />

              {/* Position */}
              <label style={modalStyles.label}>Position</label>
              <input
                type="text"
                placeholder="enter needs position"
                value={form.position}
                onChange={(e) => setField("position", e.target.value)}
                style={modalStyles.input}
              />

              {/* Skills */}
              <label style={modalStyles.label}>Skills</label>
              <input
                type="text"
                placeholder="enter needs skills"
                value={form.skills}
                onChange={(e) => setField("skills", e.target.value)}
                style={modalStyles.input}
              />

              {/* Salary */}
              <label style={modalStyles.label}>Salary</label>
              <input
                type="text"
                placeholder="e.g. $70,000–$90,000"
                value={form.salary}
                onChange={(e) => setField("salary", e.target.value)}
                style={modalStyles.input}
              />

              {/* Actions */}
              <div style={modalStyles.actions}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={modalStyles.btnSecondary}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={invalid}
                  style={{
                    ...modalStyles.btnPrimary,
                    ...(invalid ? modalStyles.btnDisabled : {}),
                  }}
                >
                  Generate Brief
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
    gridTemplateColumns: "1fr 1fr 1fr auto", // 4 columns: brand | title | helps | menu
    alignItems: "center",
    padding: "0 16px",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    backdropFilter: "blur(6px)",
    gap: 16,
  },
  brand: {
    justifySelf: "start",
    fontSize: 40,
    fontStyle: "italic",
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
    display: "grid",
    placeItems: "center",
    padding: 24,
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
  grid: {
    width: "100%",
    maxWidth: 1100,
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
  label: { fontSize: 14, fontWeight: 600, margin: "12px 0 6px" },
  input: {
    width: "100%",
    height: 40,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    padding: "0 12px",
    fontSize: 14,
    background: "#fff",
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
  btnDisabled: { opacity: 0.6, cursor: "not-allowed" },
};
