import { useState } from "react";
import { apiRequest } from "../services/api";

const useOtpAuth = (mode) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeRequested, setCodeRequested] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestCode = async (event, validateBeforeRequest) => {
    event.preventDefault();

    const validationError = validateBeforeRequest?.();

    if (validationError) {
      setFormError(validationError);
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
          email: email.trim(),
          mode, 
        }),
      });

      setCodeRequested(true);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyCode = async (event, onVerified) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(code.trim())) {
      setFormError("Please enter the 6-digit verification code.");
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
          mode,
        }),
      });

      await onVerified(data);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetCode = () => {
    setCode("");
    setFormError("");
    setCodeRequested(false);
  };

  return {
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
  }
};

export default useOtpAuth;