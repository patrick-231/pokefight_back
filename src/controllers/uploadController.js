//
// uploadController.js
// 

const pokemonSchema = require("../schemas/pokemonSchema");

// About the data you send. "data" must proceed them.
// In Postman make sure to set the body type to "raw" and select "JSON" as the format.
// Example:
//{
//  "data": [
//    {
//      "pk_index": 1,
//      "pk_name": "Bulbasaur",
//      "pk_type": "Grass",

const postUploadData = async (req, res) => {
  if (!req.body || !req.body.data) {
    return res.status(400).send('Incorrect data format provided! Please provide the data key in front of your JSON value array!');
  }

  // Assuming data is sent as a JSON array in the request body
  // So: The next statement is responsible for extracting the Pokemon data from the request body.
  // It assumes that the Pokémon data is sent as a JSON array under the key "data" in the request body.
  // 
  const pokemonData = req.body.data;

  try {
    // Call the uploadData function to save data to the database
    await uploadData(pokemonData);
    res.send('Data imported successfully');
  } catch (err) {
    console.error('Error saving data to database', err);
    res.status(500).send('Error saving data to database');
  }
}

const uploadData = async (data) => {
  try {
    // Save data to MongoDB using Mongoose
    // Note: The new form of insertMany does not provide a callback. This is not documented
    await pokemonSchema.insertMany(data);
  } catch (err) {
    console.error('Error saving data to database', err);
    throw err; // Propagate the error to the caller
  }
}

module.exports = {
  postUploadData
};

