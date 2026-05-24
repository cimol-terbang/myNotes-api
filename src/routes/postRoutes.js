import express from "express"

import {
  getPosts,
  getPostBySlug,
  getPostsByCategory,
  getPostsByTag,
} from "../controllers/postController.js"

const router = express.Router()

router.get("/", getPosts)

router.get(
  "/category/:category",
  getPostsByCategory
)

router.get(
  "/tag/:tag",
  getPostsByTag
)

router.get("/:slug", getPostBySlug)

export default router