
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  message: string;
  author: mongoose.Types.ObjectId;
  recipient:Types.ObjectId;
  date: string;
}

const MessageSchema: Schema = new Schema({
  message: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author' },
  recipient: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  date: { type: String, required: true },
});

export default mongoose.model<IMessage>('Message', MessageSchema);
