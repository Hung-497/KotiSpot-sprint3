import PageLoader from "../components/PageLoader";
import AuthLayout from "../components/AuthLayout";
import { useNavigate, Link } from "react-router-dom";
import useOtpAuth from "../hooks/useOtpAuth";

const Login = ({ onLogin }) => {
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
  } = useOtpAuth("login");

  return (
    <AuthLayout
      panelHeading="Find your spot. Make it home."
      panelText="Homes for sale and rent across Finland, with sellers and agents you can message directly."
      title="Welcome back"
      subtitle={
        codeRequested
          ? `Enter the code sent to ${email}`
          : "Log in with your email. We'll send you a code."
      }
      stepKey={codeRequested ? "code" : "email"}
      footer={
        <p>
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-pine-700 hover:underline"
          >
            Register
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
        <form onSubmit={requestCode}>
          {formError && (
            <p
              role="alert"
              className="mb-4 rounded-control bg-danger-soft px-4 py-3 text-sm text-danger"
            >
              {formError}
            </p>
          )}

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
            placeholder="Enter your email"
            className="ks-input"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="ks-btn ks-btn-primary mt-5 w-full"
          >
            {isSubmitting ? "Sending..." : "Continue"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={(event) =>
            verifyCode(event, (data) => {
              onLogin(data.user, data.token);
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
            htmlFor="code"
            className="mb-2 block text-sm font-medium text-ink"
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
            className="ks-input"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="ks-btn ks-btn-primary mt-5 w-full"
          >
            {isSubmitting ? "Verifying..." : "Log in"}
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={resetCode}
            className="mt-3 w-full text-sm font-medium text-pine-700 hover:underline"
          >
            Use a different email
          </button>
        </form>
      )}
    </AuthLayout>
  );
};

export default Login;