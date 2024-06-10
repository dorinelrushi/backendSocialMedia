"use server";

import Item from "../models/Item";
import connectToDB from "@/database";

export async function saveItem(data, userId) {
  await connectToDB();

  const { name, email, imageUrl } = data;

  try {
    const newItem = new Item({ name, email, userId, imageUrl });
    await newItem.save();

    const plainItem = newItem.toObject({ getters: true, versionKey: false });
    plainItem._id = plainItem._id.toString();

    return { success: true, data: plainItem };
  } catch (error) {
    console.error("Error saving item:", error);
    return { success: false, error: error.message };
  }
}

export async function getItems(userId) {
  await connectToDB();

  try {
    const items = await Item.find({ userId });
    const plainItems = items.map((item) => {
      const plainItem = item.toObject({ getters: true, versionKey: false });
      plainItem._id = plainItem._id.toString();
      return plainItem;
    });

    return { success: true, data: plainItems };
  } catch (error) {
    console.error("Error retrieving items:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteItem(itemId, userId) {
  await connectToDB();

  try {
    const deletedItem = await Item.findOneAndDelete({ _id: itemId, userId });

    if (deletedItem) {
      const plainItem = deletedItem.toObject({
        getters: true,
        versionKey: false,
      });

      plainItem._id = plainItem._id.toString();
      return { success: true, data: plainItem };
    } else {
      return { success: false, error: "Item not found or not authorized" };
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    return { success: false, error: error.message };
  }
}

export async function getAllItems() {
  await connectToDB();
  const items = await Item.find({});
  // Convert Mongoose documents to plain JavaScript objects
  const plainItems = items.map((item) => {
    const plainItem = item.toObject({ getters: true, versionKey: false });
    plainItem._id = plainItem._id.toString();
    return plainItem;
  });

  return plainItems;
}

export async function likeItem(itemId, userId) {
  await connectToDB();
  const item = await Item.findById(itemId);
  if (!item) {
    return { success: false, error: "Item not found" };
  }

  if (!item.likedBy.includes(userId)) {
    item.likedBy.push(userId);
  } else {
    item.likedBy = item.likedBy.filter((id) => id !== userId);
  }

  await item.save();

  // Convert Mongoose document to plain JavaScript object
  const plainItem = item.toObject({ getters: true, versionKey: false });
  plainItem._id = plainItem._id.toString();

  return { success: true, data: plainItem };
}

export async function updateItem(itemId, userId, data) {
  await connectToDB();

  const { name, email } = data;

  try {
    if (!itemId || !userId || !name || !email) {
      throw new Error("Missing required fields");
    }

    const updatedItem = await Item.findOneAndUpdate(
      { _id: itemId, userId },
      { name, email },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return { success: false, error: "Item not found or not authorized" };
    }

    const plainItem = updatedItem.toObject({
      getters: true,
      versionKey: false,
    });
    plainItem._id = plainItem._id.toString();

    return { success: true, data: plainItem };
  } catch (error) {
    console.error("Error updating item:", error);
    return { success: false, error: error.message };
  }
}
