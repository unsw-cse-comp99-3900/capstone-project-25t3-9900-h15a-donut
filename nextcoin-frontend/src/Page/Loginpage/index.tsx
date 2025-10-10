import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ email: false, password: false });

  // Validation
  const emailError = (() => {
    if (!touched.email) return "";
    if (!email) return "Email is required";
    const ok = /[^\\s@]+@[^\\s@]+\\.[^\\s@]+/.test(email);
    return ok ? "" : "Please enter a valid email";
  })();

  const passwordError = (() => {
    if (!touched.password) return "";
    if (!password) return "Password is required";
    if (password.length < 6) return "At least 6 characters";
    return "";
  })();

  const formValid = !!email && !!password && !emailError && !passwordError;

  // Form submission
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setServerError(null);
    if (!formValid) return;

    try {
      setLoading(true);
      await mockLogin(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setServerError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.logo}>Nextcoin</h1>
      </header>

      <main style={styles.main}>
        <section style={styles.left}>
          <h2 style={styles.slogan}>
            Smart briefs,
            <br />
            Bright futures
          </h2>
        </section>

        <section style={styles.card}>
          <form onSubmit={onSubmit} style={styles.form} noValidate>
            {/* Email field */}
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="nextcoin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              style={{
                ...styles.input,
                ...(emailError ? styles.inputError : {}),
              }}
              required
            />
            {emailError && <div style={styles.inlineError}>{emailError}</div>}

            {/* Password field */}
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              style={{
                ...styles.input,
                ...(passwordError ? styles.inputError : {}),
              }}
              required
            />
            {passwordError && (
              <div style={styles.inlineError}>{passwordError}</div>
            )}

            {/* Server-side error */}
            {serverError && <div style={styles.serverError}>{serverError}</div>}

            <button
              type="submit"
              style={{
                ...styles.button,
                ...(loading || !formValid ? styles.buttonDisabled : {}),
              }}
              disabled={loading || !formValid}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p style={styles.signupText}>
              Don’t have an account yet?{" "}
              <Link to="/signup" style={styles.link}>
                Sign up
              </Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}

// Mock login validation
async function mockLogin(email: string, password: string) {
  await new Promise((r) => setTimeout(r, 500));
  if (!/@unsw\\.edu\\.au$/i.test(email) || password.length < 6) {
    throw new Error("Invalid email or password");
  }
}

// Styles
const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100svh",
    background: "linear-gradient(to bottom, #a2c8ff, #f9fbff)",
  },
  header: {
    height: 80,
    display: "flex",
    alignItems: "center",
    paddingLeft: "6%",
  },
  logo: {
    fontSize: 42,
    fontStyle: "italic",
    fontWeight: 700,
    color: "#0f172a",
  },
  main: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 6%",
    gap: 40,
  },
  left: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  slogan: {
    fontSize: 42,
    fontWeight: 600,
    color: "#0f172a",
    lineHeight: 1.2,
    textAlign: "center",
  },
  card: {
    flex: 1,
    maxWidth: 520,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
    padding: 30,
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 6,
    marginTop: 12,
    textAlign: "left",
    alignSelf: "flex-start",
    width: "100%",
  },
  input: {
    height: 40,
    borderRadius: 8,
    border: "1px solid #ccc",
    padding: "0 10px",
    fontSize: 14,
  },
  inputError: {
    borderColor: "#ef4444",
    boxShadow: "0 0 0 3px rgba(239,68,68,0.12)",
  },
  inlineError: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 6,
  },
  serverError: {
    color: "#b91c1c",
    fontSize: 13,
    marginTop: 10,
    marginBottom: 6,
  },
  button: {
    marginTop: 18,
    height: 44,
    background: "#2b5cb5",
    border: "none",
    borderRadius: 8,
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
    transition: "transform .06s ease",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  signupText: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 18,
  },
  link: {
    color: "#2563eb",
    textDecoration: "underline",
  },
};
