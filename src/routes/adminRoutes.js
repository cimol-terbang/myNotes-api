import express from "express"

import {
  createPost,
  deletePost,
  updatePost,
  getAllPostsAdmin,
} from "../controllers/postController.js"

import {
  getImages,
  renameImage,
  deleteImage,
  downloadImage,
} from "../controllers/imageController.js"

import { adminMiddleware } from "../middleware/adminMiddleware.js"
import { upload } from "../middleware/uploadMiddleware.js"

const router = express.Router()

router.post("/login", (req, res) => {
  const { password } = req.body
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "wrong password" })
  }
  res.cookie("admin_session", process.env.ADMIN_PASSWORD, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  })
  res.json({ message: "login success" })
})

router.get("/posts", adminMiddleware, getAllPostsAdmin)
router.post("/posts", adminMiddleware, createPost)
router.put("/posts/:id", adminMiddleware, updatePost)
router.delete("/posts/:id", adminMiddleware, deletePost)

router.post("/upload", adminMiddleware, upload.single("image"), (req, res) => {
  res.json({ url: `/uploads/${req.file.filename}` })
})

// Image Management routes
router.get("/images", adminMiddleware, getImages)
router.put("/images/rename", adminMiddleware, renameImage)
router.delete("/images/:filename", adminMiddleware, deleteImage)
router.get("/images/download/:filename", adminMiddleware, downloadImage)

export default router