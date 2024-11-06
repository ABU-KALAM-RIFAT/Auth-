import mongoose from "mongoose";

const connectdatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("database connected successfully");
  } catch (error) {
    console.error("Error while connecting to database");
  }
};

export default connectdatabase;
