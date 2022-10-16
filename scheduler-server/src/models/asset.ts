import { model, Schema } from 'mongoose';

const Asset = new Schema({
  ip: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: false },
  dateCreated: { type: Date, required: true, default: () => new Date() },
});

export default model('asset', Asset);
