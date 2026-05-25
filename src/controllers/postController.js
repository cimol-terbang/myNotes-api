import Post from "../models/Post.js"

export async function createPost(req, res) {
  try {
    const post = Post.create(req.body)

    res.status(201).json(post)
  } catch (err) {
    res.status(500).json({
      error: err.message,
    })
  }
}

export async function getPosts(req, res) {
  try {
    const posts = Post.find(
      { isPublished: true },
      { sort: "createdAt", order: "DESC" }
    )

    res.json(posts)
  } catch (err) {
    res.status(500).json({
      error: err.message,
    })
  }
}

export async function getPostBySlug(req, res) {
  try {
    const post = Post.findOne({
      slug: req.params.slug,
      isPublished: true,
    })

    if (!post) {
      return res.status(404).json({
        error: "post not found",
      })
    }

    res.json(post)
  } catch (err) {
    res.status(500).json({
      error: err.message,
    })
  }
}

export async function getPostsByCategory(req, res) {
  try {
    const posts = Post.find({
      category: req.params.category,
      isPublished: true,
    })

    res.json(posts)
  } catch (err) {
    res.status(500).json({
      error: err.message,
    })
  }
}

export async function getPostsByTag(req, res) {
  try {
    const posts = Post.find({
      tag: req.params.tag,
      isPublished: true,
    })

    res.json(posts)
  } catch (err) {
    res.status(500).json({
      error: err.message,
    })
  }
}

export async function deletePost(req, res) {
  try {
    Post.findByIdAndDelete(req.params.id)

    res.json({
      message: "deleted",
    })
  } catch (err) {
    res.status(500).json({
      error: err.message,
    })
  }
}
