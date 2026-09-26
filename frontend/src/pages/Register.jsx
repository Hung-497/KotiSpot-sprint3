import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/KotiSpot_Logo.png";
import { useState } from "react";
import { apiRequest } from "../services/api";

const Register = ({ onRegister }) => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeRequested, setCodeRequested] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestCode = async (event) => {
    event.preventDefault();

    if (!firstName.trim()) {
      setFormError("Please enter your first name.");
      return;
    }

    if (!lastName.trim()) {
      setFormError("Please enter your last name.");
      return;
    }

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
          mode: "register", // only works for emails that don't have an account yet
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
      setFormError("Please enter the 6-digit verification code.");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      const authData = await apiRequest("/account/verify-code", {
        method: "POST",
        body: JSON.stringify({
          email,
          code: code.trim(),
          mode: "register",
        }),
      });

      const profileData = await apiRequest("/users/me", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }),
      });

      onRegister(profileData.user, authData.token);

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
            Sign up to get started
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            {codeRequested
              ? `Enter the code sent to ${email}`
              : "Create your KotiSpot account"}
          </p>
        </div>

        {!codeRequested ? (
          <form onSubmit={requestCode} className="space-y-5">
            {formError && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {formError}
              </p>
            )}

            <div>
              <label
                htmlFor="firstName"
                className="mb-2 block text-sm font-medium text-[#08243f]"
              >
                First name
              </label>

              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#1f7356] focus:ring-1 focus:ring-[#1f7356]"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="mb-2 block text-sm font-medium text-[#08243f]"
              >
                Last name
              </label>

              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#1f7356] focus:ring-1 focus:ring-[#1f7356]"
              />
            </div>

            <div>
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#1f7356] focus:ring-1 focus:ring-[#1f7356]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#1f7356] py-3 font-medium text-white transition hover:bg-[#165942] disabled:cursor-not-allowed disabled:opacity-60"
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
              htmlFor="register-code"
              className="mb-2 block text-sm font-medium text-[#08243f]"
            >
              Verification code
            </label>

            <input
              id="register-code"
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
              {isSubmitting ? "Creating account..." : "Create account"}
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
              Change information
            </button>
          </form>
        )}

        <div className="mt-7 text-center text-sm text-gray-600">
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-[#1f7356] hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
