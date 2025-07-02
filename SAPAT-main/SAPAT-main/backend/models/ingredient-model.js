import { Schema, model } from 'mongoose';

const ingredientSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  available: {type: Number, default: 1},  // 1 -> true; 0 -> false
  group: {type: String, default: '' }, // Cereal grains, Protein, Fats and oils, Minerals and vitamins
  description: { type: String, default: '' },
  source: { type: String, required: true, default: 'user' }, // global or user
  nutrients: [{
    nutrient: { type: Schema.Types.ObjectId, ref: 'Nutrient' },
    value: { type: Number }
  }],
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default model('Ingredient', ingredientSchema);