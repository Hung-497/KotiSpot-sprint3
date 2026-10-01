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
 
  if (loading) { 
    return ( 
      <p className="px-6 py-10 text-center text-sm text-gray-500 dark:bg-[#06141e] dark:text-[#a7b4be]"> 
        Loading profile... 
      </p> 
    ); 
  } 
 
  return ( 
    <div className="min-h-screen bg-[#f8faf9] px-6 py-10 dark:bg-[radial-gradient(circle_at_top_left,#123343_0%,#081a26_28%,#06141e_65%,#04111a_100%)]"> 
      <div className="mx-auto max-w-3xl"> 
        <div className="rounded-2xl border border-gray-300 bg-white p-6 dark:border-[#2c806c]/60 dark:bg-[#0b2233]/70 dark:backdrop-blur-xl dark:shadow-[0_18px_45px_rgba(0,0,0,0.30)]"> 
          <div className="flex items-center gap-5 border-b border-gray-300 pb-5 dark:border-white/10"> 
            <img 
              src={profilePic} 
              alt="Profile" 
              className=" 
                h-24 w-24 
                rounded-full 
                border-4 border-[#08243f] 
                object-cover 
                dark:border-[#55d4aa]
                dark:shadow-[0_0_22px_rgba(85,212,170,0.18)]
              " 
            /> 
 
            <div className="h-px flex-1 bg-gray-300 dark:bg-white/10"></div> 
          </div> 
 
          {error && ( 
            <p 
              role="alert" 
              className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/60 dark:text-red-300" 
            > 
              {error} 
            </p> 
          )} 
 
          {!edit ? ( 
            <div> 
              <div className="mt-6 space-y-5"> 
                <div className="grid grid-cols-[150px_1fr]"> 
                  <p className="font-medium text-[#08243f] dark:text-[#9eabb5]">First name:</p> 
 
                  <p className="dark:text-white">{firstName || "-"}</p> 
                </div> 
 
                <div className="grid grid-cols-[150px_1fr]"> 
                  <p className="font-medium text-[#08243f] dark:text-[#9eabb5]">Last name:</p> 
 
                  <p className="dark:text-white">{lastName || "-"}</p> 
                </div> 
 
                <div className="grid grid-cols-[150px_1fr]"> 
                  <p className="font-medium text-[#08243f] dark:text-[#9eabb5]">Email:</p> 
 
                  <p className="dark:text-white">{email}</p> 
                </div> 
 
                <div className="grid grid-cols-[150px_1fr]"> 
                  <p className="font-medium text-[#08243f] dark:text-[#9eabb5]">Phone number:</p> 
 
                  <p className="dark:text-white">{phoneNumber || "-"}</p> 
                </div> 
 
                <div className="grid grid-cols-[150px_1fr]"> 
                  <p className="font-medium text-[#08243f] dark:text-[#9eabb5]">Role:</p> 
 
                  <p className="capitalize dark:text-white">{role || "-"}</p> 
                </div> 
 
                <div className="grid grid-cols-[150px_1fr]"> 
                  <p className="font-medium text-[#08243f] dark:text-[#9eabb5]">Bio:</p> 
 
                  <p className="dark:text-white">{bio || "-"}</p> 
                </div> 
              </div> 
 
              <div className="mt-8 flex justify-end"> 
                <button 
                  onClick={() => setEdit(true)} 
                  className=" 
                    text-sm 
                    font-medium 
                    text-blue-500 
                    hover:underline 
                    dark:text-[#55d4aa]
                  " 
                > 
                  Edit information 
                </button> 
              </div> 
            </div> 
          ) : ( 
            <div> 
              <h2 className="mt-6 text-xl font-semibold text-[#08243f] dark:text-white"> 
                Edit your information 
              </h2> 
 
              <div className="mt-5"> 
                <label className="mb-2 block text-sm font-medium text-[#08243f] dark:text-white"> 
                  Profile picture 
                </label> 
 
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleProfilePic} 
                  className="text-sm dark:text-[#a7b4be]" 
                /> 
              </div> 
 
              <div className="mt-6 space-y-4"> 
                <div className="grid grid-cols-[150px_1fr] items-center"> 
                  <label className="text-sm dark:text-[#a7b4be]">First name:</label> 
 
                  <input 
                    type="text" 
                    value={firstName} 
                    onChange={(event) => setFirstName(event.target.value)} 
                    className=" 
                      rounded-lg 
                      border border-gray-300 
                      px-3 py-2 
                      outline-none 
                      focus:border-[#17634f] 
                      dark:border-[#294457]
                      dark:bg-[#081a26]
                      dark:text-white
                      dark:focus:border-[#55d4aa]
                    " 
                  /> 
                </div> 
 
                <div className="grid grid-cols-[150px_1fr] items-center"> 
                  <label className="text-sm dark:text-[#a7b4be]">Last name:</label> 
 
                  <input 
                    type="text" 
                    value={lastName} 
                    onChange={(event) => setLastName(event.target.value)} 
                    className=" 
                      rounded-lg 
                      border border-gray-300 
                      px-3 py-2 
                      outline-none 
                      focus:border-[#17634f] 
                      dark:border-[#294457]
                      dark:bg-[#081a26]
                      dark:text-white
                      dark:focus:border-[#55d4aa]
                    " 
                  /> 
                </div> 
 
                <div className="grid grid-cols-[150px_1fr] items-center"> 
                  <label className="text-sm dark:text-[#a7b4be]">Email:</label> 
 
                  <input 
                    type="email" 
                    value={email} 
                    disabled 
                    className=" 
                      rounded-lg 
                      border border-gray-300 
                      px-3 py-2 
                      outline-none 
                      focus:border-[#17634f] 
                      dark:border-[#294457]
                      dark:bg-[#0a1e2c]
                      dark:text-[#7f929f]
                      dark:opacity-70
                    " 
                  /> 
                </div> 
 
                <div className="grid grid-cols-[150px_1fr] items-center"> 
                  <label className="text-sm dark:text-[#a7b4be]">Phone number:</label> 
 
                  <input 
                    type="text" 
                    value={phoneNumber} 
                    onChange={(event) => setPhoneNumber(event.target.value)} 
                    className=" 
                      rounded-lg 
                      border border-gray-300 
                      px-3 py-2 
                      outline-none 
                      focus:border-[#17634f] 
                      dark:border-[#294457]
                      dark:bg-[#081a26]
                      dark:text-white
                      dark:focus:border-[#55d4aa]
                    " 
                  /> 
                </div> 
 
                <div className="grid grid-cols-[150px_1fr] items-center"> 
                  <label className="text-sm dark:text-[#a7b4be]">Bio:</label> 
 
                  <input 
                    type="text" 
                    value={bio} 
                    onChange={(event) => setBio(event.target.value)} 
                    className=" 
                      rounded-lg 
                      border border-gray-300 
                      px-3 py-2 
                      outline-none 
                      focus:border-[#17634f] 
                      dark:border-[#294457]
                      dark:bg-[#081a26]
                      dark:text-white
                      dark:focus:border-[#55d4aa]
                    " 
                  /> 
                </div> 
              </div> 
 
              <div className="mt-8 flex justify-end gap-3"> 
                <button 
                  type="button" 
                  disabled={isSaving} 
                  onClick={() => {setEdit(false); setError("");}} 
                  className=" rounded-lg border border-gray-300 px-5 py-2 text-sm text-[#08243f] dark:border-[#315064] dark:text-white dark:hover:border-[#55d4aa] dark:hover:bg-[#102b3b]" 
                > 
                  Cancel 
                </button> 
 
                <button 
                  type="button" 
                  onClick={handleSave} 
                  className=" rounded-lg bg-[#17634f] px-5 py-2 text-sm font-medium text-white hover:bg-[#12503f] dark:bg-[#20c997] dark:text-[#06241d] dark:shadow-[0_0_22px_rgba(32,201,151,0.18)] dark:hover:bg-[#2bd8a6]" 
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