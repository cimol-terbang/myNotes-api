import Comment from "../models/Comment.js"

export async function createComment(req, res) {
  try {
    const comment = Comment.create(req.body)

    res.status(201).json(comment)
  } catch (err) {
    res.status(500).json({
      error: err.message,
    })
  }
}

export async function getCommentsByPost(req, res) {
  try {
    const comments = Comment.find(
      { postId: req.params.postId },
      { sort: "createdAt", order: "DESC" }
    )

    res.json(comments)
  } catch (err) {
    res.status(500).json({
      error: err.message,
    })
  }
}
