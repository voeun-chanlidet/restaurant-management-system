import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import authServices from "../services/auth";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authServices.login({ email, password });
      login(data);
      setEmail("");
      setPassword("");
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch {
      toast.error("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-page font-serif">
      <div className="hidden lg:flex w-[42%] bg-panel border-r border-panel-border flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <span className="text-brand text-2xl">⬡</span>
          <span className="text-brand text-sm font-bold tracking-[4px]">
            RMS
          </span>
        </div>
        <div>
          <p className="text-heading text-4xl leading-snug mb-12">
            Every great meal
            <br />
            starts with great
            <br />
            management.
          </p>
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-dot-active" />
            <span className="w-2 h-2 rounded-full bg-dot-inactive" />
            <span className="w-2 h-2 rounded-full bg-dot-inactive" />
          </div>
        </div>
        <p className="text-footer text-xs tracking-widest uppercase">
          Restaurant Management System
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h2 className="text-heading text-3xl font-normal tracking-tight mb-2">
              Sign in
            </h2>
            <p className=" text-gray-500 text-sm font-sans">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <label className="text-dimmed text-xs tracking-widest uppercase font-sans">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@restaurant.com"
                required
                className="bg-input border border-border rounded-lg px-4 py-3.5 text-heading text-sm outline-none focus:border-brand transition-colors font-sans placeholder-faint"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-dimmed text-xs tracking-widest uppercase font-sans">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-input border border-border rounded-lg px-4 py-3.5 text-heading text-sm outline-none focus:border-brand transition-colors font-sans placeholder-faint"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-brand hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed text-page font-semibold text-xs tracking-widest uppercase rounded-lg py-4 transition-colors font-sans"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm font-sans">
            Don't have an account?
            <Link
              to="/register"
              className="text-brand hover:text-brand-hover transition-colors"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
