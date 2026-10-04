import SavingOverlay from "../components/SavingOverlay";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiRequest } from "../services/api";

const Contact = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleFullName = (event) => {
    setFullName(event.target.value);
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleSubject = (event) => {
    setSubject(event.target.value);
  };

  const handleMessage = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const fields = [
      [fullName, "full name"],
      [email, "email"],
      [subject, "subject"],
      [message, "message"],
    ];
    const missingField = fields.find(([value]) => !value.trim());

    if (missingField) {
      setFormError(`Please fill in the ${missingField[1]} field.`);
      return;
    }

    if (!email.includes("@")) {
      setFormError("Please enter a valid email address.");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      await apiRequest("/contact-messages", {
        method: "POST",
        body: JSON.stringify({
          fullName,
          email,
          subject,
          message,
        }),
      });

      navigate("/contactthankmessage");
    } catch (error) {
      console.error("Error sending contact message:", error);
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas px-6 py-10" aria-busy={isSubmitting}>
      {isSubmitting && <SavingOverlay label="Sending message…" />}
      <div className="mx-auto max-w-5xl">
        <h1 className="ks-page-title">Contact Us</h1>

        <p className="mt-2 text-sm text-ink-muted">
          We're here to help. Send us a message and we'll get back to you.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-card border border-line bg-surface p-6"
        >
          <h2 className="mb-6 text-lg font-semibold text-ink">
            Send us a message
          </h2>

          {formError && (
            <p
              role="alert"
              className="mb-5 rounded-control bg-danger-soft px-4 py-3 text-sm text-danger"
            >
              {formError}
            </p>
          )}

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-ink">
              Full name *
            </label>

            <input
              type="text"
              value={fullName}
              onChange={handleFullName}
              placeholder="e.g. John Doe"
              className="ks-input w-full border text-sm"
            />
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-ink">
              Email *
            </label>

            <input
              type="email"
              value={email}
              onChange={handleEmail}
              placeholder="e.g. john.doe@example.com"
              className="ks-input w-full border text-sm"
            />
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-ink">
              Subject *
            </label>

            <select
              value={subject}
              onChange={handleSubject}
              className="ks-input w-full border text-sm"
            >
              <option value="">Select a subject</option>
              <option>Buy a property</option>
              <option>Rent a property</option>
              <option>Sell a property</option>
              <option>Property viewing</option>
              <option>Pricing/Property valuation</option>
              <option>Payment/Transaction support</option>
              <option>Report a property or a listing</option>
              <option>Agent/Seller inquiry</option>
              <option>Other/General inquiry</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-ink">
              Message *
            </label>

            <textarea
              value={message}
              onChange={handleMessage}
              placeholder="Type your message here..."
              rows="5"
              className="ks-input w-full resize-none border text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="ks-btn ks-btn-primary inline-block text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send message"}
          </button>
        </form>

        <div className="mt-5 rounded-card border border-line bg-surface p-6">
          <h2 className="mb-5 text-lg font-semibold text-ink">
            Other ways to reach us
          </h2>

          <div className="flex items-center justify-between border-b border-line py-4">
            <span className="text-sm text-ink-muted">Email</span>

            <span className="text-sm text-pine-700">support@example.com</span>
          </div>

          <div className="flex items-center justify-between border-b border-line py-4">
            <span className="text-sm text-ink-muted">Phone</span>

            <span className="text-sm text-pine-700">+358 10 123 4567</span>
          </div>

          <div className="flex items-center justify-between pt-4">
            <span className="text-sm text-ink-muted">Support hours</span>

            <span className="text-sm text-ink">Mon-Fri, 09:00-17:00</span>
          </div>
        </div>

        <div className="mt-5 rounded-card border border-line bg-surface p-6">
          <h2 className="text-lg font-semibold text-ink">FAQ</h2>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-ink-muted">
              Visit our Help Center for answers to common questions.
            </p>

            <button
              className="rounded-control border border-line px-5 py-2.5 text-sm text-ink transition hover:bg-surface-muted"
            >
              Go to Help Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;