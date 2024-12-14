// imports
const fs = require('fs');
const path = require('path');
const { Types } = require('mongoose');
const models = require('../models');

const { ObjectId } = Types;
const { Pokemon } = models;

const pokemonPath = path.resolve(__dirname, '../data/pokedex.json');
const jsonString = fs.readFileSync(pokemonPath, 'utf-8');
let data = [];

// parse the json data
try {
  data = JSON.parse(jsonString);
} catch (err) {
  console.log('Unknown eorror parsing data');
}

// profile page
const profilePage = async (req, res) => res.render('app');

// search page
const searchPage = async (req, res) => res.render('search');

// profile info
const getProfile = async (req, res) => {
  try {
    const user = req.session.account;
    // count the number of documents
    // https://www.mongodb.com/docs/manual/reference/method/db.collection.countDocuments/
    const pokemonNum = await Pokemon.countDocuments({ owner: user._id });

    return res.status(200).json({
      user,
      pokemonNum,
    });
  } catch (err) {
    console.error('Error fetching user info:', err);
    return res.status(500).json({ error: 'An error occurred while fetching user info.' });
  }
};

// add pokemon
const addPokemon = async (req, res) => {
  // check if user logged in
  if (!req.session.account || !req.session.account._id) {
    return res.status(401).json({ error: 'Not the correct user' });
  }

  // chack all feilds
  // if (!req.body.height || !req.body.weight) {
  //   return res.status(400).json({ error: 'Height and weight required!' });
  // }

  const pokemonData = {
    num: req.body.num,
    name: req.body.name,
    img: req.body.img,
    type: req.body.type,
    height: req.body.height,
    weight: req.body.weight,
    owner: req.session.account._id,
  };

  try {
    const newPokemon = new Pokemon(pokemonData);
    await newPokemon.save();

    console.log(newPokemon);
    // return all data
    return res.status(201).json({
      num: newPokemon.num,
      name: newPokemon.name,
      img: newPokemon.img,
      type: newPokemon.type,
      height: newPokemon.height,
      weight: newPokemon.weight,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Pokemon already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making the pokemon!' });
  }
};

// get pokemon
const getPokemon = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Pokemon.find(query).select('name').lean().exec();

    return res.json({ pokemon: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving pokemon!' });
  }
};

// delete pokemon
const deletePokemon = async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const deleted = await Pokemon.deleteOne({ _id: id });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ error: 'No pokemon found!' });
    }

    return res.status(200).json({ message: 'Pokemon successfully deleted!' });
  } catch (err) {
    return res.status(500).json({ error: 'An error occured deleting the pokemon!' });
  }
};

// FOR SEARCH
// CODE TAKEN FROM MY PROJECT 1

// get pokemon from json
const getAllPokemon = (req, res) => {
  try {
    if (data.length === 0) {
      return res.status(404).json({ error: 'No Pokémon data found.' });
    }
    return res.status(200).json(data);
  } catch (err) {
    console.error('error:', err);
    return res.status(500).json({ error: 'error getting data' });
  }
};

// get pokemon by the name
const getPokemonByName = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'No name provided to search.' });
  }

  try {
    const foundPokemon = data.find((mon) => mon.name.toLowerCase() === name.toLowerCase());

    if (!foundPokemon) {
      return res.status(404).json({ error: `No Pokémon found with the name: ${name}` });
    }

    return res.status(200).json(foundPokemon);
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: 'Error finding Pokémon.' });
  }
};

// exports
module.exports = {
  profilePage,
  searchPage,
  getProfile,
  getPokemon,
  addPokemon,
  deletePokemon,
  getAllPokemon,
  getPokemonByName,
};
