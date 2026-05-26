import express from "express";
import { getUploadsDir } from "./utils/uploads.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js"

import { setupRoutes } from "./routes/index.js"

dotenv.config()

// SQLite is synchronous — no await needed
connectDB()

const app = express()

const allowedOrigins = process.env.FRONTEND_ORIGIN
  ? process.env.FRONTEND_ORIGIN.split(',').map(o => o.trim())
  : []

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g. curl, mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`))
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'x-admin-password'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

app.use(express.json())

app.use(cookieParser())

app.use(
  "/uploads",
  express.static(getUploadsDir())
)

setupRoutes(app)

const PORT =
  process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  )
})
