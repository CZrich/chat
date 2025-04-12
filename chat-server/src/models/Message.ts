

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: String,
  content: String,
  timestamp: String,
});

export default mongoose.model('Message', messageSchema);
