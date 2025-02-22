import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import { app } from "./app.js";
import setupSocket from "./socket.js";
import http from "http";

dotenv.config({
    path: "./.env",
});

const server = http.createServer(app); // Use HTTP server

connectDB()
    .then(() => {
        server.listen(process.env.PORT || 8000, () => { // Make sure WebSocket is on the same server
            console.log(`Server is running at port: ${process.env.PORT || 8000}`);
        });
        setupSocket(server); // Correctly attach WebSocket to the server
    })
    .catch((error) => {
        console.log("MongoDB connection failed !!!", error);
    });
