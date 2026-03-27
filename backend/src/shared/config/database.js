import mongoose from "./mongoose.js";

export const connectDB = async (mongoUri) => {
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
    });

    // Connection event handlers
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to MongoDB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected");
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Test connection with a simple query
    try {
      await mongoose.connection.db.admin().ping();
      console.log("MongoDB ping successful - database is accessible");
    } catch (pingError) {
      console.error("MongoDB ping failed:", pingError.message);
      throw new Error("Cannot access MongoDB database");
    }
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Don't exit process here so services can optionally run in fallback mode
    return null;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB Disconnected");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
