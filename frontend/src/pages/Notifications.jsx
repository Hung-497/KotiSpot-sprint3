import { useState } from "react";
import { Bell, Trash2 } from "lucide-react";

function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New property available",
      message: "A new apartment has been listed in Helsinki",
      time: "5 minutes ago",
    },
    {
      id: 2,
      title: "Price updated",
      message: "The price of a property in Espoo has been updated",
      time: "1 hour ago",
    },
    {
      id: 3,
      title: "Favourite property",
      message: "One of your favourite properties is still available",
      time: "Yesterday",
    },
    {
      id: 4,
      title: "New property in Vantaa",
      message: "A new property matching your preferences is available",
      time: "2 days ago",
    },
    {
      id: 5,
      title: "Moving out of your current place is effective from tommorow",
      message: "You are required to leave your current place because you didn't pay the rent for a month. For details, please contact us to better understand this issue",
      time:"a week ago",
    }
  ]);

  const handleDelete = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
);
  };

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

        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">                
                <div className="flex gap-4">

                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eef6f2] text-[#17634f]">
                    <Bell size={22} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-[#08243f]">
                      {notification.title}
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                      {notification.message}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                      {notification.time}
                    </p>
                  </div>
                </div>

                <button onClick={() => handleDelete(notification.id)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500">
                  <Trash2 size={19} />
                </button>
              </div>
            ))
          ) : (
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