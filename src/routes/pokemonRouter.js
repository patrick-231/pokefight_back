//
// pokemonRouter.js
//

const express = require('express');
const router = express.Router();

const {
  getAllPokemons,
  getPokemonByQuery,
  getPokemonInfo,
  addOnePokemon,
  updatePokemon,
  deletePokemon,
} = require('../controllers/pokemonController');

// Route for getting all Pokemons
router.get('/pokemons', getAllPokemons);

// Route for getting Pokemons by query
router.get('/pokemons/query', getPokemonByQuery);

// Route for getting Pokemon info by pk_index or pk_name
router.get('/pokemons/:param', getPokemonInfo);

// Route for adding a new Pokemon
router.post('/pokemons', addOnePokemon);

// Route for updating a Pokemon by pk_index or pk_name
router.patch('pokemons/:param', updatePokemon);

// Route for deleting a Pokemon by pk_index or pk_name
router.delete('pokemons/:param', deletePokemon);

module.exports = router;
