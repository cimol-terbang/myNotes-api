import express from "express"

import {
  createPost,
  deletePost,
} from "../controllers/postController.js"

import { adminMiddleware }
from "../middleware/adminMiddleware.js"

import { upload }
from "../middleware/uploadMiddleware.js"

const router = express.Router()

router.post(
  "/login",

  (req, res) => {
    const { password } = req.body

    if (
      password !==
      process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        error: "wrong password",
      })
    }

    res.cookie(
      "admin_session",
      process.env.ADMIN_PASSWORD,
      {
        httpOnly: true,
        // Use secure cookies in production (HTTPS) and allow cross-site cookie in development
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        // Allow credentials to be sent with cross-origin requests
        // (CORS middleware already sets credentials: true)
      }
    )

    res.json({
      message: "login success",
    })
  }
)

router.post(
  "/posts",
  adminMiddleware,
  createPost
)

router.delete(
  "/posts/:id",
  adminMiddleware,
  deletePost
)

router.post(
  "/upload",

  adminMiddleware,

  upload.single("image"),

  (req, res) => {
    res.json({
      url:
        "/uploads/" +
        req.file.filename,
    })
  }
)

export default router