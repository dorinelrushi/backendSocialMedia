"use client";

import { deleteItem } from "@/actions";
import React from "react";

function ButtonDelete({ itemId, userId }) {
  const handleDelete = async (itemId, userId) => {
    try {
      console.log("Attempting to delete item:", itemId, "for user:", userId);
      const response = await deleteItem(itemId, userId);
      if (response.success) {
        console.log("Item deleted successfully:", itemId);
        window.location.reload(); // Reload the page or update the state to reflect the deletion
      } else {
        console.error("Failed to delete item:", response.error);
        alert("Failed to delete item: " + response.error);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("An error occurred while deleting the item.");
    }
  };

  return (
    <div>
      <div>
        <button
          onClick={() => handleDelete(itemId, userId)}
          className="bg-[#f74a4a] py-[10px] text-[white] px-[30px] rounded-[8px]"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ButtonDelete;
