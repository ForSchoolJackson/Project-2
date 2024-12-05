// imports
const { Types } = require('mongoose');

const { ObjectId } = Types;
const models = require('../models');

const { Pokemon } = models;

// profile page
const profilePage = async (req, res) => res.render('app');

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
  // chack all feilds
  if (!req.body.height || !req.body.weight) {
    return res.status(400).json({ error: 'Height and weight required!' });
  }

  const pokemonData = {
    num: req.body.num,
    name: req.body.name,
    img: req.body.img,
    type: req.body.type,
    height: req.body.height,
    weight: req.body.weight,
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
    const docs = await Pokemon.find(query).select('name age food').lean().exec();

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

// exports
module.exports = {
  profilePage,
  getProfile,
  getPokemon,
  addPokemon,
  deletePokemon,
};
