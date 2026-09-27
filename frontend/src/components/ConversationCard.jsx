import { useState } from "react";
import { Mail, Trash2 } from "lucide-react";
import { apiRequest } from "../services/api";

// One notification that holds a whole conversation between two people.
// Both people can reply as many times as they want.
//
// Props:
//   title       - heading of the notification
//   from        - who started it (optional, e.g. "Anna (anna@mail.com)")
//   firstMessage - { text, sentAt } the message that started it
//   starter     - who wrote the first message, e.g. "sender" or "user"
//   replies     - [{ from, text, sentAt }] the replies after that
//   me          - who I am in this conversation, e.g. "owner" or "admin"
//   otherName   - the name to show for the other person
//   replyUrl    - API path to POST a new reply to, e.g. "/inquiries/123/replies"
//   canReply    - false for guests, who can't see replies
//   isRead      - false when there is something new I haven't marked as read
//   markReadUrl - API path to PATCH to mark it as read, e.g. "/inquiries/123/read"
//   onDelete    - called when the trash button is clicked
const ConversationCard = ({
  title,
  from,
  firstMessage,
  starter,
  replies,
  me,
  otherName,
  replyUrl,
  canReply,
  isRead,
  markReadUrl,
  onDelete,
}) => {
  const [allReplies, setAllReplies] = useState(replies);
  const [read, setRead] = useState(isRead);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  // The first message + all replies, in order
  const messages = [
    { _id: "first", from: starter, text: firstMessage.text, sentAt: firstMessage.sentAt },
    ...allReplies,
  ];

  const sendReply = async () => {
    if (text.trim() === "") {
      setError("Please write a reply first.");
      return;
    }

    try {
      // The backend sends back the whole conversation
      const updated = await apiRequest(replyUrl, {
        method: "POST",
        body: JSON.stringify({ text }),
      });

      setAllReplies(updated.replies);
      setRead(true); // writing a reply means I've read it
      setText("");
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  // Saved in the database, so it stays read after a refresh
  const markAsRead = async () => {
    try {
      await apiRequest(markReadUrl, { method: "PATCH" });

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
          <Mail size={22} />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-[#08243f]">{title}</h2>

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

          {from && <p className="mt-1 text-sm text-gray-500">From {from}</p>}

          {/* The conversation */}
          <div className="mt-3 space-y-2">
            {messages.map((message) => (
              <div
                key={message._id}
                className={
                  message.from === me
                    ? "rounded-lg bg-[#eef6f2] px-4 py-2 text-sm text-[#17634f]"
                    : "rounded-lg bg-gray-50 px-4 py-2 text-sm text-gray-700"
                }
              >
                <p className="text-xs font-semibold">
                  {message.from === me ? "You" : otherName}
                </p>
                <p>{message.text}</p>
                <p className="mt-1 text-[11px] text-gray-400">
                  {new Date(message.sentAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {/* The reply box is always there (except for guests) */}
          {canReply ? (
            <>
              <textarea
                rows="2"
                placeholder="Write a reply..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="mt-3 w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#17634f]"
              />

              <button
                type="button"
                onClick={sendReply}
                className="mt-2 rounded-lg bg-[#17634f] px-4 py-2 text-sm font-medium text-white hover:bg-[#124d3d]"
              >
                Send reply
              </button>
            </>
          ) : (
            <p className="mt-3 text-xs text-amber-700">
              Sent by a guest (not logged in), so they can't see replies here.
              Answer them by email instead.
            </p>
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

export default ConversationCard;
