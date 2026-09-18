import { useState } from "react";
import { Bell, Mail, Megaphone, Moon, Monitor, Smartphone, Trash2, User } from "lucide-react";

const Settings = () => {
  const [theme, setTheme] = useState("light");

  const [email, setEmail] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [sms, setSms] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        <h1 className="text-3xl font-bold text-[#08243f]">
          Settings
        </h1>

        <p className="mb-8 mt-2 text-sm text-gray-500">
          Manage your account
        </p>

        <div className="mb-5 rounded-2xl border border-gray-200 bg-white">

          <div className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-green-50 p-3 text-green-700">
              <Monitor size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#08243f]">
                Appearance
              </h2>

              <p className="text-sm text-gray-500">
                Customize how the website looks
              </p>
            </div>
          </div>

          <hr className="mx-6" />

          <div className="flex items-center justify-between p-6">

            <div className="flex items-center gap-4">
              <Moon size={21} />

              <div>
                <p className="font-medium text-[#08243f]">
                  Theme
                </p>

                <p className="text-sm text-gray-500">
                  Switch between light and dark mode
                </p>
              </div>
            </div>

            <div className="flex rounded-lg border">

              <button
                onClick={() => setTheme("light")}
                className={
                  theme === "light"
                    ? "bg-green-50 px-6 py-2 text-green-700"
                    : "px-6 py-2 text-gray-500"
                }
              >
                Light
              </button>

              <button
                onClick={() => setTheme("dark")}
                className={
                  theme === "dark"
                    ? "bg-green-50 px-6 py-2 text-green-700"
                    : "px-6 py-2 text-gray-500"
                }
              >
                Dark
              </button>

              <button
                onClick={() => setTheme("system")}
                className={
                  theme === "system"
                    ? "bg-green-50 px-6 py-2 text-green-700"
                    : "px-6 py-2 text-gray-500"
                }
              >
                System
              </button>

            </div>
          </div>
        </div>

        <div className="mb-5 rounded-2xl border border-gray-200 bg-white">

          <div className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-green-50 p-3 text-green-700">
              <Bell size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#08243f]">
                Notifications
              </h2>

              <p className="text-sm text-gray-500">
                Choose what updates you want to receive
              </p>
            </div>
          </div>

          <div className="mx-6 flex items-center justify-between border-b py-5">

            <div className="flex items-center gap-4">
              <Mail size={21} />

              <div>
                <p className="font-medium text-[#08243f]">
                  Email notifications
                </p>

                <p className="text-sm text-gray-500">
                  Receive important updates via email
                </p>
              </div>
            </div>

            <button
              onClick={() => setEmail(!email)}
              className={
                email
                  ? "relative h-7 w-12 rounded-full bg-green-700"
                  : "relative h-7 w-12 rounded-full bg-gray-300"
              }
            >
              <span
                className={
                  email
                    ? "absolute right-1 top-1 h-5 w-5 rounded-full bg-white"
                    : "absolute left-1 top-1 h-5 w-5 rounded-full bg-white"
                }
              />
            </button>

          </div>

          <div className="mx-6 flex items-center justify-between border-b py-5">

            <div className="flex items-center gap-4">
              <Megaphone size={21} />

              <div>
                <p className="font-medium text-[#08243f]">
                  Marketing emails
                </p>

                <p className="text-sm text-gray-500">
                  Receive offers and tips
                </p>
              </div>
            </div>

            <button
              onClick={() => setMarketing(!marketing)}
              className={
                marketing
                  ? "relative h-7 w-12 rounded-full bg-green-700"
                  : "relative h-7 w-12 rounded-full bg-gray-300"
              }
            >
              <span
                className={
                  marketing
                    ? "absolute right-1 top-1 h-5 w-5 rounded-full bg-white"
                    : "absolute left-1 top-1 h-5 w-5 rounded-full bg-white"
                }
              />
            </button>

          </div>

          <div className="mx-6 flex items-center justify-between py-5">

            <div className="flex items-center gap-4">
              <Smartphone size={21} />

              <div>
                <p className="font-medium text-[#08243f]">
                  SMS notifications
                </p>

                <p className="text-sm text-gray-500">
                  Receive important updates via SMS
                </p>
              </div>
            </div>

            <button
              onClick={() => setSms(!sms)}
              className={
                sms
                  ? "relative h-7 w-12 rounded-full bg-green-700"
                  : "relative h-7 w-12 rounded-full bg-gray-300"
              }
            >
              <span
                className={
                  sms
                    ? "absolute right-1 top-1 h-5 w-5 rounded-full bg-white"
                    : "absolute left-1 top-1 h-5 w-5 rounded-full bg-white"
                }
              />
            </button>

          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white">

          <div className="flex items-center gap-4 p-6">

            <div className="rounded-full bg-green-50 p-3 text-green-700">
              <User size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#08243f]">
                Account
              </h2>

              <p className="text-sm text-gray-500">
                Manage your account and data
              </p>
            </div>

          </div>

          <hr className="mx-6" />

          <div className="flex items-center justify-between p-6">

            <div className="flex items-center gap-4">
              <Trash2 size={21} />

              <div>
                <p className="font-medium text-[#08243f]">
                  Delete account
                </p>

                <p className="text-sm text-gray-500">
                  Permanently delete your account and all data
                </p>
              </div>
            </div>

            <button className="flex items-center gap-2 rounded-lg border border-red-400 px-5 py-2 text-red-500">
              <Trash2 size={17} />
              Delete account
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;