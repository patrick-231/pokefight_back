//
// leaderboardController.js
//

const leaderboardSchema = require("../schemas/leaderboardSchema");

//
// GET 
//
// request to GET for all leaderboard entries
//
const getAllLeaderBoardEntries = async (req, res) => {
  try {
    // Fetch all entries from the leaderboard
    const entries = await leaderboardSchema.find();

    if (!entries || entries.length === 0) {
      return res.status(404).json({ message: "No leaderboard entries found" });
    }
    res.status(200).json({ count: entries.length, entries });   
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//
// GET 
//
// handle GET request for a single leaderboard entry by _id
//
// Note: We have only the _id here as lb_name is not unique.
// (there will be more than one record with the same lb_name, as leaderboards work)
// So anyone that wants to get something must find out about the _id that MongoDB internally creates,
// as   "_id": "66434974b50f9a55aca65097"
//
const getLeaderBoardEntryById = async (req, res) => {
  const { id } = req.params; // Assuming the entry ID is passed as an URL parameter

  try {
    // Find the entry by _id in the leaderboard
    const entry = await leaderboardSchema.findById(id);

    if (!entry) {
      return res.status(404).json({ message: "Leaderboard entry not found" });
    }

    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//
// POST
//
// POST request to add a new leaderboard entry
//
const addLeaderBoardEntry = async (req, res) => {
  // Extracting the required fields from the request body
  const { lb_name, lb_wins, lb_losses, lb_total, lb_score } = req.body;

  try {
    // Using Leaderboard.create() to create a new entry and save it to the database (alternative: new)
    const newEntry = await leaderboardSchema.create({
      lb_name,
      lb_wins,
      lb_losses,
      lb_total,
      lb_score
    });

    // Responding with the newly created entry
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//
//  PATCH 
//
// Handle PATCH request to update a leaderboard entry by which is the internal _id
// id is being passed by req.param whereas the new data are being created from req.body.
// 
const updateLeaderboardEntryById = async (req, res) => {
  const { id } = req.params; // Assuming the entry ID is passed as a URL parameter

  try {

    // Define an array of allowed properties (next version: global)
    const allowedProperties = ["lb_name", "lb_wins", "lb_losses", "lb_total", "lb_score"];

    // Extracting the allowed fields from the request body
    const updatedFields = {};
    for (const key of allowedProperties) {
      if (req.body[key] !== undefined) {
        updatedFields[key] = req.body[key];
      }
    }

    // Find the entry by ID and update it with the new fields, returning the new record
    const updatedEntry = await leaderboardSchema.findByIdAndUpdate(id, updatedFields, { new: true });
   
    if (!updatedEntry) {
      return res.status(404).json({ message: "Leaderboard entry not found" });
    }
  
    res.status(200).json(updatedEntry);
  } catch (error) { 
    res.status(500).json({ message: error.message });
  }
};



//
// DELETE
// 
// Controller function to handle DELETE request to remove a leaderboard entry by _id
// 
const deleteLeaderBoardEntryById = async (req, res) => {
  const { id } = req.params; // Assuming the entry ID is passed as a URL parameter

  try {
    // Find the entry by _id and delete it from the leaderboard
    const deletedEntry = await leaderboardSchema.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({ message: "Leaderboard entry not found" });
    }

    res.status(200).json({ message: "Leaderboard entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getAllLeaderBoardEntries,
  getLeaderBoardEntryById,
  addLeaderBoardEntry,
  updateLeaderboardEntryById,
  deleteLeaderBoardEntryById
};