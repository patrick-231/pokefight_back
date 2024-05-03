"use strict"; // In CommonJS modules themselves not necessary, but this is the calling code...
//
// server.js
//

const express = require("express");
const app = express();
app.use(express.json()); // Middleware...

const cors = require("cors"); // Middleware
app.use(cors());

require("dotenv").config();

// for better visual experience of the console messages ;-)
require("colors");

// form submission
app.use(express.urlencoded({ extended: true }));

// Establish database connection...
const connectDB = require("./dbinit");

try {
  connectDB();
  console.log("Database connected successfully.");
} catch (error) {
  console.error("Error connecting to the database:", error.message);
  process.exit(1);
}

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Welcome to our ultimate PokeFight API");
});

// Define your routes and middleware here
//
// Example:
// const anyrouter = require("./src/routes/anyrouter");
// app.use("/api/anyrouter", anyrouter);
//

// Now start the server...
try {

  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`.rainbow);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
    } else {
      console.error('Error starting server:', err.message);
    }
    process.exit(1); // Exit the process if there's an error
  });
} catch (err) {
  console.error('Exception occurred during server startup:', err.message);
  process.exit(1); // Exit the process if there's an exception
}


// Tired of booting or searching for the right instance of node.js to kill...

// Handle unhandled rejections (-> Promises)
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Close the server to free up the port
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Close the server to free up the port
  server.close(() => {
    process.exit(1);
  });
});

// Handle process termination
// eg. <CTRL>C in the terminal
process.on('SIGINT', () => {
  console.log('SIGINT signal received. Closing server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0); // Exit the process after closing the server, signaling no error condition
  });
});

// Handle process termination on Windows
// (ChatGPT) SIGBREAK is another signal commonly used for graceful termination of a process, 
// especially on Windows systems.While SIGINT is widely used across Unix - like 
// operating systems(such as Linux and macOS), Windows systems often use SIGBREAK for similar purposes.
process.on('SIGBREAK', () => {
  console.log('SIGBREAK signal received. Closing server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0); // Exit the process after closing the server, signaling no error condition
  });
});