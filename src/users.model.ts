import { Request } from 'express';
import { Document, model, Schema } from 'mongoose';

export interface iUserDocument extends Document {
  email: string;
  password: string;
  joinedAt: Date;
}

export interface RequestWithUser extends Request {
  user?: iUserDocument;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  joinedAt: {
    type: Date,
    default: new Date(),
  },
});

export const User = model<iUserDocument>('User', userSchema);
