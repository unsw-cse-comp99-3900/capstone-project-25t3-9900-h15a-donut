import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";

export default function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirm: false,
  });

  // --- validations ---
  const nameError = (() => {
    if (!touched.name) return "";
    if (!name) return "Company name is required";
    if (!name.trim())
      return "Company name cannot be empty or contain only spaces";
    if (name.includes(" ")) return "Company name cannot contain spaces";
    if (name.trim().length < 2) return "Please enter at least 2 characters";
    return "";
  })();

  const emailError = (() => {
    if (!touched.email) return "";
    if (!email) return "Email is required";
    if (!email.trim()) return "Email cannot be empty or contain only spaces";
    if (email.includes(" ")) return "Email cannot contain spaces";
    const ok = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email.trim());
    return ok ? "" : "Please enter a valid email";
  })();

  const passwordError = (() => {
    if (!touched.password) return "";
    if (!password) return "Password is required";
    if (!password.trim())
      return "Password cannot be empty or contain only spaces";
    if (password.includes(" ")) return "Password cannot contain spaces";
    if (password.trim().length < 6) return "At least 6 characters";
    return "";
  })();

  const confirmError = (() => {
    if (!touched.confirm) return "";
    if (!confirm) return "Please re-enter your password";
    if (!confirm.trim())
      return "Confirm password cannot be empty or contain only spaces";
    if (confirm.includes(" ")) return "Confirm password cannot contain spaces";
    if (confirm.trim() !== password.trim()) return "Passwords do not match";
    return "";
  })();

  const formValid =
    !!name &&
    !!email &&
    !!password &&
    !!confirm &&
    !!name.trim() &&
    !!email.trim() &&
    !!password.trim() &&
    !!confirm.trim() &&
    !nameError &&
    !emailError &&
    !passwordError &&
    !confirmError;

  // Form submission
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true });
    setServerError(null);
    if (!formValid) return;

    try {
      setLoading(true);

      await api.auth.register(email, password, name);

      const loginResponse = await api.auth.login(email, password);

      if (loginResponse.access_token) {
        localStorage.setItem("access_token", loginResponse.access_token);
        localStorage.setItem(
          "token_type",
          loginResponse.token_type || "bearer"
        );

        if (loginResponse.user_info) {
          localStorage.setItem(
            "user_info",
            JSON.stringify(loginResponse.user_info)
          );
        }

        navigate("/dashboard");
      } else {
        throw new Error("Login failed after registration");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setServerError(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.logo}>NextCoin</h1>
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
            {/* Company Name */}
            <label htmlFor="name" style={styles.label}>
              Company Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter company name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              style={{
                ...styles.input,
                ...(nameError ? styles.inputError : {}),
              }}
              required
            />
            {nameError && <div style={styles.inlineError}>{nameError}</div>}

            {/* Email */}
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter valid email"
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

            {/* Password */}
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter Password"
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

            {/* Confirm Password */}
            <label htmlFor="confirm" style={styles.label}>
              Confirm Password
            </label>
            <input
              id="confirm"
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
              style={{
                ...styles.input,
                ...(confirmError ? styles.inputError : {}),
              }}
              required
            />
            {confirmError && (
              <div style={styles.inlineError}>{confirmError}</div>
            )}

            {/* Server error */}
            {serverError && <div style={styles.serverError}>{serverError}</div>}

            <button
              type="submit"
              style={{
                ...styles.button,
                ...(loading || !formValid ? styles.buttonDisabled : {}),
              }}
              disabled={loading || !formValid}
            >
              {loading ? "Registering..." : "Register Now"}
            </button>

            <p style={styles.footerText}>
              Already have an account?{" "}
              <Link to="/login" style={styles.link}>
                Login
              </Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
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
    fontFamily: "'Pacifico', cursive",
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
  form: { display: "flex", flexDirection: "column" },
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
  inlineError: { color: "#ef4444", fontSize: 12, marginTop: 6 },
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
  },
  buttonDisabled: { opacity: 0.6, cursor: "not-allowed" },
  footerText: { fontSize: 13, textAlign: "center", marginTop: 18 },
  link: { color: "#2563eb", textDecoration: "underline" },
};
