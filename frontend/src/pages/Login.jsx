import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/KotiSpot_Logo.png";
import { apiRequest } from "../services/api";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeRequested, setCodeRequested] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestCode = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setFormError("Please enter your email.");
      return;
    }

    if (!email.includes("@")) {
      setFormError("Please enter a valid email address.");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      await apiRequest("/account/request-code", {
        method: "POST",
        body: JSON.stringify({
          email,
          mode: "login", // only works for emails that already have an account
        }),
      });

      setCodeRequested(true);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyCode = async (event) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(code.trim())) {
      setFormError("Please enter the 6-digit login code.");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      const data = await apiRequest("/account/verify-code", {
        method: "POST",
        body: JSON.stringify({
          email,
          code: code.trim(),
          mode: "login",
        }),
      });

      onLogin(data.user, data.token);
      navigate("/");
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f9f8] px-4">
      <div className="w-full max-w-107.5 rounded-xl bg-white px-10 py-12 shadow-sm">
        <div className="mb-8 flex justify-center">
          <img src={logo} alt="KotiSpot" className="w-45 h-auto" />
        </div>

        <div className="mb-7 text-center">
          <h1 className="text-2xl font-semibold text-[#08243f]">
            Welcome back boss!
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            {codeRequested
              ? `Enter the code sent to ${email}`
              : "Log in to your account"}
          </p>
        </div>

        {!codeRequested ? (
          <form onSubmit={requestCode}>
            {formError && (
              <p
                role="alert"
                className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {formError}
              </p>
            )}

            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#08243f]"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#1f7356] focus:ring-1 focus:ring-[#1f7356]"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-5 w-full rounded-lg bg-[#1f7356] py-3 font-medium text-white transition hover:bg-[#165942] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode}>
            {formError && (
              <p
                role="alert"
                className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {formError}
              </p>
            )}

            <label
              htmlFor="code"
              className="mb-2 block text-sm font-medium text-[#08243f]"
            >
              Login code
            </label>

            <input
              id="code"
              type="text"
              inputMode="numeric"
              maxLength="6"
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, ""))
              }
              placeholder="Enter 6-digit code"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#1f7356] focus:ring-1 focus:ring-[#1f7356]"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-5 w-full rounded-lg bg-[#1f7356] py-3 font-medium text-white transition hover:bg-[#165942] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Verifying..." : "Log in"}
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setCode("");
                setFormError("");
                setCodeRequested(false);
              }}
              className="mt-3 w-full text-sm font-medium text-[#1f7356] hover:underline"
            >
              Use a different email
            </button>
          </form>
        )}

        <div className="mt-7 text-center text-sm text-gray-600">
          <p>Don't have an account?</p>

          <Link
            to="/register"
            className="mt-1 inline-block font-medium text-[#1f7356] hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;