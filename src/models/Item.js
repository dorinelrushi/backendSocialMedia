import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    userId: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String, // Base64 encoded image string
    },
    likedBy: {
      type: [String], // Array of user IDs who liked the item
      default: [],
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);
