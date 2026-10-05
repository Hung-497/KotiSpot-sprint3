import PageLoader from "../components/PageLoader";
import useMinimumDuration, { PAGE_LOADING_MS } from "../hooks/useMinimumDuration";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import ApplicationCard from "../components/ApplicationCard";
import ConversationCard from "../components/ConversationCard";
import { apiRequest } from "../services/api";

const getInquiryPropertyLabel = (property) => {
  if (!property) {
    return "a deleted listing";
  }

  const isAvailable =
    property.status === "active" && property.moderation?.status === "approved";

  return isAvailable ? property.title : `${property.title} (unavailable)`;
};

function Notifications({ isAdmin }) {
  const hasMinimumLoadingElapsed = useMinimumDuration(PAGE_LOADING_MS);
  const [adminLoading, setAdminLoading] = useState(isAdmin);
  const [conversationsLoading, setConversationsLoading] = useState(true);

  // Only for admins
  const [applications, setApplications] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);

  // For everyone
  const [inquiries, setInquiries] = useState([]); // about my listings
  const [sentInquiries, setSentInquiries] = useState([]); // inquiries I sent that got an answer
  const [myMessages, setMyMessages] = useState([]); // my "Contact us" messages that got an answer

  // Admins: load the applications and contact messages (until the admin deletes them)
  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    const fetchAdminData = async () => {
      setAdminLoading(true);
      try {
        setApplications(await apiRequest("/verifications"));
        setContactMessages(await apiRequest("/contact-messages"));
      } catch (error) {
        console.error("Failed to load admin notifications:", error);
      } finally {
        setAdminLoading(false);
      }
    };

    fetchAdminData();
  }, [isAdmin]);

  // Everyone: load my conversations
  useEffect(() => {
    const fetchMyNotifications = async () => {
      try {
        setInquiries(await apiRequest("/inquiries/mine"));
        setSentInquiries(await apiRequest("/inquiries/sent"));
        setMyMessages(await apiRequest("/contact-messages/mine"));
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        setConversationsLoading(false);
      }
    };

    fetchMyNotifications();
  }, []);

  // Deletes a notification in the database, so it doesn't come back after a refresh.
  // path is for example "/inquiries/123"
  const deleteNotification = (path) => apiRequest(path, { method: "DELETE" });

  const deleteApplication = async (id) => {
    try {
      await deleteNotification(`/verifications/${id}`);
      setApplications(
        applications.filter((application) => application._id !== id),
      );
    } catch (error) {
      window.alert(error.message);
    }
  };

  const deleteContactMessage = async (id) => {
    try {
      await deleteNotification(`/contact-messages/${id}/admin`);
      setContactMessages(
        contactMessages.filter((message) => message._id !== id),
      );
    } catch (error) {
      window.alert(error.message);
    }
  };

  const deleteInquiry = async (id) => {
    try {
      await deleteNotification(`/inquiries/${id}`);
      setInquiries(inquiries.filter((inquiry) => inquiry._id !== id));
    } catch (error) {
      window.alert(error.message);
    }
  };

  const deleteSentInquiry = async (id) => {
    try {
      await deleteNotification(`/inquiries/${id}`);
      setSentInquiries(sentInquiries.filter((inquiry) => inquiry._id !== id));
    } catch (error) {
      window.alert(error.message);
    }
  };

  const deleteMyMessage = async (id) => {
    try {
      await deleteNotification(`/contact-messages/${id}`);
      setMyMessages(myMessages.filter((message) => message._id !== id));
    } catch (error) {
      window.alert(error.message);
    }
  };

  const hasNoNotifications =
    inquiries.length === 0 &&
    sentInquiries.length === 0 &&
    myMessages.length === 0 &&
    (!isAdmin || (applications.length === 0 && contactMessages.length === 0));

  if (conversationsLoading || (isAdmin && adminLoading) || !hasMinimumLoadingElapsed) {
    return <PageLoader label="Loading notifications…" fullPage />;
  }

  return (
    <div className="min-h-screen bg-canvas px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="ks-page-title">Notifications</h1>

          <p className="mt-2 text-ink-muted">Stay updated with your</p>
        </div>

        {/* ---------- Admin only ---------- */}
        {isAdmin && (
          <div className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-ink">
              Seller / agent applications
            </h2>

            {applications.length === 0 && (
              <p className="text-sm text-ink-muted">No applications.</p>
            )}

            <div className="space-y-4">
              {applications.map((application) => (
                <ApplicationCard
                  key={application._id}
                  application={application}
                  onDelete={() => deleteApplication(application._id)}
                />
              ))}
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-ink">
              Contact messages
            </h2>

            {contactMessages.length === 0 && (
              <p className="text-sm text-ink-muted">No messages.</p>
            )}

            <div className="space-y-4">
              {contactMessages.map((contactMessage) => (
                <ConversationCard
                  key={contactMessage._id}
                  title={contactMessage.subject}
                  from={`${contactMessage.fullName} (${contactMessage.email})`}
                  firstMessage={{
                    text: contactMessage.message,
                    sentAt: contactMessage.submittedAt,
                  }}
                  starter="user"
                  replies={contactMessage.replies}
                  me="admin"
                  otherName={contactMessage.fullName}
                  replyUrl={`/contact-messages/${contactMessage._id}/replies`}
                  canReply={Boolean(contactMessage.user)}
                  isRead={contactMessage.readByAdmin}
                  markReadUrl={`/contact-messages/${contactMessage._id}/admin/read`}
                  onDelete={() => deleteContactMessage(contactMessage._id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ---------- Everyone ---------- */}
        <div className="space-y-4">
          {/* Inquiries about my listings */}
          {inquiries.map((inquiry) => (
            <ConversationCard
              key={inquiry._id}
              title={`Inquiry about ${getInquiryPropertyLabel(inquiry.propertyId)}`}
              from={`${inquiry.name} (${inquiry.email})`}
              firstMessage={{
                text: inquiry.message,
                sentAt: inquiry.submittedAt,
              }}
              starter="sender"
              replies={inquiry.replies}
              me="owner"
              otherName={inquiry.name}
              replyUrl={`/inquiries/${inquiry._id}/replies`}
              canReply={Boolean(inquiry.sender)}
              isRead={inquiry.readByOwner}
              markReadUrl={`/inquiries/${inquiry._id}/read`}
              onDelete={() => deleteInquiry(inquiry._id)}
            />
          ))}

          {/* Inquiries I sent about other people's listings */}
          {sentInquiries.map((inquiry) => (
            <ConversationCard
              key={inquiry._id}
              title={`Your inquiry about ${getInquiryPropertyLabel(inquiry.propertyId)}`}
              firstMessage={{
                text: inquiry.message,
                sentAt: inquiry.submittedAt,
              }}
              starter="sender"
              replies={inquiry.replies}
              me="sender"
              otherName="Listing owner"
              replyUrl={`/inquiries/${inquiry._id}/replies`}
              canReply={true}
              isRead={inquiry.readBySender}
              markReadUrl={`/inquiries/${inquiry._id}/read`}
              onDelete={() => deleteSentInquiry(inquiry._id)}
            />
          ))}

          {/* My "Contact us" messages */}
          {myMessages.map((message) => (
            <ConversationCard
              key={message._id}
              title={`Your message: ${message.subject}`}
              firstMessage={{
                text: message.message,
                sentAt: message.submittedAt,
              }}
              starter="user"
              replies={message.replies}
              me="user"
              otherName="KotiSpot"
              replyUrl={`/contact-messages/${message._id}/replies`}
              canReply={true}
              isRead={message.readByUser}
              markReadUrl={`/contact-messages/${message._id}/read`}
              onDelete={() => deleteMyMessage(message._id)}
            />
          ))}

          {hasNoNotifications && (
            <div className="rounded-card border border-line bg-surface px-6 py-16 text-center shadow-card">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pine-50 text-pine-700">
                <Bell size={26} />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-ink">
                No notifications left
              </h2>

              <p className="mt-1 text-sm text-ink-muted">You're now caught up</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;