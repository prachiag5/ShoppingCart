import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  code: { type: Number, required: true },
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  imageUrl: String,
  stock: { type: String },
  promotion: { type: String },
  count: { type: Number }
});

export default mongoose.model('Product', productSchema);
