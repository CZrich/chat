// src/models/Message.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  message: string;
  author: mongoose.Types.ObjectId;
  date: string;
}

const MessageSchema: Schema = new Schema({
  message: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author' },
  date: { type: String, required: true },
});

export default mongoose.model<IMessage>('Message', MessageSchema);
