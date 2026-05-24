import express from "express"

import {
  createComment,
  getCommentsByPost,
} from "../controllers/commentController.js"

const router = express.Router()

router.post("/", createComment)

router.get(
  "/:postId",
  getCommentsByPost
)

export default router