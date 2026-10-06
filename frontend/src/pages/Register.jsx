import PageLoader from "../components/PageLoader";
import AuthLayout from "../components/AuthLayout";
import { useNavigate, Link } from "react-router-dom";
import useOtpAuth from "../hooks/useOtpAuth";
import { useState } from "react";
import { apiRequest } from "../services/api";

const Register = ({ onRegister }) => {
  const navigate = useNavigate();

  const {
    email,
    setEmail,
    code,
    setCode,
    codeRequested,
    formError,
    isSubmitting,
    requestCode,
    verifyCode,
    resetCode,
  } = useOtpAuth("register");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  return (
    <AuthLayout
      panelHeading="Find your spot. Make it home."
      panelText="Homes for sale and rent across Finland, with sellers and agents you can message directly."
      title="Create your account"
      subtitle={
        codeRequested
          ? `Enter the code sent to ${email}`
          : "Create your KotiSpot account."
      }
      stepKey={codeRequested ? "code" : "email"}
      footer={
        <p>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-pine-700 hover:underline"
          >
            Log in
          </Link>
        </p>
      }
    >
      {isSubmitting && (
        <PageLoader
          label={codeRequested ? "Verifying code…" : "Sending code…"}
          variant="spinner"
          className="mb-4"
        />
      )}

      {!codeRequested ? (
        <form
          onSubmit={(event) =>
            requestCode(event, () => {
              if (!firstName.trim()) {
                return "Please enter your first name.";
              }

              if (!lastName.trim()) {
                return "Please enter your last name.";
              }

              return null;
            })
          }
          className="space-y-5"
        >
          {formError && (
            <p
              role="alert"
              className="rounded-control bg-danger-soft px-4 py-3 text-sm text-danger"
            >
              {formError}
            </p>
          )}

          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-sm font-medium text-ink"
            >
              First name
            </label>

            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="ks-input"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-sm font-medium text-ink"
            >
              Last name
            </label>

            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="ks-input"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-ink"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="ks-input"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="ks-btn ks-btn-primary w-full"
          >
            {isSubmitting ? "Sending..." : "Continue"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={(event) =>
            verifyCode(event, async (authData) => {
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
            })
          }
        >
          {formError && (
            <p
              role="alert"
              className="mb-4 rounded-control bg-danger-soft px-4 py-3 text-sm text-danger"
            >
              {formError}
            </p>
          )}

          <label
            htmlFor="register-code"
            className="mb-2 block text-sm font-medium text-ink"
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
            className="ks-input"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="ks-btn ks-btn-primary mt-5 w-full"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={resetCode}
            className="mt-3 w-full text-sm font-medium text-pine-700 hover:underline"
          >
            Change information
          </button>
        </form>
      )}
    </AuthLayout>
  );
};

export default Register;