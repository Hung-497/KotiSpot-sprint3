import { useState } from "react";
import {
  Bell,
  Mail,
  Megaphone,
  Moon,
  Monitor,
  Smartphone,
  Trash2,
  User,
} from "lucide-react";
import { apiRequest } from "../services/api";

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
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const updatePreference = async (name, value) => {
    setError("");
    setMessage("");
    setIsSaving(true);

    try {
      const data = await apiRequest("/users/me/preferences", {
        method: "PATCH",
        body: JSON.stringify({
          [name]: value,
        }),
      });

      setPreferences(data.preferences);
      setMessage("Settings saved.");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10 dark:bg-gray-950">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 dark:bg-gray-950">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-[#08243f] dark:text-gray-100">
          Settings
        </h1>

        <p className="mb-8 mt-2 text-sm text-gray-500 dark:text-gray-400">
          Manage your account
        </p>

        {error && (
          <p
            role="alert"
            className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {message && (
          <p
            role="status"
            className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {message}
          </p>
        )}

        {/* APPEARANCE */}
        <div className="mb-5 rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-green-50 p-3 text-green-700">
              <Monitor size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#08243f] dark:text-gray-100">
                Appearance
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Customize how the website looks
              </p>
            </div>
          </div>

          <hr className="mx-6 border-gray-200 dark:border-gray-700" />

          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Moon
                size={21}
                className="text-gray-700 dark:text-gray-300"
              />

              <div>
                <p className="font-medium text-[#08243f] dark:text-gray-100">
                  Theme
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Switch between light and dark mode
                </p>
              </div>
            </div>

            <div className="flex rounded-lg border border-gray-300 dark:border-gray-700">
              <button
                type="button"
                disabled={isSaving}
                aria-pressed={preferences.theme === "light"}
                onClick={() =>
                  updatePreference("theme", "light")
                }
                className={
                  preferences.theme === "light"
                    ? "bg-green-50 px-6 py-2 text-green-700"
                    : "px-6 py-2 text-gray-500 dark:text-gray-400"
                }
              >
                Light
              </button>

              <button
                type="button"
                disabled={isSaving}
                aria-pressed={preferences.theme === "dark"}
                onClick={() =>
                  updatePreference("theme", "dark")
                }
                className={
                  preferences.theme === "dark"
                    ? "bg-green-50 px-6 py-2 text-green-700"
                    : "px-6 py-2 text-gray-500 dark:text-gray-400"
                }
              >
                Dark
              </button>

              <button
                type="button"
                disabled={isSaving}
                aria-pressed={preferences.theme === "system"}
                onClick={() =>
                  updatePreference("theme", "system")
                }
                className={
                  preferences.theme === "system"
                    ? "bg-green-50 px-6 py-2 text-green-700"
                    : "px-6 py-2 text-gray-500 dark:text-gray-400"
                }
              >
                System
              </button>
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="mb-5 rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-green-50 p-3 text-green-700">
              <Bell size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#08243f] dark:text-gray-100">
                Notifications
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose what updates you want to receive
              </p>
            </div>
          </div>

          {/* EMAIL */}
          <div className="mx-6 flex items-center justify-between border-b border-gray-200 py-5 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <Mail
                size={21}
                className="text-gray-700 dark:text-gray-300"
              />

              <div>
                <p className="font-medium text-[#08243f] dark:text-gray-100">
                  Email notifications
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
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
                  ? "relative h-7 w-12 rounded-full bg-green-700 disabled:opacity-60"
                  : "relative h-7 w-12 rounded-full bg-gray-300 disabled:opacity-60"
              }
            >
              <span
                className={
                  preferences.emailNotifications
                    ? "absolute right-1 top-1 h-5 w-5 rounded-full bg-white"
                    : "absolute left-1 top-1 h-5 w-5 rounded-full bg-white"
                }
              />
            </button>
          </div>

          {/* MARKETING */}
          <div className="mx-6 flex items-center justify-between border-b border-gray-200 py-5 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <Megaphone
                size={21}
                className="text-gray-700 dark:text-gray-300"
              />

              <div>
                <p className="font-medium text-[#08243f] dark:text-gray-100">
                  Marketing emails
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
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
                  ? "relative h-7 w-12 rounded-full bg-green-700 disabled:opacity-60"
                  : "relative h-7 w-12 rounded-full bg-gray-300 disabled:opacity-60"
              }
            >
              <span
                className={
                  preferences.marketingEmails
                    ? "absolute right-1 top-1 h-5 w-5 rounded-full bg-white"
                    : "absolute left-1 top-1 h-5 w-5 rounded-full bg-white"
                }
              />
            </button>
          </div>

          {/* SMS */}
          <div className="mx-6 flex items-center justify-between py-5">
            <div className="flex items-center gap-4">
              <Smartphone
                size={21}
                className="text-gray-700 dark:text-gray-300"
              />

              <div>
                <p className="font-medium text-[#08243f] dark:text-gray-100">
                  SMS notifications
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
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
                  ? "relative h-7 w-12 rounded-full bg-green-700 disabled:opacity-60"
                  : "relative h-7 w-12 rounded-full bg-gray-300 disabled:opacity-60"
              }
            >
              <span
                className={
                  preferences.smsNotifications
                    ? "absolute right-1 top-1 h-5 w-5 rounded-full bg-white"
                    : "absolute left-1 top-1 h-5 w-5 rounded-full bg-white"
                }
              />
            </button>
          </div>
        </div>

        {/* ACCOUNT */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-green-50 p-3 text-green-700">
              <User size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#08243f] dark:text-gray-100">
                Account
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your account and data
              </p>
            </div>
          </div>

          <hr className="mx-6 border-gray-200 dark:border-gray-700" />

          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <Trash2
                size={21}
                className="text-gray-700 dark:text-gray-300"
              />

              <div>
                <p className="font-medium text-[#08243f] dark:text-gray-100">
                  Delete account
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Permanently delete your account
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={deleteAccount}
              disabled={isDeleting}
              className="flex items-center gap-2 rounded-lg border border-red-400 px-5 py-2 text-red-500"
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