import mongoose from 'mongoose';

// Configure Mongoose globally BEFORE any models are created
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 30000);
mongoose.set('strictQuery', false);

export default mongoose;
