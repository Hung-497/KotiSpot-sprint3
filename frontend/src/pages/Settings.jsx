import PageLoader from "../components/PageLoader";
import useMinimumDuration, { PAGE_LOADING_MS } from "../hooks/useMinimumDuration";
import SavingOverlay from "../components/SavingOverlay";
import SegmentedControl from "../components/SegmentedControl";
import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Mail,
  Megaphone,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Trash2,
  User,
  CircleCheck,
  X,
} from "lucide-react";
import { apiRequest } from "../services/api";

const themeOptions = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

const Settings = ({
  preferences,
  setPreferences,
  isLoading,
  error,
  setError,
  message,
  setMessage,
  onAccountDeleted,
}) => {
  const hasMinimumLoadingElapsed = useMinimumDuration(PAGE_LOADING_MS);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const saveQueue = useRef(Promise.resolve());
  const latestSave = useRef(0);
  const confirmedPreferences = useRef(preferences);

  useEffect(() => {
    if (!isSaving) confirmedPreferences.current = preferences;
  }, [preferences, isSaving]);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => setMessage(""), 3500);
    return () => clearTimeout(timer);
  }, [message, setMessage]);

  useEffect(() => () => setMessage(""), [setMessage]);

  const updatePreference = async (name, value) => {
    if (preferences[name] === value || isDeleting || (isSaving && name !== "theme")) return;

    const version = ++latestSave.current;
    setError("");
    setMessage("");
    setIsSaving(true);
    setPreferences((current) => ({ ...current, [name]: value }));

    // Persist rapid selections in order; earlier responses cannot move
    // the selector back while a newer choice is still being saved.
    saveQueue.current = saveQueue.current.then(async () => {
      try {
        const data = await apiRequest("/users/me/preferences", {
          method: "PATCH",
          body: JSON.stringify({ [name]: value }),
        });

        confirmedPreferences.current = data.preferences;
        if (version === latestSave.current) {
          setPreferences(data.preferences);
          setMessage("Settings saved.");
        }
      } catch (error) {
        if (version === latestSave.current) {
          setPreferences(confirmedPreferences.current);
          setError(error.message);
        }
      } finally {
        if (version === latestSave.current) setIsSaving(false);
      }
    });
    await saveQueue.current;
  };

  const deleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account?",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");
    setIsDeleting(true);

    try {
      await apiRequest("/users/me", {
        method: "DELETE",
      });

      onAccountDeleted();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading || !hasMinimumLoadingElapsed) {
    return <PageLoader label="Loading settings…" fullPage />;
  }

  return (
    <div className="min-h-screen bg-surface-muted px-6 py-10" aria-busy={isDeleting}>
      {isDeleting && <SavingOverlay label="Deleting account…" />}
      <div className="mx-auto max-w-5xl">
        <h1 className="ks-page-title">
          Settings
        </h1>

        <div className="mb-8 mt-2 flex items-center justify-between gap-3">
          <p className="text-sm text-ink-muted">Manage your account</p>
          <span role="status" aria-live="polite" className="min-h-5 text-sm text-ink-muted">
            {isSaving ? "Saving…" : ""}
          </span>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-4 rounded-control bg-danger-soft px-4 py-3 text-sm text-danger"
          >
            {error}
          </p>
        )}

        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="pointer-events-none fixed inset-x-4 bottom-5 z-110 sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-24 sm:w-80"
        >
          {message && (
            <div className="pointer-events-auto flex items-center gap-3 rounded-card border border-pine-200 bg-surface px-4 py-3 text-ink shadow-raised">
              <CircleCheck size={22} className="shrink-0 text-pine-700" aria-hidden="true" />
              <p className="flex-1 text-sm font-medium">{message}</p>
              <button
                type="button"
                aria-label="Dismiss saved notification"
                onClick={() => setMessage("")}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-control text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {/* APPEARANCE */}
        <div className="mb-5 rounded-card border border-line bg-surface">
          <div className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-pine-50 p-3 text-pine-700">
              <Monitor size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-ink">
                Appearance
              </h2>

              <p className="text-sm text-ink-muted">
                Customize how the website looks
              </p>
            </div>
          </div>

          <hr className="mx-6 border-line" />

          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Moon
                size={21}
                className="text-ink-muted"
              />

              <div>
                <p className="font-medium text-ink">
                  Theme
                </p>

                <p className="text-sm text-ink-muted">
                  Switch between light and dark mode
                </p>
              </div>
            </div>

            <SegmentedControl
              options={themeOptions}
              value={preferences.theme}
              onChange={(theme) => updatePreference("theme", theme)}
              disabled={isDeleting}
              transitionName="theme-indicator"
              className="ks-theme-picker self-start sm:self-auto"
            />
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="mb-5 rounded-card border border-line bg-surface">
          <div className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-pine-50 p-3 text-pine-700">
              <Bell size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-ink">
                Notifications
              </h2>

              <p className="text-sm text-ink-muted">
                Choose what updates you want to receive
              </p>
            </div>
          </div>

          {/* EMAIL */}
          <div className="mx-6 flex items-center justify-between border-b border-line py-5">
            <div className="flex items-center gap-4">
              <Mail
                size={21}
                className="text-ink-muted"
              />

              <div>
                <p className="font-medium text-ink">
                  Email notifications
                </p>

                <p className="text-sm text-ink-muted">
                  Receive important updates via email
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              disabled={isSaving}
              aria-checked={
                preferences.emailNotifications
              }
              aria-label="Email notifications"
              onClick={() =>
                updatePreference(
                  "emailNotifications",
                  !preferences.emailNotifications,
                )
              }
              className={
                preferences.emailNotifications
                  ? "relative h-7 w-12 shrink-0 rounded-full bg-pine-700 transition-[background-color,transform] duration-200 active:scale-95"
                  : "relative h-7 w-12 shrink-0 rounded-full bg-line-strong transition-[background-color,transform] duration-200 active:scale-95"
              }
            >
              <span
                className={
                  preferences.emailNotifications
                    ? "absolute left-1 top-1 h-5 w-5 translate-x-5 rounded-full bg-white shadow-card transition-transform duration-200 ease-standard"
                    : "absolute left-1 top-1 h-5 w-5 translate-x-0 rounded-full bg-white shadow-card transition-transform duration-200 ease-standard"
                }
              />
            </button>
          </div>

          {/* MARKETING */}
          <div className="mx-6 flex items-center justify-between border-b border-line py-5">
            <div className="flex items-center gap-4">
              <Megaphone
                size={21}
                className="text-ink-muted"
              />

              <div>
                <p className="font-medium text-ink">
                  Marketing emails
                </p>

                <p className="text-sm text-ink-muted">
                  Receive offers and tips
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              disabled={isSaving}
              aria-checked={preferences.marketingEmails}
              aria-label="Marketing emails"
              onClick={() =>
                updatePreference(
                  "marketingEmails",
                  !preferences.marketingEmails,
                )
              }
              className={
                preferences.marketingEmails
                  ? "relative h-7 w-12 shrink-0 rounded-full bg-pine-700 transition-[background-color,transform] duration-200 active:scale-95"
                  : "relative h-7 w-12 shrink-0 rounded-full bg-line-strong transition-[background-color,transform] duration-200 active:scale-95"
              }
            >
              <span
                className={
                  preferences.marketingEmails
                    ? "absolute left-1 top-1 h-5 w-5 translate-x-5 rounded-full bg-white shadow-card transition-transform duration-200 ease-standard"
                    : "absolute left-1 top-1 h-5 w-5 translate-x-0 rounded-full bg-white shadow-card transition-transform duration-200 ease-standard"
                }
              />
            </button>
          </div>

          {/* SMS */}
          <div className="mx-6 flex items-center justify-between py-5">
            <div className="flex items-center gap-4">
              <Smartphone
                size={21}
                className="text-ink-muted"
              />

              <div>
                <p className="font-medium text-ink">
                  SMS notifications
                </p>

                <p className="text-sm text-ink-muted">
                  Receive important updates via SMS
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              disabled={isSaving}
              aria-checked={preferences.smsNotifications}
              aria-label="SMS notifications"
              onClick={() =>
                updatePreference(
                  "smsNotifications",
                  !preferences.smsNotifications,
                )
              }
              className={
                preferences.smsNotifications
                  ? "relative h-7 w-12 shrink-0 rounded-full bg-pine-700 transition-[background-color,transform] duration-200 active:scale-95"
                  : "relative h-7 w-12 shrink-0 rounded-full bg-line-strong transition-[background-color,transform] duration-200 active:scale-95"
              }
            >
              <span
                className={
                  preferences.smsNotifications
                    ? "absolute left-1 top-1 h-5 w-5 translate-x-5 rounded-full bg-white shadow-card transition-transform duration-200 ease-standard"
                    : "absolute left-1 top-1 h-5 w-5 translate-x-0 rounded-full bg-white shadow-card transition-transform duration-200 ease-standard"
                }
              />
            </button>
          </div>
        </div>

        {/* ACCOUNT */}
        <div className="rounded-card border border-line bg-surface">
          <div className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-pine-50 p-3 text-pine-700">
              <User size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-ink">
                Account
              </h2>

              <p className="text-sm text-ink-muted">
                Manage your account and data
              </p>
            </div>
          </div>

          <hr className="mx-6 border-line" />

          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <Trash2
                size={21}
                className="text-ink-muted"
              />

              <div>
                <p className="font-medium text-ink">
                  Delete account
                </p>

                <p className="text-sm text-ink-muted">
                  Permanently delete your account
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={deleteAccount}
              disabled={isDeleting || isSaving}
              className="flex items-center gap-2 rounded-control border border-red-400 px-5 py-2 text-red-500"
            >
              <Trash2 size={17} />
              {isDeleting ? "Deleting..." : "Delete account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
