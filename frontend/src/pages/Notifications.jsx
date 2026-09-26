import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import ApplicationCard from "../components/ApplicationCard";
import ConversationCard from "../components/ConversationCard";

function Notifications({ isAdmin, token }) {
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
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const applicationsResponse = await fetch("/api/verifications", {
          headers,
        });
        if (!applicationsResponse.ok) {
          throw new Error("Failed to load applications");
        }
        const applicationsData = await applicationsResponse.json();
        setApplications(applicationsData);

        const messagesResponse = await fetch("/api/contact-messages", {
          headers,
        });
        if (!messagesResponse.ok) {
          throw new Error("Failed to load contact messages");
        }
        const messagesData = await messagesResponse.json();
        setContactMessages(messagesData);
      } catch (error) {
        console.error("Failed to load admin notifications:", error);
      }
    };

    fetchAdminData();
  }, [isAdmin, token]);

  // Everyone: load my conversations
  useEffect(() => {
    const fetchMyNotifications = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const inquiriesResponse = await fetch("/api/inquiries/mine", {
          headers,
        });
        if (!inquiriesResponse.ok) {
          throw new Error("Failed to load inquiries");
        }
        const inquiriesData = await inquiriesResponse.json();
        setInquiries(inquiriesData);

        const sentResponse = await fetch("/api/inquiries/sent", { headers });
        if (!sentResponse.ok) {
          throw new Error("Failed to load your inquiries");
        }
        const sentData = await sentResponse.json();
        setSentInquiries(sentData);

        const myMessagesResponse = await fetch("/api/contact-messages/mine", {
          headers,
        });
        if (!myMessagesResponse.ok) {
          throw new Error("Failed to load your messages");
        }
        const myMessagesData = await myMessagesResponse.json();
        setMyMessages(myMessagesData);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    };

    fetchMyNotifications();
  }, [token]);

  // Deletes a notification in the database, so it doesn't come back after a refresh.
  // url is for example "/api/inquiries/123"
  const deleteNotification = async (url) => {
    const response = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to delete the notification");
    }
  };

  const deleteApplication = async (id) => {
    try {
      await deleteNotification(`/api/verifications/${id}`);
      setApplications(applications.filter((application) => application._id !== id));
    } catch (error) {
      window.alert(error.message);
    }
  };

  const deleteContactMessage = async (id) => {
    try {
      await deleteNotification(`/api/contact-messages/${id}/admin`);
      setContactMessages(contactMessages.filter((message) => message._id !== id));
    } catch (error) {
      window.alert(error.message);
    }
  };

  const deleteInquiry = async (id) => {
    try {
      await deleteNotification(`/api/inquiries/${id}`);
      setInquiries(inquiries.filter((inquiry) => inquiry._id !== id));
    } catch (error) {
      window.alert(error.message);
    }
  };

  const deleteSentInquiry = async (id) => {
    try {
      await deleteNotification(`/api/inquiries/${id}`);
      setSentInquiries(sentInquiries.filter((inquiry) => inquiry._id !== id));
    } catch (error) {
      window.alert(error.message);
    }
  };

  const deleteMyMessage = async (id) => {
    try {
      await deleteNotification(`/api/contact-messages/${id}`);
      setMyMessages(myMessages.filter((message) => message._id !== id));
    } catch (error) {
      window.alert(error.message);
    }
  };

  const hasNoNotifications =
    inquiries.length === 0 &&
    sentInquiries.length === 0 &&
    myMessages.length === 0;

  return (
    <div className="min-h-screen bg-[#f8faf9] px-6 py-10">
      <div className="mx-auto max-w-4xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#08243f]">
            Notifications
          </h1>

          <p className="mt-2 text-gray-500">
            Stay updated with your
          </p>
        </div>

        {/* ---------- Admin only ---------- */}
        {isAdmin && (
          <div className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-[#08243f]">
              Seller / agent applications
            </h2>

            {applications.length === 0 && (
              <p className="text-sm text-gray-500">No applications.</p>
            )}

            <div className="space-y-4">
              {applications.map((application) => (
                <ApplicationCard
                  key={application._id}
                  application={application}
                  token={token}
                  onDelete={() => deleteApplication(application._id)}
                />
              ))}
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-[#08243f]">
              Contact messages
            </h2>

            {contactMessages.length === 0 && (
              <p className="text-sm text-gray-500">No messages.</p>
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
                  replyUrl={`/api/contact-messages/${contactMessage._id}/replies`}
                  canReply={Boolean(contactMessage.user)}
                  token={token}
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
              title={`Inquiry about ${inquiry.propertyId?.title || "a deleted listing"}`}
              from={`${inquiry.name} (${inquiry.email})`}
              firstMessage={{ text: inquiry.message, sentAt: inquiry.submittedAt }}
              starter="sender"
              replies={inquiry.replies}
              me="owner"
              otherName={inquiry.name}
              replyUrl={`/api/inquiries/${inquiry._id}/replies`}
              canReply={Boolean(inquiry.sender)}
              token={token}
              onDelete={() => deleteInquiry(inquiry._id)}
            />
          ))}

          {/* Inquiries I sent about other people's listings */}
          {sentInquiries.map((inquiry) => (
            <ConversationCard
              key={inquiry._id}
              title={`Your inquiry about ${inquiry.propertyId?.title || "a deleted listing"}`}
              firstMessage={{ text: inquiry.message, sentAt: inquiry.submittedAt }}
              starter="sender"
              replies={inquiry.replies}
              me="sender"
              otherName="Listing owner"
              replyUrl={`/api/inquiries/${inquiry._id}/replies`}
              canReply={true}
              token={token}
              onDelete={() => deleteSentInquiry(inquiry._id)}
            />
          ))}

          {/* My "Contact us" messages */}
          {myMessages.map((message) => (
            <ConversationCard
              key={message._id}
              title={`Your message: ${message.subject}`}
              firstMessage={{ text: message.message, sentAt: message.submittedAt }}
              starter="user"
              replies={message.replies}
              me="user"
              otherName="KotiSpot"
              replyUrl={`/api/contact-messages/${message._id}/replies`}
              canReply={true}
              token={token}
              onDelete={() => deleteMyMessage(message._id)}
            />
          ))}

          {hasNoNotifications && (
            <div
              className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
              <div
                className=" mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef6f2] text-[#17634f]">
                <Bell size={26} />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-[#08243f]">
                No notifications left
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                You're now caught up
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
