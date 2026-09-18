import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Contact = () => {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [formError, setFormError] = useState("")
    const navigate = useNavigate();

    const handleSubmit = (event) => {
      event.preventDefault();
      const fields = [[fullName, "full name"], [email, "email"], [subject, "subject"], [message, "message"]];
      const missingField = fields.find(([value]) => !value.trim());

      if (missingField) {
        setFormError(`Please fill in the ${missingField[1]} field.`);
        return;
      }

      setFormError("");
      navigate("/contactthankmessage");
    };

    return (
    <div className="min-h-screen bg-[#f8faf9] px-6 py-10">
      <div className="mx-auto max-w-5xl">

        <h1 className="text-3xl font-bold text-[#08243f]">
          Contact Us
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          We're here to help. Send us a message and we'll get back to you.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 rounded-xl border border-gray-200 bg-white p-6">

          <h2 className="mb-6 text-lg font-semibold text-[#08243f]">
            Send us a message
          </h2>

          {formError && <p role="alert" className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>}

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-[#08243f]">
              Full name *
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. John Doe"
              className="
                w-full
                rounded-lg
                border border-gray-300
                px-4 py-3
                text-sm
                outline-none
                focus:border-[#17634f]
              "
            />
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-[#08243f]">
              Email *
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john.doe@example.com"
              className="
                w-full
                rounded-lg
                border border-gray-300
                px-4 py-3
                text-sm
                outline-none
                focus:border-[#17634f]
              "
            />
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-[#08243f]">
              Subject *
            </label>

            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="
                w-full
                rounded-lg
                border border-gray-300
                bg-white
                px-4 py-3
                text-sm
                text-gray-600
                outline-none
                focus:border-[#17634f]
              "
            >
              <option value="">Select a subject</option>
              <option>Buy a property</option>
              <option>Rent a property</option>
              <option>Sell a property</option>
              <option>Property viewing</option>
              <option>Pricing/Property valuation</option>
              <option>Payment/Transaction support</option>
              <option>Report a property or a listing</option>
              <option>Agent/Seller inquiry</option>
              <option>Other/General inquiry</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-[#08243f]">
              Message *
            </label>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows="5"
              className="
                w-full
                resize-none
                rounded-lg
                border border-gray-300
                px-4 py-3
                text-sm
                outline-none
                focus:border-[#17634f]
              "
            />
          </div>

          <button
            type="submit"
            className="
              inline-block
              rounded-lg
              bg-[#17634f]
              px-6 py-3
              text-sm font-medium
              text-white
              transition
              hover:bg-[#124f40]
            "
          >
            Send message
          </button>

        </form>

        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6">

          <h2 className="mb-5 text-lg font-semibold text-[#08243f]">
            Other ways to reach us
          </h2>

          <div className="flex items-center justify-between border-b border-gray-100 py-4">
            <span className="text-sm text-gray-600">
              Email
            </span>

            <span className="text-sm text-[#17634f]">
              support@example.com
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 py-4">
            <span className="text-sm text-gray-600">
              Phone
            </span>

            <span className="text-sm text-[#17634f]">
              +358 10 123 4567
            </span>
          </div>

          <div className="flex items-center justify-between pt-4">
            <span className="text-sm text-gray-600">
              Support hours
            </span>

            <span className="text-sm text-[#08243f]">
              Mon-Fri, 09:00-17:00
            </span>
          </div>

        </div>

        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6">

          <h2 className="text-lg font-semibold text-[#08243f]">
            FAQ
          </h2>

          <div className="mt-4 flex items-center justify-between">

            <p className="text-sm text-gray-500">
              Visit our Help Center for answers to common questions.
            </p>

            <button
              className="
                rounded-lg
                border border-gray-300
                px-5 py-2.5
                text-sm
                text-[#08243f]
                transition
                hover:bg-gray-50
              "
            >
              Go to Help Center
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;