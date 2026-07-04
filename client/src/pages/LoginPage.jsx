import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import authServices from "../services/auth";
import toast from "react-hot-toast";
import { ChefHat, Loader2 } from "lucide-react";

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
    } catch (err) {
      const message =
        err?.response?.data?.error || "Invalid email or password.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50/50 font-sans">
      {/* Left brand panel (large screens only) */}
      <div className="hidden lg:flex w-[42%] bg-neutral-950 border-r border-neutral-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(230,57,70,0.12),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(230,57,70,0.03),transparent)] pointer-events-none" />

        {/* Top Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shadow-[0_0_15px_rgba(230,57,70,0.2)]">
            <ChefHat className="w-5 h-5" />
          </div>
          <span className="text-white text-sm font-bold tracking-[4px]">
            RMS
          </span>
        </div>

        {/* Middle Content Slogan */}
        <div className="relative z-10">
          <p className="text-white text-4xl leading-snug font-semibold tracking-tight mb-12">
            Every great meal
            <br />
            starts with great
            <br />
            management.
          </p>
          <div className="flex gap-2.5">
            <span className="w-6 h-2 rounded-full bg-brand transition-all duration-300" />
            <span className="w-2 h-2 rounded-full bg-neutral-800 transition-all duration-300" />
            <span className="w-2 h-2 rounded-full bg-neutral-800 transition-all duration-300" />
          </div>
        </div>

        {/* Footer */}
        <p className="text-neutral-500 text-xs tracking-widest uppercase relative z-10">
          Restaurant Management System
        </p>
      </div>

      {/* Right panel (form area) */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile Branded Header */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shadow-[0_0_15px_rgba(230,57,70,0.1)]">
              <ChefHat className="w-5 h-5" />
            </div>
            <span className="text-heading text-sm font-bold tracking-[4px]">
              RMS
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-heading text-3xl font-semibold tracking-tight mb-2">
              Sign in
            </h2>
            <p className="text-neutral-500 text-sm">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <label className="text-neutral-500 text-xs font-semibold tracking-wider uppercase">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@restaurant.com"
                required
                className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3.5 text-heading text-base outline-none hover:border-neutral-300 focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all duration-200 placeholder-neutral-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-neutral-500 text-xs font-semibold tracking-wider uppercase">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3.5 text-heading text-base outline-none hover:border-neutral-300 focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all duration-200 placeholder-neutral-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-brand hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-xs tracking-widest uppercase rounded-lg py-4 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
