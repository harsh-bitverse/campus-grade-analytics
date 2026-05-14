import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await login(form);
      navigate("/");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="mx-auto max-w-lg rounded-[2rem] border border-slate-200/70 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-3xl font-bold">Login</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">Use your account to access protected admin actions.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 outline-none dark:border-slate-700"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 outline-none dark:border-slate-700"
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
        />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <button type="submit" className="w-full rounded-full bg-slate-900 px-6 py-3 font-medium text-white dark:bg-brand-500">
          Login
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        No account yet? <Link to="/signup" className="font-medium text-brand-600">Create one</Link>
      </p>
    </div>
  );
}

