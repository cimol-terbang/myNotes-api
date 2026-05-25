import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"

import { connectDB } from "./config/db.js"

import { setupRoutes } from "./routes/index.js"

dotenv.config()

await connectDB()

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
  allowedHeaders: ['Content-Type', 'x-admin-password'],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
}))


app.use(express.json())

app.use(cookieParser())

app.use(
  "/uploads",
  express.static("uploads")
)

setupRoutes(app)

const PORT =
  process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  )
})