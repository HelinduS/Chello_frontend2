"use client";

import { useRef, useState } from "react";

export default function UserProfileFullDashboard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/100");
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [phone, setPhone] = useState("+94 712345678");
  const [address, setAddress] = useState("123 Milk Street, Colombo");
  const [editing, setEditing] = useState(false);

  const [history] = useState([
    { id: 1, item: "Fresh Cow Milk", date: "2024-03-18", amount: "Rs. 250" },
    { id: 2, item: "Paneer", date: "2024-03-14", amount: "Rs. 350" },
    { id: 3, item: "Ghee", date: "2024-03-10", amount: "Rs. 550" },
  ]);

  const handleSave = () => {
    setEditing(false);
  };

const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    const imageUrl = URL.createObjectURL(file);
    setProfilePic(imageUrl);
  }
};


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-cyan-700 mb-6">Customer Profile</h1>

      <div className="bg-white p-6 rounded shadow-md mb-10">
        <div className="flex flex-col items-center gap-4 mb-6">
          <img
            src={profilePic}
            alt="Profile"
            className="rounded-full w-24 h-24 object-cover border-4 border-cyan-500"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current!.click()}
            className="text-sm text-cyan-600 hover:underline"
          >
            Change Profile Picture
          </button>
        </div>

        <div className="grid gap-4 max-w-xl mx-auto">
          <div>
            <label className="block font-medium text-gray-700">Name</label>
            <input
              disabled={!editing}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded mt-1 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Email</label>
            <input
              disabled={!editing}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded mt-1 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Phone</label>
            <input
              disabled={!editing}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded mt-1 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Address</label>
            <input
              disabled={!editing}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 border rounded mt-1 disabled:bg-gray-100"
            />
          </div>

          {editing ? (
            <button
              onClick={handleSave}
              className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-600"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="border border-cyan-700 text-cyan-700 px-4 py-2 rounded hover:bg-cyan-50"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Purchase History</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-600">
              <th className="py-2">Date</th>
              <th className="py-2">Item</th>
              <th className="py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr key={entry.id} className="border-t">
                <td className="py-2">{entry.date}</td>
                <td className="py-2">{entry.item}</td>
                <td className="py-2">{entry.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
