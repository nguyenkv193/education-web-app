import mongoose from "mongoose";
import { getConfig } from "../../../shared/config/env.js";
import User from "../models/User.js";

const config = getConfig("user");

/**
 * Migration: Add blogs field to existing users
 * Run this to initialize blogs array for all existing users in database
 */
async function migrateAddBlogsField() {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Update all users that don't have blogs field
    const result = await User.updateMany(
      { blogs: { $exists: false } },
      { $set: { blogs: [] } }
    );

    console.log(
      `✅ Migration completed. Updated ${result.modifiedCount} users`
    );
    console.log(
      "All existing users now have blogs field initialized to empty array"
    );

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

migrateAddBlogsField();
