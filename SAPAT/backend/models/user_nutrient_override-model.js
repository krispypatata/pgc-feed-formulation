import { Schema, model } from "mongoose";

const userNutrientOverrideSchema = new Schema({
  nutrient_id: { type: Schema.Types.ObjectId, ref: 'Nutrient' },  // nutrient to override
  abbreviation: {type: String },
  name: { type: String },
  unit: {type: String },
  description: { type: String },
  group: {type: String },
  deleted: {type: Number, default: 0 }, // 1 -> if true; 0 if false
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default model("UserNutrientOverride", userNutrientOverrideSchema);