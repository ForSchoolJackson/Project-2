// imports
const mongoose = require('mongoose');
const _ = require('underscore');

const setHeight = (height) => _.escape(height).trim();
const setWeight = (weight) => _.escape(weight).trim();

// pokemon schema
const PokemonSchema = new mongoose.Schema({
  num: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  img: {
    type: String,
    required: true,
  },
  type: {
    type: [String],
    required: true,
  },
  height: {
    type: String,
    required: false,
    trim: true,
    set: setHeight,
  },
  weight: {
    type: String,
    required: false,
    trim: true,
    set: setWeight,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// to API
PokemonSchema.statics.toAPI = (doc) => ({
  num: doc.num,
  name: doc.name,
  img: doc.img,
  type: doc.type,
  height: doc.height,
  weight: doc.weight,
});

// exports
const PokemonModel = mongoose.model('Mon', PokemonSchema);
module.exports = PokemonModel;
