import { Item } from '../models/item.model.js';

export const itemService = {
  createItem(data) {
    return Item.create(data);
  },
  getAllItems() {
    return Item.find().sort({ createdAt: -1 });
  },
  getItemById(id) {
    return Item.findById(id);
  },
  updateItem(id, data) {
    return Item.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },
  deleteItem(id) {
    return Item.findByIdAndDelete(id);
  },
};