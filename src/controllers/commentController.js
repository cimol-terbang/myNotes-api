import Comment from "../models/Comment.js"

export async function createComment(
  req,
  res
) {
  try {
    const comment =
      await Comment.create(req.body)

    res.status(201).json(comment)

  } catch (err) {
    res.status(500).json({
      error: err.message,
    })
  }
}

export async function getCommentsByPost(
  req,
  res
) {
  try {
    const comments =
      await Comment.find({
        postId: req.params.postId,
      }).sort({
        createdAt: -1,
      })

    res.json(comments)

  } catch (err) {
    res.status(500).json({
      error: err.message,
    })
  }
}