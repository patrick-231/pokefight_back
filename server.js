"use strict";

const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./dbinit");
const isPortInUse = require("./src/utils/checkPort");

async function main() {
  try {
    // Load environment variables
    dotenv.config();

    // Check PORT for being allocated already.
    // This can happen
    // a) when another application blocks the port
    // b) when this application is terminated without deattaching
    // c) the debug process and node itself collide.
    // this leads to the debugger complaining that the port is allocated
    // (this holds for EVERY port we want to use)
    // while we can see that the port we want to use is allocated by node itself!
    // This happens in VSCode as in VS 2002.
    // One reason in VS 2022 is that this setting in the project file
    // <SaveNodeJsSettingsInProjectFile>True</SaveNodeJsSettingsInProjectFile>
    // should be present and is not, dependent on the history of the project
    // newly created or generated from existing code.

    const PORT = process.env.PORT || 8080;

    const portInUse = await isPortInUse(PORT);
    if (portInUse) {
      console.log(`Port ${PORT} is already in use`);
      return;
    }

    // Middleware
    app.use(express.json());
    app.use(cors());
    app.use(express.urlencoded({ extended: true })); // form submission

    // Connect to the database
    await connectDB();
    console.log("Database connected successfully.".green);

    // Define routes
    app.get("/", (req, res) => {
      res.send("Welcome to our ultimate PokeFight API!");
    });
    console.log("Welcome to our ultimate PokeFight API!");

    // Define your routes and middleware here
    //
    // Example:
    // const anyrouter = require("./src/routes/anyrouter");
    // app.use("/api/anyrouter", anyrouter);
    //

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`.rainbow);
    });

    // Error handling for server startup (for sure, we checked the port being accessible already)
    // Do we have a valid server instance here?
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
      } else {
        console.error('Error starting server:', err.message);
      }
      process.exit(1);
    });

    // Otherwise: Booting or searching for the right instance of node/nodemon to kill...
    // Handle unhandled rejections
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
  } catch (error) {
    console.error('Exception occurred during server startup:', error.message);
    process.exit(1);
  }
}

main().catch(err => console.error('Error in main:', err));
