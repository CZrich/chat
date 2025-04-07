// src/models/Author.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAuthor extends Document {
  email: string;
  name: string;
  friends: mongoose.Types.ObjectId[];
}

const AuthorSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  friends: [{ type: Schema.Types.ObjectId, ref: 'Author' }],
});

export default mongoose.model<IAuthor>('Author', AuthorSchema);