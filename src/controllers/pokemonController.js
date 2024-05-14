//
// pokemonController.js
//

const pokemonSchema = require("../schemas/pokemonSchema");

//
// GET -> All
// getAllPokemons
// 
const getAllPokemons = async (req, res) => {
  try {
    // Fetch all Pokemons from the database
    const pokemon = await pokemonSchema.find();
   
    if (!pokemon || pokemon.length === 0) {
      return res.status(404).json({ message: 'No Pokemons found' });
    }

    // If Pokemons found, return a 200 OK response with the Pokemon and the count
    res.status(200).json({ count: pokemon.length, pokemon });

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

//
// GET -> query
// getPokemonByQuery
// 
const getPokemonByQuery = async (req, res) => {
  try {
    let query = req.query;

    // Convert pk_name to lowercase if provided in the query.
    // Mongoose queries are typically case-sensitive.
    if (query.pk_name) {
      query.pk_name = query.pk_name.toLowerCase();
    }
    // Find Pokemon based on the provided query
    const pokemon = await pokemonSchema.find(query);

    // If no Pokemons found, return a 404 Not Found response
    if (!pokemon || pokemon.length === 0) {
      return res.status(404).json({ message: 'No Pokemon found' });
    }

    // If Pokemon found, return a 200 OK response with the Pokemon
    res.status(200).json({ count: pokemon.length, pokemon });

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// 
// GET: One by pk_name or pk_index 
//
// accepting one parameter that evaluates to a number or a name or to nothing, so we end up
// with pk_index or pk_name or nothing.
//
const getPokemonInfo = async (req, res) => {
  try {
    // Assuming the parameter is passed in the route params    
    const param = req.params.param.toLowerCase();

    let pokemon;

    // Check if the parameter is numeric
    if (!isNaN(param)) {
      // If it's numeric, assume it's an index
      const index = parseInt(param);
      // Retrieve the Pokemon by index
      pokemon = await pokemonSchema.findOne({ pk_index: index });
    } else {
      // If it's not numeric, assume it's a name
      // Retrieve the Pokemon by name
      pokemon = await pokemonSchema.findOne({ pk_name: param });
    }

    // If no Pokemon found, return 404 Not Found
    if (!pokemon) {
      return res.status(404).json({ error: 'Pokemon not found' });
    }

    // If Pokemon found, return it
    return res.status(200).json(pokemon);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

//
// DELETE
//
// One record by pk_index or pk_name
// Data taken from preq. aram.
//
const deletePokemon = async (req, res) => {
  try {
    const param = req.params.param.toLowerCase(); // Ensure case consistency for comparison

    let pokemon;

    // Check if the parameter is numeric
    if (!isNaN(param)) {
      // If it's numeric, assume it's an index
      const index = parseInt(param);
      // Retrieve the Pokemon by index
      pokemon = await pokemonSchema.findOne({ pk_index: index });
    } else {
      // If it's not numeric, assume it's a name
      // Retrieve the Pokemon by name
      pokemon = await pokemonSchema.findOne({ pk_name: param });
    }

    // If no Pokemon found, return 404 Not Found
    if (!pokemon) {
      return res.status(404).json({ error: 'Pokemon not found' });
    }

    // If Pokemon found, delete it    
    await pokemonSchema.deleteOne({ _id: pokemon._id });

    // Return success message
    return res.status(200).json({ message: 'Pokemon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

//
// POST
// 
// Add one pokemon. Data are taken from req.body
// 
const addOnePokemon = async (req, res) => {
  try {
    let pokemonData = {};

    // Retrieve the field names from the schema definition modern style...
    const fields = pokemonSchema.paths();

    // Extract data from the request body based on schema definition 
    Object.keys(fields).forEach(field => {
      if (field !== '_id' && field !== '__v') {
        pokemonData[field] = req.body[field];
      }
    });

    // Convert pk_name to lowercase
    if (pokemonData.pk_name) {
      pokemonData.pk_name = pokemonData.pk_name.toLowerCase();
    }

    // Check if a Pokemon with the same index or name already exists
    const existingPokemon = await pokemonSchema.findOne({ $or: [{ pk_index: pokemonData.pk_index }, { pk_name: pokemonData.pk_name }] });
    if (existingPokemon) {
      return res.status(400).json({ error: 'A Pokemon with the same index or name already exists' });
    }

    // Create a new Pokemon instance
    await pokemonSchema.create(pokemonData);

    // Return success message
    return res.status(201).json({ message: 'Pokemon added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}


//
// PATCH -> update one record by pk_index or pk_name
// updatePokemon
// Data are being taken from the body.
// 
const updatePokemon = async (req, res) => {
  try {
    const param = req.params.param.toLowerCase(); // Ensure case consistency for comparison

    // Retrieve the field names from the schema definition
    const fields = pokemonSchema.paths();

    // Extract data from the request body based on schema definition
    let updateData = {};
    Object.keys(fields).forEach(field => {
      if (field !== '_id' && field !== '__v' && req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Convert pk_name to lowercase if it exists in the update data
    if (updateData.pk_name) {
      updateData.pk_name = updateData.pk_name.toLowerCase();
    }

    let pokemon;

    // Check if the parameter is numeric
    if (!isNaN(param)) {
      // If it's numeric, assume it's an index
      const index = parseInt(param);
      // Update the Pokemon by index
      pokemon = await pokemonSchema.findOneAndUpdate({ pk_index: index }, updateData, { new: true });
    } else {
      // If it's not numeric, assume it's a name
      // Update the Pokemon by name
      pokemon = await pokemonSchema.findOneAndUpdate({ pk_name: param }, updateData, { new: true });
    }
   
    if (!pokemon) {
      return res.status(404).json({ error: 'Pokemon not found' });
    }

    // Return the updated Pokemon
    return res.status(200).json(pokemon);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

module.exports = {
  getAllPokemons,
  getPokemonByQuery,
  getPokemonInfo,
  addOnePokemon,
  updatePokemon,
  deletePokemon,  
};