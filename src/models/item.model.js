import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const Item = mongoose.model('Item', itemSchema);