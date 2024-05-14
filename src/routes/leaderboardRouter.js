//
// leaderboardRouter.js
//

const express = require('express');
const router = express.Router();

const {
  getAllLeaderBoardEntries,
  getLeaderBoardEntryById,
  addLeaderBoardEntry,
  updateLeaderboardEntryById,
  deleteLeaderBoardEntryById
} = require('../controllers/leaderboardController');

// Route for getting all leaderboard entries
router.get('/leaderboard', getAllLeaderBoardEntries);

// Route for getting leaderboard entry by _id
router.get("/leaderbord/:param", getLeaderBoardEntryById);

// Route for adding a new leaderboard entry
router.post('/leaderboard', addLeaderBoardEntry);

// Route for updating a leaderboard entry by _id
router.patch('/leaderboard/:param', updateLeaderboardEntryById);

// Route for deleting a leaderboard entry by _id
router.delete('/leaderboard/:param', deleteLeaderBoardEntryById);

module.exports = router;