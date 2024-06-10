import mongoose from "mongoose";

const connectToDB = async () => {
  const connectionURL = "";

  try {
    await mongoose.connect(connectionURL);
    console.log("Job board database connection is successful");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

export default connectToDB;
