"use client";

import { useState } from "react";
import { saveItem } from "@/actions";
import { useUser } from "@clerk/nextjs";

export default function FormInput() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const { user } = useUser();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You need to be logged in to submit the form");
      return;
    }

    const result = await saveItem({ name, email, imageUrl: image }, user.id);
    if (result.success) {
      setName("");
      setEmail("");
      setImage(null);
      alert("Item saved!");
      window.location.reload();
    } else {
      alert("Failed to save item: " + result.error);
    }
  };

  return (
    <div>
      <form className="flex flex-col gap-[15px]" onSubmit={handleSubmit}>
        <div>
          <input
            className="p-[10px] w-full rounded-[8px] bg-[#f8f8f8] border-[1px]"
            placeholder="Name your username"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            placeholder="Enter your email address"
            className="p-[10px] w-full rounded-[8px] bg-[#f8f8f8] border-[1px]"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="file"
            onChange={handleImageChange}
            className="p-[10px] w-full rounded-[8px] bg-[#f8f8f8] border-[1px]"
          />
        </div>
        <button
          type="submit"
          className="p-[10px] w-full rounded-[8px] bg-[#5760df] text-[white]"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
