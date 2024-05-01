import mongoose from "mongoose";

const Connection = async (MONGODB_URL) => {
  try {
    await mongoose.connect(MONGODB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error, "Error while connecting to database");
  }
};

export default Connection;