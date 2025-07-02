import mongoose, { Schema, model } from 'mongoose';

const nutrientSchema = new Schema({
  abbreviation: {type: String, required: true},
  name: {type: String, required: true},
  unit: {type: String},
  description: {type: String, default: ''},
  group: { type: String, default: '' },  // Energy, Composition, Minerals, Amino acids
  source: { type: String, required: true, default: 'user' }, // global or user
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default model('Nutrient', nutrientSchema);