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
        secure: false,
        sameSite: "lax",
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