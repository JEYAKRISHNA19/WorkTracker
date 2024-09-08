// testEnv.js
import dotenv from 'dotenv';
dotenv.config();

console.log("Session Secret:", process.env.SESSION_SECRET);