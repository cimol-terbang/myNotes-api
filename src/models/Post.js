import { db } from "../config/db.js"

// Helper: parse tags JSON string → array
function parsePost(row) {
  if (!row) return null
  return {
    ...row,
    tags: JSON.parse(row.tags || "[]"),
    isPublished: Boolean(row.isPublished),
  }
}

function parsePosts(rows) {
  return rows.map(parsePost)
}

const Post = {
  create({ title, slug, content, category, tags = [], isPublished = false }) {
    const stmt = db.prepare(`
      INSERT INTO posts (title, slug, content, category, tags, isPublished)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    const info = stmt.run(
      title,
      slug,
      content,
      category,
      JSON.stringify(tags),
      isPublished ? 1 : 0
    )
    return Post.findById(info.lastInsertRowid)
  },

  findById(id) {
    const row = db
      .prepare("SELECT * FROM posts WHERE id = ?")
      .get(id)
    return parsePost(row)
  },

  findOne({ slug, isPublished } = {}) {
    let query = "SELECT * FROM posts WHERE 1=1"
    const params = []

    if (slug !== undefined) {
      query += " AND slug = ?"
      params.push(slug)
    }
    if (isPublished !== undefined) {
      query += " AND isPublished = ?"
      params.push(isPublished ? 1 : 0)
    }

    const row = db.prepare(query).get(...params)
    return parsePost(row)
  },

  find({ isPublished, category, tag } = {}, { sort = "createdAt", order = "DESC" } = {}) {
    let query = "SELECT * FROM posts WHERE 1=1"
    const params = []

    if (isPublished !== undefined) {
      query += " AND isPublished = ?"
      params.push(isPublished ? 1 : 0)
    }
    if (category !== undefined) {
      query += " AND category = ?"
      params.push(category)
    }
    if (tag !== undefined) {
      // tags stored as JSON array, use LIKE for simple match
      query += " AND tags LIKE ?"
      params.push(`%"${tag}"%`)
    }

    query += ` ORDER BY ${sort} ${order}`

    const rows = db.prepare(query).all(...params)
    return parsePosts(rows)
  },

  findByIdAndDelete(id) {
    db.prepare("DELETE FROM posts WHERE id = ?").run(id)
  },
}

export default Post
