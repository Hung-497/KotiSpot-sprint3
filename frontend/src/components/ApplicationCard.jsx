import { useState } from "react";
import { Trash2, UserCheck } from "lucide-react";

// Shows one seller/agent application to the admin,
// with buttons to approve or reject it.
// It stays in the list after review until the admin deletes it.
const ApplicationCard = ({ application, token, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [reason, setReason] = useState("");
  const [bigPicture, setBigPicture] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(application.status); // pending / approved / rejected

  const isAgent = application.role === "agent";

  const reviewApplication = async (newStatus) => {
    if (newStatus === "rejected" && reason.trim() === "") {
      setError("Please write a reason before rejecting.");
      return;
    }

    try {
      const response = await fetch(`/api/verifications/${application._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus, rejectionReason: reason }),
      });

      if (!response.ok) {
        throw new Error("Failed to review the application");
      }

      setStatus(newStatus);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-1 gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eef6f2] text-[#17634f]">
          <UserCheck size={22} />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-[#08243f]">
            {application.fullName} wants to become{" "}
            {isAgent ? "a real estate agent" : "a seller"}
          </h3>

          <p className="mt-1 text-sm text-gray-600">{application.email}</p>

          <p className="mt-2 text-xs text-gray-400">
            {new Date(application.createdAt).toLocaleString()}
          </p>

          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="mt-3 text-sm font-medium text-[#17634f] hover:underline"
          >
            {showDetails ? "Hide application" : "View application"}
          </button>

          {/* The full application: the same fields as the form they filled in */}
          {showDetails && (
            <div className="mt-4 space-y-2 rounded-xl bg-[#f8faf9] p-4 text-sm text-gray-700">
              <p>
                <strong>Applying for:</strong>{" "}
                {isAgent ? "Real estate agent" : "Seller"}
              </p>
              <p>
                <strong>Full name:</strong> {application.fullName}
              </p>
              <p>
                <strong>Email:</strong> {application.email}
              </p>
              <p>
                <strong>Phone number:</strong> {application.phone}
              </p>

              {isAgent && (
                <>
                  <p>
                    <strong>Company name:</strong>{" "}
                    {application.companyName || "-"}
                  </p>
                  <p>
                    <strong>Where they operate:</strong> {application.areas}
                  </p>
                  <p>
                    <strong>Real estate licence number:</strong>{" "}
                    {application.licenseNumber}
                  </p>
                </>
              )}

              <div className="flex flex-wrap gap-4 pt-2">
                <div>
                  <p className="mb-1 font-medium text-[#08243f]">
                    Government ID
                  </p>
                  <img
                    src={application.idDocument}
                    alt="Government ID"
                    onClick={() => setBigPicture(application.idDocument)}
                    className="h-40 w-60 cursor-zoom-in rounded-lg border border-gray-200 bg-white object-cover"
                  />
                </div>

                {isAgent && (
                  <div>
                    <p className="mb-1 font-medium text-[#08243f]">
                      Real estate licence
                    </p>
                    <img
                      src={application.licenseDocument}
                      alt="Real estate licence"
                      onClick={() => setBigPicture(application.licenseDocument)}
                      className="h-40 w-60 cursor-zoom-in rounded-lg border border-gray-200 bg-white object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* A picture opened in full screen. Click anywhere to close it. */}
          {bigPicture && (
            <div
              onClick={() => setBigPicture(null)}
              className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-6"
            >
              <img
                src={bigPicture}
                alt="Application document"
                className="max-h-full max-w-full rounded-lg bg-white object-contain"
              />
              <button
                type="button"
                className="absolute right-6 top-6 rounded-full bg-white px-3 py-1 text-sm font-medium text-[#08243f]"
              >
                Close
              </button>
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {/* Already reviewed: show the result */}
          {status === "approved" && (
            <p className="mt-4 rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
              Approved
            </p>
          )}

          {status === "rejected" && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
              Rejected
            </p>
          )}

          {/* Not reviewed yet: show the reason box and the buttons */}
          {status === "pending" && (
            <>
              <input
                type="text"
                placeholder="Reason (required if rejecting)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#17634f]"
              />

              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => reviewApplication("approved")}
                  className="rounded-lg bg-[#17634f] px-4 py-2 text-sm font-medium text-white hover:bg-[#124d3d]"
                >
                  Approve
                </button>

                <button
                  type="button"
                  onClick={() => reviewApplication("rejected")}
                  className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Reject
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <button
        onClick={onDelete}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500"
      >
        <Trash2 size={19} />
      </button>
    </div>
  );
};

export default ApplicationCard;
