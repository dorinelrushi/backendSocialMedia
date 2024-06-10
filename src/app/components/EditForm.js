"use client";
import { useState } from "react";
import { updateItem } from "@/actions";

function EditForm({ item, userId }) {
  const [name, setName] = useState(item.name);
  const [email, setEmail] = useState(item.email);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateItem = async (itemId, data) => {
    const response = await updateItem(itemId, userId, data);
    if (response.success) {
      // Assuming we would like to reflect changes immediately without page reload
      setName(response.data.name);
      setEmail(response.data.email);
      setIsEditing(false);
    } else {
      console.error("Error updating item:", response.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleUpdateItem(item._id, { name, email });
  };

  return (
    <div>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="mt-[15px] ">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="border mb-[10px] border-[#545466] p-2 mr-2 bg-[#3f3f4b]"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border mb-[10px]  border-[#545466] p-2 mr-2 bg-[#3f3f4b]"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white">
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="py-2 bg-gray-500 text-white"
          >
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <span>
            {name} - {email}
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 bg-blue-500 text-white ml-2"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

export default EditForm;
