import { Schema, model } from 'mongoose';

const userIngredientOverrideSchema = new Schema({
  ingredient_id: { type: Schema.Types.ObjectId, ref: 'Ingredient' },  // ingredient to override
  name: { type: String },
  price: { type: Number },
  available: {type: Number, default: 1},  // 1 -> true; 0 -> false
  group: {type: String },
  description: { type: String, default: '' },
  nutrients: [{
    nutrient: { type: Schema.Types.ObjectId, ref: 'Nutrient' },
    value: { type: Number }
  }],
  deleted: {type: Number, default: 0 }, // 1 -> if true; 0 if false
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default model('UserIngredientOverride', userIngredientOverrideSchema);