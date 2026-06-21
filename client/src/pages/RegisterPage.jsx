import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authServices from "../services/auth";
import toast from "react-hot-toast";
import { ChefHat, Loader2 } from "lucide-react";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authServices.register({ email, name, password });
      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed.");
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
            Join your team.
            <br />
            Start managing
            <br />
            with confidence.
          </p>
          <div className="flex gap-2.5">
            <span className="w-2 h-2 rounded-full bg-neutral-800 transition-all duration-300" />
            <span className="w-6 h-2 rounded-full bg-brand transition-all duration-300" />
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
              Create account
            </h2>
            <p className="text-neutral-500 text-sm">
              Fill in your details to get started
            </p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <label className="text-neutral-500 text-xs font-semibold tracking-wider uppercase font-sans">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3.5 text-heading text-sm outline-none hover:border-neutral-300 focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all duration-200 placeholder-neutral-400 font-sans"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-neutral-500 text-xs font-semibold tracking-wider uppercase font-sans">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@restaurant.com"
                required
                className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3.5 text-heading text-sm outline-none hover:border-neutral-300 focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all duration-200 placeholder-neutral-400 font-sans"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-neutral-500 text-xs font-semibold tracking-wider uppercase font-sans">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3.5 text-heading text-sm outline-none hover:border-neutral-300 focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all duration-200 placeholder-neutral-400 font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-brand hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-xs tracking-widest uppercase rounded-lg py-4 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 font-sans"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="text-center text-neutral-500 text-sm font-sans">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-brand hover:text-brand-hover transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
