import { useState } from "react";
import defaultPfp from "../assets/default-pfp.png";

const Profile = () => {
  const [profilePic, setProfilePic] = useState(defaultPfp);

  const [firstName, setFirstName] = useState("Someone");
  const [lastName, setLastName] = useState("Something");
  const [email, setEmail] = useState("someone.something@example.com");
  const [postNumber, setPostNumber] = useState("06769");
  const [location, setLocation] = useState("Helsinki");
  const [phoneNumber, setPhoneNumber] = useState("+290 3023844");

  const [edit, setEdit] = useState(false);

  const handleProfilePic = (event) => {
    const file = event.target.files[0];

    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] px-6 py-10">

      <div className="mx-auto max-w-3xl">

        <div className="rounded-2xl border border-gray-300 bg-white p-6">

          <div className="flex items-center gap-5 border-b border-gray-300 pb-5">

            <img
              src={profilePic}
              alt="Profile"
              className="
                h-24 w-24
                rounded-full
                border-4 border-[#08243f]
                object-cover
              "
            />

            <div className="h-px flex-1 bg-gray-300"></div>

          </div>

          {!edit ? (
            <div>

              <div className="mt-6 space-y-5">

                <div className="grid grid-cols-[150px_1fr]">
                  <p className="font-medium text-[#08243f]">
                    First name:
                  </p>

                  <p>{firstName}</p>
                </div>

                <div className="grid grid-cols-[150px_1fr]">
                  <p className="font-medium text-[#08243f]">
                    Last name:
                  </p>

                  <p>{lastName}</p>
                </div>

                <div className="grid grid-cols-[150px_1fr]">
                  <p className="font-medium text-[#08243f]">
                    Email:
                  </p>

                  <p>{email}</p>
                </div>

                <div className="grid grid-cols-[150px_1fr]">
                  <p className="font-medium text-[#08243f]">
                    Post number:
                  </p>

                  <p>{postNumber}</p>
                </div>

                <div className="grid grid-cols-[150px_1fr]">
                  <p className="font-medium text-[#08243f]">
                    Location:
                  </p>

                  <p>{location}</p>
                </div>

                <div className="grid grid-cols-[150px_1fr]">
                  <p className="font-medium text-[#08243f]">
                    Phone number:
                  </p>

                  <p>{phoneNumber}</p>
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
                  "
                >
                  Edit information
                </button>
              </div>

            </div>
          ) : (

            <div>

              <h2 className="mt-6 text-xl font-semibold text-[#08243f]">
                Edit your information
              </h2>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-[#08243f]">
                  Profile picture
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePic}
                  className="text-sm"
                />
              </div>


              <div className="mt-6 space-y-4">

                <div className="grid grid-cols-[150px_1fr] items-center">
                  <label className="text-sm">
                    First name:
                  </label>

                  <input
                    type="text"
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(event.target.value)
                    }
                    className="
                      rounded-lg
                      border border-gray-300
                      px-3 py-2
                      outline-none
                      focus:border-[#17634f]
                    "
                  />
                </div>

                <div className="grid grid-cols-[150px_1fr] items-center">
                  <label className="text-sm">
                    Last name:
                  </label>

                  <input
                    type="text"
                    value={lastName}
                    onChange={(event) =>
                      setLastName(event.target.value)
                    }
                    className="
                      rounded-lg
                      border border-gray-300
                      px-3 py-2
                      outline-none
                      focus:border-[#17634f]
                    "
                  />
                </div>

                <div className="grid grid-cols-[150px_1fr] items-center">
                  <label className="text-sm">
                    Email:
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    className="
                      rounded-lg
                      border border-gray-300
                      px-3 py-2
                      outline-none
                      focus:border-[#17634f]
                    "
                  />
                </div>

                <div className="grid grid-cols-[150px_1fr] items-center">
                  <label className="text-sm">
                    Post number:
                  </label>

                  <input
                    type="text"
                    value={postNumber}
                    onChange={(event) =>
                      setPostNumber(event.target.value)
                    }
                    className="
                      rounded-lg
                      border border-gray-300
                      px-3 py-2
                      outline-none
                      focus:border-[#17634f]
                    "
                  />
                </div>

                <div className="grid grid-cols-[150px_1fr] items-center">
                  <label className="text-sm">
                    Location:
                  </label>

                  <input
                    type="text"
                    value={location}
                    onChange={(event) =>
                      setLocation(event.target.value)
                    }
                    className="
                      rounded-lg
                      border border-gray-300
                      px-3 py-2
                      outline-none
                      focus:border-[#17634f]
                    "
                  />
                </div>

                <div className="grid grid-cols-[150px_1fr] items-center">
                  <label className="text-sm">
                    Phone number:
                  </label>

                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(event) =>
                      setPhoneNumber(event.target.value)
                    }
                    className="
                      rounded-lg
                      border border-gray-300
                      px-3 py-2
                      outline-none
                      focus:border-[#17634f]
                    "
                  />
                </div>

              </div>

              <div className="mt-8 flex justify-end gap-3">

                <button onClick={() => setEdit(false)}
                  className=" rounded-lg border border-gray-300 px-5 py-2 text-sm text-[#08243f]">
                  Cancel
                </button>

                <button onClick={() => setEdit(false)}
                  className=" rounded-lg bg-[#17634f] px-5 py-2 text-sm font-medium text-white hover:bg-[#12503f]">
                  Save
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