//
//  pokemonSchema.js
//

const mongoose = require("mongoose");

//
//  Pokemon schema.
//
// Resources:  I did not use https://pokeapi.co/ for lack of transparency, altough doing some basic research
// using curl from some bash script. bash is ok for JSON as long as jq can be used 
// (jq is not available with Git bash, you need Cygwin for that or stick with some node modules that only nearly do the same)
//
//  1) Fields are essentially taken from https://pokemondb.net/pokedex/national (List of Pokémon)
//  which lists all the Pokemon generations. There you can find a mini portrait
//  the number, the name, and the type. Clicking on an item redirects you to 
//
//
//  2) There are different views (Complete Pokémon Pokédex)
//  https://pokemondb.net/pokedex/all
//  that lists #, Name, Type, Total, HP, Attack, Defense, Sp. Atk, Sp.Def, Speed
//  for all
//
// Individual data for a pokemon can be taken from
// 
// Example: Charizard
// https://pokemondb.net/pokedex/charizard
// so they can be addressed by  https://pokemondb.net/pokedex/<name>
// but also by  https://pokemondb.net/pokedex/<index>
// which also redirects to  https://pokemondb.net/pokedex/<name>

const pokemonSchema = new mongoose.Schema({
  pk_index:  // May match, but need not match _id
  {
    type: Number,
    required: true,
    unique: true,
  },
  pk_name:
  {  // -> English name. If not, we do not care.
    type: String,
    required: true,
    unique: true,
  },
  pk_imagelink:
  { // No image files in the database as we cannot import binary data
    type: String
  },
  pk_type:
  {    // At least one, no more than two. Yet not decided: Use one String field for both types
    type: String 
  },
  pk_type2:
  {    // Optional. See my comments about pk_Type
    type: String
  },
  pk_species:
  {
    type: String
  },
  pk_height:
  {
    type: Number
  },
  pk_weight:
  {
    type: Number
  },
  pk_abilities:
  {  // Multiple possible abilities, but only one relevant at a time. As for the moment, all in one string separated by blanks, so parse ;-)
    type: String  
  },
  // Base stats...
  pkbs_hp:
  {
    type: Number
  
  },
  pkbs_attack:
  {
    type: Number

  },
  pkbs_defense:
  {
    type: Number
 
  },
  pkbs_specialattack:
  {
    type: Number
 
  },
  pkbs_specialdefense:
  {
    type: Number 
  },
  pkbs_speed:
  {
    type: Number
  },
  pkbs_total:
  { // Should be the sum of the pkbs stuff so far. If not, we do not care...
    type: Number 
  }
});

module.exports = mongoose.model("pokemonSchema", pokemonSchema);