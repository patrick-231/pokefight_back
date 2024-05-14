//
//  leaderboardSchema.js
//

const mongoose = require("mongoose");

//
//  leaderboardSchema
//
const leaderboardSchema = new mongoose.Schema({ 
  lb_name: 
  {  // This corresponds to userSchema.email and ought to be a foreign key (reference) in later versions
    type: String,
    required: true,
  },
  lb_wins:
  {  
    type: Number 
  },  
  lb_losses:
  {
    type: Number
  },  
  lb_total:
  { 
    type: Number
  },
  lb_score:
  {
    type: Number
  }

});

module.exports = mongoose.model("leaderboardSchema", leaderboardSchema);