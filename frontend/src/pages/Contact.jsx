import { useNavigate } from "react-router-dom"; 
import { useState } from "react"; 
import { apiRequest } from "../services/api"; 
 
const Contact = () => { 
  const [fullName, setFullName] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [subject, setSubject] = useState(""); 
  const [message, setMessage] = useState(""); 
  const [formError, setFormError] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const navigate = useNavigate(); 
 
  const handleFullName = (event) => { 
    setFullName(event.target.value); 
  }; 
 
  const handleEmail = (event) => { 
    setEmail(event.target.value); 
  }; 
 
  const handleSubject = (event) => { 
    setSubject(event.target.value); 
  }; 
 
  const handleMessage = (event) => { 
    setMessage(event.target.value); 
  }; 
 
  const handleSubmit = async (event) => { 
    event.preventDefault(); 
    const fields = [ 
      [fullName, "full name"], 
      [email, "email"], 
      [subject, "subject"], 
      [message, "message"], 
    ]; 
    const missingField = fields.find(([value]) => !value.trim()); 
 
    if (missingField) { 
      setFormError(`Please fill in the ${missingField[1]} field.`); 
      return; 
    } 
 
    if (!email.includes("@")) { 
      setFormError("Please enter a valid email address."); 
      return; 
    } 
 
    setFormError(""); 
    setIsSubmitting(true); 
 
    try { 
      await apiRequest("/contact-messages", { 
        method: "POST", 
        body: JSON.stringify({ 
          fullName, 
          email, 
          subject, 
          message, 
        }), 
      }); 
 
      navigate("/contactthankmessage"); 
    } catch (error) { 
      console.error("Error sending contact message:", error); 
      setFormError(error.message); 
    } finally { 
      setIsSubmitting(false); 
    } 
  }; 
 
  return ( 
    <div className="min-h-screen bg-[#f8faf9] px-6 py-10 dark:bg-[radial-gradient(circle_at_top_left,#123343_0%,#081a26_28%,#06141e_65%,#04111a_100%)]"> 
      <div className="mx-auto max-w-5xl"> 
        <h1 className="text-3xl font-bold text-[#08243f] dark:text-white">Contact Us</h1> 
 
        <p className="mt-2 text-sm text-gray-500 dark:text-[#a7b4be]"> 
          We're here to help. Send us a message and we'll get back to you. 
        </p> 
 
        <form 
          onSubmit={handleSubmit} 
          className="mt-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-[#234354] dark:bg-[#0b2233]/75 dark:backdrop-blur-xl dark:shadow-[0_18px_45px_rgba(0,0,0,0.28)]" 
        > 
          <h2 className="mb-6 text-lg font-semibold text-[#08243f] dark:text-white"> 
            Send us a message 
          </h2> 
 
          {formError && ( 
            <p 
              role="alert" 
              className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/60 dark:text-red-300" 
            > 
              {formError} 
            </p> 
          )} 
 
          <div className="mb-5"> 
            <label className="mb-2 block text-sm font-medium text-[#08243f] dark:text-white"> 
              Full name * 
            </label> 
 
            <input 
              type="text" 
              value={fullName} 
              onChange={handleFullName} 
              placeholder="e.g. John Doe" 
              className=" 
                w-full 
                rounded-lg 
                border border-gray-300 
                px-4 py-3 
                text-sm 
                outline-none 
                focus:border-[#17634f] 
                dark:border-[#294457]
                dark:bg-[#081a26]
                dark:text-white
                dark:placeholder:text-[#7f929f]
                dark:focus:border-[#55d4aa]
              " 
            /> 
          </div> 
 
          <div className="mb-5"> 
            <label className="mb-2 block text-sm font-medium text-[#08243f] dark:text-white"> 
              Email * 
            </label> 
 
            <input 
              type="email" 
              value={email} 
              onChange={handleEmail} 
              placeholder="e.g. john.doe@example.com" 
              className=" 
                w-full 
                rounded-lg 
                border border-gray-300 
                px-4 py-3 
                text-sm 
                outline-none 
                focus:border-[#17634f] 
                dark:border-[#294457]
                dark:bg-[#081a26]
                dark:text-white
                dark:placeholder:text-[#7f929f]
                dark:focus:border-[#55d4aa]
              " 
            /> 
          </div> 
 
          <div className="mb-5"> 
            <label className="mb-2 block text-sm font-medium text-[#08243f] dark:text-white"> 
              Subject * 
            </label> 
 
            <select 
              value={subject} 
              onChange={handleSubject} 
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
                dark:border-[#294457]
                dark:bg-[#081a26]
                dark:text-white
                dark:focus:border-[#55d4aa]
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
            <label className="mb-2 block text-sm font-medium text-[#08243f] dark:text-white"> 
              Message * 
            </label> 
 
            <textarea 
              value={message} 
              onChange={handleMessage} 
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
                dark:border-[#294457]
                dark:bg-[#081a26]
                dark:text-white
                dark:placeholder:text-[#7f929f]
                dark:focus:border-[#55d4aa]
              " 
            /> 
          </div> 
 
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className=" 
              inline-block 
              rounded-lg 
              bg-[#17634f] 
              px-6 py-3 
              text-sm font-medium 
              text-white 
              transition 
              hover:bg-[#124f40] 
              disabled:cursor-not-allowed 
              disabled:opacity-60 
              dark:bg-[#20c997]
              dark:text-[#06241d]
              dark:shadow-[0_0_22px_rgba(32,201,151,0.18)]
              dark:hover:bg-[#2bd8a6]
            " 
          > 
            {isSubmitting ? "Sending..." : "Send message"} 
          </button> 
        </form> 
 
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6 dark:border-[#234354] dark:bg-[#0b2233]/70 dark:backdrop-blur-xl dark:shadow-[0_14px_35px_rgba(0,0,0,0.22)]"> 
          <h2 className="mb-5 text-lg font-semibold text-[#08243f] dark:text-white"> 
            Other ways to reach us 
          </h2> 
 
          <div className="flex items-center justify-between border-b border-gray-100 py-4 dark:border-white/10"> 
            <span className="text-sm text-gray-600 dark:text-[#a7b4be]">Email</span> 
 
            <span className="text-sm text-[#17634f] dark:text-[#55d4aa]">support@example.com</span> 
          </div> 
 
          <div className="flex items-center justify-between border-b border-gray-100 py-4 dark:border-white/10"> 
            <span className="text-sm text-gray-600 dark:text-[#a7b4be]">Phone</span> 
 
            <span className="text-sm text-[#17634f] dark:text-[#55d4aa]">+358 10 123 4567</span> 
          </div> 
 
          <div className="flex items-center justify-between pt-4"> 
            <span className="text-sm text-gray-600 dark:text-[#a7b4be]">Support hours</span> 
 
            <span className="text-sm text-[#08243f] dark:text-white">Mon-Fri, 09:00-17:00</span> 
          </div> 
        </div> 
 
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6 dark:border-[#234354] dark:bg-[#0b2233]/70 dark:backdrop-blur-xl dark:shadow-[0_14px_35px_rgba(0,0,0,0.22)]"> 
          <h2 className="text-lg font-semibold text-[#08243f] dark:text-white">FAQ</h2> 
 
          <div className="mt-4 flex items-center justify-between"> 
            <p className="text-sm text-gray-500 dark:text-[#a7b4be]"> 
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
                dark:border-[#315064]
                dark:text-white
                dark:hover:border-[#55d4aa]
                dark:hover:bg-[#102b3b]
                dark:hover:text-[#55d4aa]
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