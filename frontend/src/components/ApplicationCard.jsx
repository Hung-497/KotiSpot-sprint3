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
      className={`flex items-start justify-between gap-4 rounded-2xl border bg-white p-5 shadow-sm dark:bg-[#0b2233]/75 dark:backdrop-blur-xl dark:shadow-[0_18px_45px_rgba(0,0,0,0.24)] ${ 
        read 
          ? "border-gray-200 dark:border-[#315064]" 
          : "border-[#17634f] ring-1 ring-[#17634f] dark:border-[#55d4aa] dark:ring-[#55d4aa]/50" 
      }`} 
    > 
      <div className="flex flex-1 gap-4"> 
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eef6f2] text-[#17634f] dark:bg-[#123b38] dark:text-[#55d4aa] dark:shadow-[0_0_20px_rgba(85,212,170,0.12)]"> 
          <UserCheck size={22} /> 
        </div> 
 
        <div className="flex-1"> 
          <div className="flex flex-wrap items-center gap-2"> 
            <h3 className="font-semibold text-[#08243f] dark:text-white"> 
              {application.fullName} wants to become{" "} 
              {isAgent ? "a real estate agent" : "a seller"} 
            </h3> 
 
            {!read && ( 
              <> 
                <span className="rounded-full bg-[#17634f] px-2 py-0.5 text-xs font-medium text-white dark:bg-[#20c997] dark:text-[#06241d]"> 
                  New 
                </span> 
 
                <button 
                  type="button" 
                  onClick={markAsRead} 
                  className="text-sm font-medium text-[#17634f] hover:underline dark:text-[#55d4aa]" 
                > 
                  Mark as read 
                </button> 
              </> 
            )} 
          </div> 
 
          <p className="mt-1 text-sm text-gray-600 dark:text-[#a7b4be]">
            {application.email}
          </p> 
 
          <p className="mt-2 text-xs text-gray-400 dark:text-[#7f929f]"> 
            {new Date(application.createdAt).toLocaleString()} 
          </p> 
 
          <button 
            type="button" 
            onClick={() => setShowDetails(!showDetails)} 
            className="mt-3 text-sm font-medium text-[#17634f] hover:underline dark:text-[#55d4aa]" 
          > 
            {showDetails ? "Hide application" : "View application"} 
          </button> 
 
          {/* The full application: the same fields as the form they filled in */} 
          {showDetails && ( 
            <div className="mt-4 space-y-2 rounded-xl bg-[#f8faf9] p-4 text-sm text-gray-700 dark:border dark:border-[#315064] dark:bg-[#081a26] dark:text-[#d7e1e7]"> 
              <p> 
                <strong className="dark:text-white">Applying for:</strong>{" "} 
                {isAgent ? "Real estate agent" : "Seller"} 
              </p> 
              <p> 
                <strong className="dark:text-white">Full name:</strong> {application.fullName} 
              </p> 
              <p> 
                <strong className="dark:text-white">Email:</strong> {application.email} 
              </p> 
              <p> 
                <strong className="dark:text-white">Phone number:</strong> {application.phone} 
              </p> 
 
              {isAgent && ( 
                <> 
                  <p> 
                    <strong className="dark:text-white">Company name:</strong>{" "} 
                    {application.companyName || "-"} 
                  </p> 
                  <p> 
                    <strong className="dark:text-white">Where they operate:</strong> {application.areas} 
                  </p> 
                  <p> 
                    <strong className="dark:text-white">Real estate licence number:</strong>{" "} 
                    {application.licenseNumber} 
                  </p> 
                </> 
              )} 
 
              <div className="flex flex-wrap gap-4 pt-2"> 
                <div> 
                  <p className="mb-1 font-medium text-[#08243f] dark:text-white"> 
                    Government ID 
                  </p> 
                  <img 
                    src={application.idDocument} 
                    alt="Government ID" 
                    onClick={() => setBigPicture(application.idDocument)} 
                    className="h-40 w-60 cursor-zoom-in rounded-lg border border-gray-200 bg-white object-cover dark:border-[#315064] dark:bg-[#061722]" 
                  /> 
                </div> 
 
                {isAgent && ( 
                  <div> 
                    <p className="mb-1 font-medium text-[#08243f] dark:text-white"> 
                      Real estate licence 
                    </p> 
                    <img 
                      src={application.licenseDocument} 
                      alt="Real estate licence" 
                      onClick={() => setBigPicture(application.licenseDocument)} 
                      className="h-40 w-60 cursor-zoom-in rounded-lg border border-gray-200 bg-white object-cover dark:border-[#315064] dark:bg-[#061722]" 
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
              className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-6 dark:bg-black/80 dark:backdrop-blur-sm" 
            > 
              <img 
                src={bigPicture} 
                alt="Application document" 
                className="max-h-full max-w-full rounded-lg bg-white object-contain dark:border dark:border-[#315064] dark:bg-[#081a26]" 
              /> 
              <button 
                type="button" 
                className="absolute right-6 top-6 rounded-full bg-white px-3 py-1 text-sm font-medium text-[#08243f] dark:bg-[#123b38] dark:text-[#55d4aa]" 
              > 
                Close 
              </button> 
            </div> 
          )} 
 
          {error && ( 
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/60 dark:text-red-300"> 
              {error} 
            </p> 
          )} 
 
          {/* Already reviewed: show the result */} 
          {status === "approved" && ( 
            <div className="mt-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700 dark:border dark:border-[#2c806c]/50 dark:bg-[#0d403d]/45 dark:text-[#7cf0ca]"> 
              <p className="font-medium">Approved</p> 
              {reviewReason && <p>Reason: {reviewReason}</p>} 
            </div> 
          )} 
 
          {status === "rejected" && ( 
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:border dark:border-red-500/30 dark:bg-red-950/45 dark:text-red-300"> 
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
                className="mt-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#17634f] dark:border-[#315064] dark:bg-[#081a26] dark:text-white dark:placeholder:text-[#7f929f] dark:focus:border-[#55d4aa]" 
              /> 
 
              <div className="mt-3 flex gap-3"> 
                <button 
                  type="button" 
                  onClick={() => reviewApplication("approved")} 
                  className="rounded-lg bg-[#17634f] px-4 py-2 text-sm font-medium text-white hover:bg-[#124d3d] dark:bg-[#20c997] dark:text-[#06241d] dark:shadow-[0_0_18px_rgba(32,201,151,0.15)] dark:hover:bg-[#2bd8a6]" 
                > 
                  Approve 
                </button> 
 
                <button 
                  type="button" 
                  onClick={() => reviewApplication("rejected")} 
                  className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-500/70 dark:text-red-400 dark:hover:bg-red-950/40" 
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
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:text-[#7f929f] dark:hover:bg-red-950/40 dark:hover:text-red-400" 
        > 
          <Trash2 size={19} /> 
        </button> 
      )} 
    </div> 
  ); 
}; 
 
export default ApplicationCard;