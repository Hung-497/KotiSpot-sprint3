import { useState } from "react";
import { Trash2, UserCheck } from "lucide-react";
import { apiRequest } from "../services/api";

// Shows one seller/agent application to the admin,
// with buttons to approve or reject it.
// It stays in the list after review until the admin deletes it.
const ApplicationCard = ({ application, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [reason, setReason] = useState("");
  const [bigPicture, setBigPicture] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(application.status); // pending / approved / rejected
  // Why it was approved / rejected (older ones may only have rejectionReason)
  const [reviewReason, setReviewReason] = useState(
    application.reviewReason || application.rejectionReason || "",
  );
  const [read, setRead] = useState(application.readByAdmin);

  const isAgent = application.role === "agent";

  const reviewApplication = async (newStatus) => {
    if (reason.trim() === "") {
      setError("Please write a reason before approving or rejecting.");
      return;
    }

    try {
      const data = await apiRequest(`/verifications/${application._id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus, reviewReason: reason }),
      });

      setStatus(newStatus);
      setReviewReason(data.reviewReason);
      setRead(true); // reviewing it means the admin has read it
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  // Saved in the database, so it stays read after a refresh
  const markAsRead = async () => {
    try {
      await apiRequest(`/verifications/${application._id}/read`, {
        method: "PATCH",
      });

      setRead(true);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-2xl border bg-white p-5 shadow-sm ${
        read ? "border-gray-200" : "border-[#17634f] ring-1 ring-[#17634f]"
      }`}
    >
      <div className="flex flex-1 gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eef6f2] text-[#17634f]">
          <UserCheck size={22} />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-[#08243f]">
              {application.fullName} wants to become{" "}
              {isAgent ? "a real estate agent" : "a seller"}
            </h3>

            {!read && (
              <>
                <span className="rounded-full bg-[#17634f] px-2 py-0.5 text-xs font-medium text-white">
                  New
                </span>

                <button
                  type="button"
                  onClick={markAsRead}
                  className="text-sm font-medium text-[#17634f] hover:underline"
                >
                  Mark as read
                </button>
              </>
            )}
          </div>

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
            <div className="mt-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
              <p className="font-medium">Approved</p>
              {reviewReason && <p>Reason: {reviewReason}</p>}
            </div>
          )}

          {status === "rejected" && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
              <p className="font-medium">Rejected</p>
              {reviewReason && <p>Reason: {reviewReason}</p>}
            </div>
          )}

          {/* Not reviewed yet: show the reason box and the buttons */}
          {status === "pending" && (
            <>
              <input
                type="text"
                placeholder="Reason for approving or rejecting (required)"
                maxLength={500}
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

      {/* Pending applications can't be deleted: the user can't apply again
          until theirs is reviewed */}
      {status !== "pending" && (
        <button
          onClick={onDelete}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 size={19} />
        </button>
      )}
    </div>
  );
};

export default ApplicationCard;
