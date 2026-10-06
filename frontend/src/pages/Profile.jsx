import PageLoader from "../components/PageLoader";
import useMinimumDuration, { PAGE_LOADING_MS } from "../hooks/useMinimumDuration";
import SavingOverlay from "../components/SavingOverlay";
import { useState, useEffect } from "react";
import defaultPfp from "../assets/default-pfp.png";
import { apiRequest } from "../services/api";

const Profile = ({ onProfileUpdate }) => {
  const [profilePic, setProfilePic] = useState(defaultPfp);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("");

  const [edit, setEdit] = useState(false);
  const hasMinimumLoadingElapsed = useMinimumDuration(PAGE_LOADING_MS);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await apiRequest("/users/me");

        setFirstName(data.user.firstName || "");
        setLastName(data.user.lastName || "");
        setEmail(data.user.email || "");
        setPhoneNumber(data.user.phone || "");
        setBio(data.user.bio || "");
        setRole(data.user.role || "");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleProfilePic = (event) => {
    const file = event.target.files[0];

    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setError("");
    setIsSaving(true);

    try {
      const data = await apiRequest("/users/me", {
        method: "PATCH",
        body: JSON.stringify({
          firstName,
          lastName,
          phone: phoneNumber,
          bio,
        }),
      });

      setFirstName(data.user.firstName || "");
      setLastName(data.user.lastName || "");
      setPhoneNumber(data.user.phone || "");
      setBio(data.user.bio || "");

      onProfileUpdate(data.user);

      setEdit(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };
  if (loading || !hasMinimumLoadingElapsed) {
    return <PageLoader label="Loading profile…" fullPage />;
  }

  return (
    <div className="min-h-screen bg-canvas px-4 py-6 sm:px-6 sm:py-10" aria-busy={isSaving}>
      {isSaving && <SavingOverlay label="Saving changes…" />}
      <div className="mx-auto max-w-3xl">
        <div className="rounded-card border border-line bg-surface p-4 sm:p-6">
          <div className="flex items-center gap-5 border-b border-line pb-5">
            <img
              src={profilePic}
              alt="Profile"
              className="h-24 w-24 rounded-full border-4 border-[#08243f] object-cover dark:shadow-[0_0_22px_rgba(85,212,170,0.18)]"
            />

            <div className="h-px flex-1 bg-gray-300"></div>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-control bg-danger-soft px-4 py-3 text-sm text-danger"
            >
              {error}
            </p>
          )}

          {!edit ? (
            <div>
              <div className="mt-6 space-y-5">
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_minmax(0,1fr)]">
                  <p className="font-medium text-ink">First name:</p>

                  <p className="dark:text-white">{firstName || "-"}</p>
                </div>

                <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_minmax(0,1fr)]">
                  <p className="font-medium text-ink">Last name:</p>

                  <p className="dark:text-white">{lastName || "-"}</p>
                </div>

                <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_minmax(0,1fr)]">
                  <p className="font-medium text-ink">Email:</p>

                  <p className="dark:text-white">{email}</p>
                </div>

                <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_minmax(0,1fr)]">
                  <p className="font-medium text-ink">Phone number:</p>

                  <p className="dark:text-white">{phoneNumber || "-"}</p>
                </div>

                <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_minmax(0,1fr)]">
                  <p className="font-medium text-ink">Role:</p>

                  <p className="capitalize dark:text-white">{role || "-"}</p>
                </div>

                <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_minmax(0,1fr)]">
                  <p className="font-medium text-ink">Bio:</p>

                  <p className="dark:text-white">{bio || "-"}</p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setEdit(true)}
                  className="text-sm font-medium text-blue-500 hover:underline dark:text-[#55d4aa]"
                >
                  Edit information
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="mt-6 text-xl font-semibold text-ink">
                Edit your information
              </h2>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-ink">
                  Profile picture
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePic}
                  className="ks-file w-full min-w-0 max-w-full text-sm dark:text-[#a7b4be]"
                />
              </div>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_minmax(0,1fr)] items-center">
                  <label className="text-sm dark:text-[#a7b4be]">First name:</label>

                  <input
                    type="text"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    className="ks-input border"
                  />
                </div>

                <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_minmax(0,1fr)] items-center">
                  <label className="text-sm dark:text-[#a7b4be]">Last name:</label>

                  <input
                    type="text"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    className="ks-input border"
                  />
                </div>

                <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_minmax(0,1fr)] items-center">
                  <label className="text-sm dark:text-[#a7b4be]">Email:</label>

                  <input
                    type="email"
                    value={email}
                    disabled
                    className="ks-input border"
                  />
                </div>

                <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_minmax(0,1fr)] items-center">
                  <label className="text-sm dark:text-[#a7b4be]">Phone number:</label>

                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    className="ks-input border"
                  />
                </div>

                <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_minmax(0,1fr)] items-center">
                  <label className="text-sm dark:text-[#a7b4be]">Bio:</label>

                  <input
                    type="text"
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    className="ks-input border"
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => {setEdit(false); setError("");}}
                  className="rounded-control border border-line px-5 py-2 text-sm text-ink"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="ks-btn ks-btn-primary text-sm font-medium"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;