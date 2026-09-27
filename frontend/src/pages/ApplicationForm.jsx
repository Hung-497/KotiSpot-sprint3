import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import { imageToText } from "../utils/imageUtils";

const ApplicationForm = ({ userRole }) => {
  // A seller can only upgrade to agent, so the agent form is picked for them
  const isSeller = userRole === "seller";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState(isSeller ? "agent" : "");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [about, setAbout] = useState("");
  const [governmentId, setGovernmentId] = useState(null);
  const [realEstateLicense, setRealEstateLicense] = useState(null);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleFullName = (event) => {
    setFullName(event.target.value);
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handlePhoneNumber = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleRole = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const commonFields = [
      [fullName, "full name"],
      [email, "email"],
      [phoneNumber, "phone number"],
      [role, "account type"],
    ];

    const missingCommonField = commonFields.find(([value]) => !value.trim());

    if (missingCommonField) {
      setFormError(`Please fill in the ${missingCommonField[1]} field.`);
      return;
    }

    if (!email.includes("@")) {
      setFormError("Please enter a valid email address.");
      return;
    }

    const roleFields =
      role === "seller"
        ? [
            [about, "about yourself"],
            [governmentId, "government ID"],
          ]
        : [
            [location, "operating location"],
            [licenseNumber, "licence number"],
            [about, "about yourself"],
            [governmentId, "government ID"],
            [realEstateLicense, "real estate licence"],
          ];

    const missingRoleField = roleFields.find(
      ([value]) => !value || !String(value).trim(),
    );

    if (missingRoleField) {
      setFormError(`Please provide your ${missingRoleField[1]}.`);
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      // Turn the pictures into text so they can be sent with the application
      const idDocument = await imageToText(governmentId);

      let licenseDocument;
      if (role === "agent") {
        licenseDocument = await imageToText(realEstateLicense);
      }

      const applicationData = {
        role,
        fullName,
        companyName: role === "agent" ? companyName : undefined,
        phone: phoneNumber,
        email,
        areas: role === "agent" ? location : undefined,
        licenseNumber: role === "agent" ? licenseNumber : undefined,
        bio: about,
        idDocument,
        licenseDocument,
      };

      await apiRequest("/verifications", {
        method: "POST",
        body: JSON.stringify(applicationData),
      });

      navigate("/applicationthankmessage");
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-300 bg-white p-6"
        >
          <div className="mb-6">
            <h1 className="text-center text-2xl font-bold text-[#08243f]">
              Application form
            </h1>
          </div>

          <h2 className="mb-4 text-base font-semibold text-[#08243f]">
            Personal information
          </h2>

          {formError && (
            <p
              role="alert"
              className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {formError}
            </p>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-[150px_1fr] md:items-center">
              <label className="text-sm text-gray-700">Full name:</label>

              <input
                type="text"
                value={fullName}
                placeholder="Someone Something"
                onChange={handleFullName}
                className=" w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#17634f]"
              />
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-[150px_1fr] md:items-center">
              <label className="text-sm text-gray-700">Email:</label>

              <input
                type="email"
                value={email}
                placeholder="someone.something@gmail.com"
                onChange={handleEmail}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#17634f]"
              />
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-[150px_1fr] md:items-center">
              <label className="text-sm text-gray-700">Phone number:</label>

              <input
                type="text"
                value={phoneNumber}
                placeholder="+4454556767677777"
                onChange={handlePhoneNumber}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#17634f]"
              />
            </div>
          </div>

          {isSeller ? (
            <p className="mt-7 rounded-lg bg-[#eef6f2] px-4 py-3 text-sm text-[#17634f]">
              You are already a seller. Fill in the form below to upgrade your
              account to a real estate agent.
            </p>
          ) : (
            <div className="mt-7">
              <h2 className="mb-3 text-sm font-medium text-[#08243f]">
                What type of account are you applying for?
              </h2>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    value="seller"
                    checked={role === "seller"}
                    onChange={handleRole}
                  />
                  Seller
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    value="agent"
                    checked={role === "agent"}
                    onChange={handleRole}
                  />
                  Real estate agent
                </label>
              </div>
            </div>
          )}

          {role === "seller" && (
            <>
              <div className="mb-6">
                <label className="mb-2 block text-sm text-gray-700">
                  Tell us about yourself:
                </label>

                <textarea
                  value={about}
                  onChange={(event) => setAbout(event.target.value)}
                  placeholder="A short introduction..."
                  rows="4"
                  className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#17634f]"
                />
              </div>

              <div className="mt-7">
                <h2 className="mb-4 text-sm font-medium text-[#08243f]">
                  Verification
                </h2>

                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <label className="text-sm text-gray-700">
                    Government ID:
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setGovernmentId(event.target.files[0] || null)
                    }
                    className="text-sm"
                  />
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                    rounded-full
                    bg-[#08243f]
                    px-6 py-2
                    text-sm font-medium
                    text-white
                    hover:bg-[#17634f]
                  "
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </>
          )}

          {role === "agent" && (
            <div className="mt-7">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-[190px_1fr] md:items-center">
                  <label className="text-sm text-gray-700">
                    Company name (optional):
                  </label>

                  <input
                    type="text"
                    value={companyName}
                    onChange={(event) => setCompanyName(event.target.value)}
                    placeholder="Company name"
                    className="
                      w-full
                      rounded-md
                      border border-gray-300
                      px-3 py-2
                      text-sm
                      outline-none
                      focus:border-[#17634f]
                    "
                  />
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-[190px_1fr] md:items-center">
                  <label className="text-sm text-gray-700">
                    Where do you operate?
                  </label>

                  <input
                    type="text"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="e.g. Helsinki, Espoo"
                    className="
                      w-full
                      rounded-md
                      border border-gray-300
                      px-3 py-2
                      text-sm
                      outline-none
                      focus:border-[#17634f]
                    "
                  />
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-[190px_1fr] md:items-center">
                  <label className="text-sm text-gray-700">
                    Real estate licence number:
                  </label>

                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(event) => setLicenseNumber(event.target.value)}
                    placeholder="Enter licence number"
                    className="
                      w-full
                      rounded-md
                      border border-gray-300
                      px-3 py-2
                      text-sm
                      outline-none
                      focus:border-[#17634f]
                    "
                  />
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-[190px_1fr]">
                  <label className="text-sm text-gray-700">
                    Tell us about yourself:
                  </label>

                  <textarea
                    value={about}
                    onChange={(event) => setAbout(event.target.value)}
                    placeholder="Tell us about your experience..."
                    rows="4"
                    className="
                      w-full
                      resize-none
                      rounded-md
                      border border-gray-300
                      px-3 py-2
                      text-sm
                      outline-none
                      focus:border-[#17634f]
                    "
                  />
                </div>
              </div>

              <div className="mt-7">
                <h2 className="mb-4 text-sm font-medium text-[#08243f]">
                  Verification
                </h2>

                <div className="space-y-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center">
                    <label className="w-47.5 text-sm text-gray-700">
                      Government ID:
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        setGovernmentId(event.target.files[0] || null)
                      }
                      className="text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-2 md:flex-row md:items-center">
                    <label className="w-47.5 text-sm text-gray-700">
                      Real estate licence:
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        setRealEstateLicense(event.target.files[0] || null)
                      }
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="
                    rounded-full
                    bg-[#08243f]
                    px-6 py-2
                    text-sm font-medium
                    text-white
                    hover:bg-[#17634f]
                  "
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
